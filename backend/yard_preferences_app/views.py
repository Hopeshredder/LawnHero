from django.shortcuts import get_object_or_404

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

    def _get_user_yards(self, request, yard_id):
        # Ensures that the yard requested belongs to the requesting user

        # Since this is a helper function used in get and post, it allows
        # for a cleaner flow (can just check `if NOT yard: ...`)
        return Yard.objects.filter(id=yard_id, user=request.user).first()

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
        prefs, _ = Preferences.objects.get_or_create(yard=yard)
        data = YardPreferencesSerializer(prefs).data

        return Response({"ok": True, "data": data}, status=s.HTTP_200_OK)

    def post(self, request, yard_id):
        yard = self._get_user_yards(request, yard_id)

        if not yard:
            return Response(
                {
                    "ok": False,
                    "detail": f"No yard {yard_id} found for user {request.user.id}",
                },
                status=s.HTTP_404_NOT_FOUND,
            )

        prefs, created = Preferences.objects.get_or_create(yard=yard)
        serializer = YardPreferencesSerializer(
            instance=prefs, data=request.data, partial=True
        )

        if not serializer.is_valid():
            return Response(
                {"ok": False, "errors": serializer.errors},
                status=s.HTTP_400_BAD_REQUEST,
            )
        
        # Since the id and yard fields are set to read-only to avoid users updating someone else's prefs,
        # the `yard=yard` tells the serializer to use the pre-fetched yard when creating the instance
        serializer.save(yard=yard)


        return Response(
            {"ok": True, "detail": "Preferences created" if created else "Preferences updates"},
            status=s.HTTP_201_CREATED if created else s.HTTP_200_OK,
        )
