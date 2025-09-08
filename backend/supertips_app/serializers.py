from rest_framework.serializers import ModelSerializer
from .models import Yard


class SuperTipsSerializer(ModelSerializer):
    class Meta:
        model = Yard
        fields = "__all__"
