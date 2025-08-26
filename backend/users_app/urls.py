from django.urls import path
from users_app.views import Login, Logout, SignUp, AuthMe, Info

urlpatterns = [
    path("login/", Login.as_view()),
    path("logout/", Logout.as_view()),
    path("signup/", SignUp.as_view()),
    path("info/", Info.as_view()),
    path("auth/me", AuthMe.as_view()),
]