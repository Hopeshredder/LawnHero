from django.contrib.auth import authenticate, login, logout

from rest_framework.views import APIView
from rest_framework import status as s
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .authentication import CookieTokenAuthentication, AUTH_TOKEN_COOKIE


from .serializers import UserSerializer


# Create your views here.
class SignUp(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token_obj = Token.objects.create(user=user)

        # Cookie-based auth
        response = Response({"email": user.email}, status=s.HTTP_201_CREATED)
        response.set_cookie(
            AUTH_TOKEN_COOKIE, token_obj.key, httponly=True, samesite="Lax"
        )
        return response


class Login(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data.copy()
        data["username"] = data.get("email")
        user = authenticate(username=data.get("username"), password=data.get("password"))

        if user:
            token_obj, _ = Token.objects.get_or_create(user=user)
            login(request=request, user=user)

            # Cookie-based auth
            response = Response({"email": user.email}, status=s.HTTP_200_OK)
            response.set_cookie(
                AUTH_TOKEN_COOKIE, token_obj.key, httponly=True, samesite="Lax"
            )
            return response

        else:
            return Response(
                {"detail": "No user matches those credentials"},
                status=s.HTTP_404_NOT_FOUND,
            )
