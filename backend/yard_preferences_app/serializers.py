from rest_framework.serializers import ModelSerializer

from .models import Preferences

class YardPreferencesSerializer(ModelSerializer):
    class Meta:
        model = Preferences
        fields = "__all__"