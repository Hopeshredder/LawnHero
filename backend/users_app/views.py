from django.db import transaction

from django.contrib.auth import (
    authenticate,
    login,
    logout as django_logout,
    update_session_auth_hash,
)

from rest_framework.views import APIView
from rest_framework import status as s
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .authentication import CookieTokenAuthentication, AUTH_TOKEN_COOKIE

from .models import User
from .serializers import UserSerializer, ProfileUpdateSerializer


# Create your views here.
class SignUp(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data.copy()
        data["username"] = data.get("email")
        serializer = UserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token_obj = Token.objects.create(user=user)

        # Cookie-based auth
        response = Response({"email": user.email}, status=s.HTTP_201_CREATED)
        response.set_cookie(
            AUTH_TOKEN_COOKIE, token_obj.key, httponly=True, samesite="Lax"
        )
        login(request=request, user=user)
        return response


class Login(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data.copy()
        data["username"] = data.get("email")
        user = authenticate(
            username=data.get("username"), password=data.get("password")
        )

        if user:
            token_obj, _ = Token.objects.get_or_create(user=user)
            login(request=request, user=user)

            # Cookie-based auth
            response = Response(
                {"email": user.email, "detail": "login successful"},
                status=s.HTTP_200_OK,
            )
            response.set_cookie(
                AUTH_TOKEN_COOKIE, token_obj.key, httponly=True, samesite="Lax"
            )
            return response

        else:
            return Response(
                {"detail": "No user matches those credentials"},
                status=s.HTTP_404_NOT_FOUND,
            )


class UserPermissions(APIView):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAuthenticated]


class Logout(UserPermissions):
    def post(self, request):
        # delete token if present (no errors if token doesn't exist)
        Token.objects.filter(user=request.user).delete()

        # Logout from backend
        django_logout(request)
        response = Response(status=s.HTTP_204_NO_CONTENT)

        # Checks if the AUTH_TOKEN cookie exists from the request
        # `delete_cookie()` doesn't remove 'AUTH_TOKEN' from cookies it
        # adds Set-Cookie with empty value and `max_age=0`/expired date and sends that in the response
        if AUTH_TOKEN_COOKIE in request.COOKIES:
            response.delete_cookie(AUTH_TOKEN_COOKIE)
        return response


class Info(UserPermissions):
    def get(self, request):
        return Response(
            {
                "email": request.user.email,
                "is_super": request.user.is_superuser,
            }
        )

    # TODO: UPDATE PROFILE INFO
    """
    Update logged-in user's email and password
    requires current password for any change
    rotates DRF token and session hash
    """

    def post(self, request):
        # Checks for presence of current password, new email and new password
        serializer = ProfileUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        # Verify current password
        if not user.check_password(serializer.validated_data["current_password"]):
            return Response(
                {"detail": "Current password is incorrect."},
                status=s.HTTP_400_BAD_REQUEST,
            )

        new_email = serializer.validated_data.get("new_email")
        new_password = serializer.validated_data.get("new_password")

        if not new_email and not new_password:
            return Response(
                {"detail": "Nothing to update"}, status=s.HTTP_400_BAD_REQUEST
            )
        with transaction.atomic():
            # change email and username
            if new_email and new_email != user.email:
                """
                check for unique email
                1. filter user model for match by email
                2. exclude current user from resulting list
                3. check if list exists (not empty results)
                """
                if User.objects.filter(email=new_email).exclude(id=user.id).exists():
                    return Response(
                        {"detail": "That email is already in use."},
                        status=s.HTTP_400_BAD_REQUEST,
                    )
                user.email = new_email
                user.username = new_email

            # Change password
            if new_password:
                user.set_password(new_password)

            user.save()

            # Keep session valid after password change
            Token.objects.filter(user=user).delete()
            new_token = Token.objects.create(user=user)

            # Issue new cookie token
            response = Response(
                {"email": user.email, "is_super": user.is_superuser},
                status=s.HTTP_200_OK,
            )
            response.set_cookie(
                AUTH_TOKEN_COOKIE, new_token.key, httponly=True, samesite="Lax"
            )
            return response


class AuthMe(UserPermissions):
    permission_classes = [AllowAny]

    def get(self, request):
        """
        If User is not logged in, return an anonymous user object
        This allows the user to explore the site without a registered user's permissions
        """
        if not request.user.is_authenticated:
            return Response(
                {
                    "email": None,
                    "is_super": False,
                }
            )

        """
        If the User is logged in, return the authenticated user object
        This allows for full site functionallity
        """
        return Response(
            {
                "email": request.user.email,
                "is_super": request.user.is_superuser,
            }
        )
