from django.contrib.auth import get_user_model
from rest_framework import serializers as s
from .models import User

User = get_user_model()
PASSWORD_MIN_LENGTH = 1

class UserSerializer(s.ModelSerializer):
    password = s.CharField(write_only=True, min_length=PASSWORD_MIN_LENGTH, trim_whitespace=False)

    class Meta:
        model = User
        fields = ["id","email", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        return User.objects.create_user(password=password, **validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
