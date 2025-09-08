import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()
client = APIClient()


@pytest.fixture(name="client")
def client_fixture():
    return APIClient()


def test_signup_creates_user(db):
    resp = client.post(
        reverse("users_app:SignUp"), {"email": "a@a.com", "password": "pw"}
    )
    assert resp.status_code == 201
    assert resp.json() == {"email": "a@a.com"}
    assert User.objects.filter(email="a@a.com").exists()


def test_login_sets_cookie(db, client):
    User.objects.create_user(email="b@b.com", password="pw")
    resp = client.post(
        reverse("users_app:Login"), {"email": "b@b.com", "password": "pw"}
    )
    assert resp.status_code == 200
    assert resp.json() == {"email": "b@b.com", "detail": "login successful"}
    assert "auth_token" in resp.cookies


def test_logout_removes_cookie(db, client):
    user = User.objects.create_user(email="c@c.com", password="pw")
    client.force_authenticate(user=user)
    resp = client.post(reverse("users_app:Logout"))
    assert resp.status_code == 204
    assert resp.data is None
    assert "auth_token" not in resp.cookies


def test_info_requires_auth(db, client):
    resp = client.get(reverse("users_app:Info"))
    assert resp.status_code == 401
    assert resp.json() == {"detail": "Authentication credentials were not provided."}


def test_info_returns_user_details(db, client):
    user = User.objects.create_user(email="d@d.com", password="pw")
    client.force_authenticate(user=user)
    resp = client.get(reverse("users_app:Info"))
    assert resp.status_code == 200
    assert resp.json() == {"email": "d@d.com", "is_super": False}


def test_authme_anonymous_user(db, client):
    resp = client.get(reverse("users_app:AuthMe"))
    assert resp.status_code == 200
    assert resp.json() == {"email": None, "is_super": False}


def test_authme_authenticated_user(db, client):
    user = User.objects.create_user(email="e@e.com", password="pw")
    client.force_authenticate(user=user)
    resp = client.get(reverse("users_app:AuthMe"))
    assert resp.status_code == 200
    assert resp.json() == {"email": "e@e.com", "is_super": False}