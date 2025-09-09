from rest_framework import serializers
from .models import Yard


class SuperTipsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Yard
        fields = "__all__"


class SuperTipPromptSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    yard_name = serializers.CharField(max_length=100)
    zip_code = serializers.CharField(max_length=10)
    yard_size = serializers.IntegerField(min_value=0)
    soil_type = serializers.CharField(max_length=20)
    grass_type = serializers.CharField(max_length=20)
    watering_interval = serializers.FloatField(min_value=0.5, max_value=7)
    watering_rate = serializers.FloatField(min_value=0.5, max_value=5)
    mowing_interval = serializers.IntegerField(min_value=0, max_value=30)

    def validate(self, attrs):
        for key in ("soil_type", "grass_type"):
            val = attrs.get(key)
            if isinstance(val, str) and not val.strip():
                attrs[key] = "Unknown"
        return attrs
