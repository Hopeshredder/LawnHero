from django.urls import path
from .views import YardView, YardGroupView, YardGroupMethodView

urlpatterns = [
    path('<int:yard_id>/', YardView.as_view(), name='yard-detail'),
    path('yard-groups/', YardGroupView.as_view(), name='yard-group-list'),
    path('yard-groups/<int:group_id>/', YardGroupView.as_view(), name='yard-group-delete'),
    path('yard-groups/<int:group_id>/yard/<int:yard_id>/', YardGroupMethodView.as_view(), name='group-method'),
]
