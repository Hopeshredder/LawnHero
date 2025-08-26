from rest_framework import serializers
from .models import Yard, YardGroup

class YardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Yard
        fields = '__all__'

class YardGroupSerializer(serializers.ModelSerializer):
    yards = YardSerializer(many=True, read_only=True)
    
    class Meta:
        model = YardGroup
        fields = '__all__'
