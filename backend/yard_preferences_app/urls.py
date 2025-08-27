from django.urls import path
from .views import YardPreferences

urlpatterns = [
    path("/<int:yard_id>/", YardPreferences.as_view()),
    
    # Payload will contain fields to update with new value:
    #     {
    #         'watering_interval': 3.0,
    #         'mowing_interval': 4,
    #     }
    path("/update/<int:yard_id>/", UpdatePreferences.as_view()),
]
