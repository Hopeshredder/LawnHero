import os
from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework import status as s

from openai import OpenAI

from .prompt_helpers import build_user_prompt
from .serializers import SuperTipPromptSerializer

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
        serializer = SuperTipPromptSerializer(data=payload).is_valid(
            raise_exception=True
        )

        # Build user prompt with validated data
        user_prompt = build_user_prompt(serializer.validated_data)

        return Response({"ok": True})
