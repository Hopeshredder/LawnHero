from django.shortcuts import render, get_object_or_404

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status as s

from users_app.authentication import CookieTokenAuthentication

from .models import Preferences
from .serializers import YardPreferencesSerializer

# TODO: ENSURE IMPORT WORKS AFTER MERGE ON YARD_APP
from yard_app.models import Yard


# Create your views here.
class YardPreferences(APIView):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, yard_id):
        # Ensures that the yard requested belongs to the requesting user
        try:
            yard = Yard.objects.get(user=request.user, id=yard_id)
        except Exception as e:
            return Response(
                {
                    "ok": False,
                    "detail": f"No yard with that yard_id found for user_id: {request.user.id}",
                    "error": e,
                },
                status=s.HTTP_404_NOT_FOUND,
            )

        preferences = get_object_or_404(Preferences, yard=yard)
        ser_preferences = YardPreferencesSerializer(preferences).data

        return Response({"ok": True, "data": ser_preferences}, status=s.HTTP_200_OK)

    def post(self, request, yard_id):
        data = request.data.copy()

        yard = Yard.objects.get(id=yard_id)
        
