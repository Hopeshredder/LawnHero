from django.urls import path

from .views import SuperTipsView

urlpatterns = [
    path("<int:yard_id>/", SuperTipsView.as_view()),
]
