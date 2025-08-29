from django.test import TestCase

# Create your tests here.
from django.urls import reverse
from rest_framework.test import APIClient
from users_app.models import User
from yard_app.models import Yard

client = APIClient()


def test_get_creates_default_preferences(db):
    user = User.objects.create_user(email="p@p.com", password="pw")
    yard = Yard.objects.create(user=user, yard_name="Back")
    client.force_authenticate(user)
    resp = client.get(reverse("yard-preferences", args=[yard.id]))
    assert resp.status_code == 200
    assert resp.data["ok"] is True


def test_post_updates_preferences(db):
    user = User.objects.create_user(email="p2@p.com", password="pw")
    yard = Yard.objects.create(user=user, yard_name="Side")
    client.force_authenticate(user)
    resp = client.post(
        reverse("yard-preferences", args=[yard.id]),
        {"watering_interval": 3.5},
    )
    assert resp.status_code == 201


def test_get_returns_404_for_other_users_yard(db):
    owner = User.objects.create_user(email="o@p.com", password="pw")
    yard = Yard.objects.create(user=owner, yard_name="Other")
    user = User.objects.create_user(email="u@p.com", password="pw")
    client.force_authenticate(user)
    resp = client.get(reverse("yard-preferences", args=[yard.id]))
    assert resp.status_code == 404


def test_post_returns_404_for_other_users_yard(db):
    owner = User.objects.create_user(email="o2@p.com", password="pw")
    yard = Yard.objects.create(user=owner, yard_name="Other2")
    user = User.objects.create_user(email="u2@p.com", password="pw")
    client.force_authenticate(user)
    resp = client.post(
        reverse("yard-preferences", args=[yard.id]),
        {"watering_interval": 3},
    )
    assert resp.status_code == 404
