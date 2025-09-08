from django.contrib.auth import get_user_model
from rest_framework import serializers as s
from .models import User

User = get_user_model()
PASSWORD_MIN_LENGTH = 1


class UserSerializer(s.ModelSerializer):
    password = s.CharField(
        write_only=True, min_length=PASSWORD_MIN_LENGTH, trim_whitespace=False
    )

    class Meta:
        model = User
        fields = ["id", "email", "password"]

    def create(self, validated_data):
        print("validated data:", validated_data)
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


class ProfileUpdateSerializer(s.Serializer):
    current_password = s.CharField(write_only=True, required=True)
    new_email = s.EmailField(required=False, allow_null=True, allow_blank=True)
    new_password = s.CharField(write_only=True, required=False, min_length=8)

    def validate(self, attrs):
        if not attrs.get("new_email") and not attrs.get("new_password"):
            raise s.ValidationError("Provide new_email or new_password.")
        return attrs