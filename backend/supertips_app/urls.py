from django.urls import path

from .views import SuperTips

urlpatterns = [
    path("<int:yard_id>/", SuperTips.as_view()),
]
