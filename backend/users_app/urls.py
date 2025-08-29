from django.urls import path
from users_app.views import Login, Logout, SignUp, AuthMe, Info

app_name = "users_app"

urlpatterns = [
    path("login/", Login.as_view(), name="Login"),
    path("logout/", Logout.as_view(), name="Logout"),
    path("signup/", SignUp.as_view(), name="SignUp"),
    path("info/", Info.as_view(), name="Info"),
    path("auth/me/", AuthMe.as_view(), name="AuthMe"),
]
