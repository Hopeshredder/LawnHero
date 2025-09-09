import os
from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework import status as s

from openai import OpenAI

from .prompt_helpers import build_user_prompt, parse_supertips
from .models import SuperTips as SuperTipsModel
from .serializers import SuperTipPromptSerializer, SuperTipsSerializer


from users_app.views import UserPermissions

from yard_app.models import Yard

from yard_preferences_app.models import Preferences

# Create your views here.
"""
Call from frontend to POST 
[] Get yard info
[] Get yard prefs
[] Pass both to serializer
[] serializer returns dictionary
[] run serialized_data.is_valid()
[] store serialized_data.validated_data to 'item'
[] 

"""
SYSTEM_PROMPT = (
    # TODO: ADD SYSTEM PROMPT
    """ You are LawnHero, a concise, practical lawn‑care assistant for homeowners. Your job is to transform the provided 'Yard Facts' into actionable, year‑round guidance tailored to location (zip code), grass type, soil type, yard size, and owner preferences.

Output exactly seven sections with these labels, in this order:

Watering:
Tools/Equipment:
Common Lawn Problems:
Mowing:
Fertilizing:
Aerating:
Dethatching:


Rules:

Write 3–4 full sentences per section.
No markdown, no lists/bullets, no emojis.
No brand or manufacturer names, and no URLs.
Use US units: inches of water per week, lbs of nitrogen per 1,000 sq ft, mowing height in inches, intervals in days/weeks.
Prefer safe, non‑chemical practices first; if chemicals are mentioned, keep general and non‑branded.
If grass_type or soil_type is 'Unknown', infer the predominant type for the zip code; if uncertain, give broadly applicable best practices.
Provide year‑round guidance; mention season‑specific timing only when it’s critical, briefly.
Be specific and quantified where possible; avoid vague terms like 'often' or 'regularly' without numbers.
If the owner preferences do not align with the ideal practices for the yard in question, suggest updated intervals and rates, if required.
Do not refer to yourself or to the prompt; just provide the guidance.


Assumptions:
'watering_rate' is total inches per week.
'watering_interval' is days between watering sessions; split recommended weekly water across sessions based on soil type.
'mowing_interval' is the typical days between mows, adjusted for growth rate. "
"""
)


class SuperTipsView(UserPermissions):
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    def _get_user_yards(self, request, yard_id):
        # Ensures that the yard requested belongs to the requesting user
        return Yard.objects.filter(id=yard_id, user=request.user).first()

    def post(self, request, yard_id):
        # Validate yard ownership
        yard = self._get_user_yards(request, yard_id)
        if not yard:
            return Response(
                {
                    "ok": False,
                    "detail": f"No yard {yard_id} found for user {request.user.id}",
                },
                status=s.HTTP_404_NOT_FOUND,
            )

        prefs = Preferences.objects.get(yard_id=yard_id)

        # Combine data sets to generate payload
        payload = {
            # yard info
            "yard_name": yard.yard_name,
            "zip_code": yard.zip_code,
            "yard_size": yard.yard_size,
            "soil_type": yard.soil_type,
            "grass_type": yard.grass_type,
            # prefs
            "watering_interval": prefs.watering_interval,
            "mowing_interval": prefs.mowing_interval,
            "watering_rate": prefs.watering_rate,
        }

        # Run payload through serializer for final validation
        serialized = SuperTipPromptSerializer(data=payload)
        serialized.is_valid(raise_exception=True)

        # Build user prompt with validated data
        user_prompt = build_user_prompt(serialized.validated_data)

        # Make OpenAI call with SystemPrompt and userPrompt
        resp = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.4,
        )
        text = resp.choices[0].message.content.strip()

        # returns a dict of category tips
        parsed = parse_supertips(text)

        # Persist tips to db
        tip, _ = SuperTipsModel.objects.update_or_create(yard=yard, defaults=parsed)

        return Response(
            {
                "success": True,
                "detail": f"Supertips created for yard {yard_id}.",
            },
            status=s.HTTP_201_CREATED,
        )

    def get(self, request, yard_id):
        yard = self._get_user_yards(request, yard_id)
        if not yard:
            return Response(
                {
                    "ok": False,
                    "detail": f"No yard {yard_id} found for user {request.user.id}",
                },
                status=s.HTTP_404_NOT_FOUND,
            )
        tips = SuperTipsModel.objects.get(yard_id=yard_id)
        s_tips = SuperTipsSerializer(tips).data

        return Response(s_tips, status=s.HTTP_200_OK)
