from rest_framework.authentication import TokenAuthentication

AUTH_TOKEN_COOKIE = "auth_token"

class CookieTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get(AUTH_TOKEN_COOKIE)
        if not token:
            return None
        return self.authenticate_credentials(token)