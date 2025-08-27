from django.urls import path
from .views import YardPreferences

urlpatterns = [
    # Payload will contain fields to update with new value:
    #     {
    #         'watering_interval': 3.0,
    #         'mowing_interval': 4,
    #     }
    path("<int:yard_id>/", YardPreferences.as_view(), name="yard-preferences"),
]
