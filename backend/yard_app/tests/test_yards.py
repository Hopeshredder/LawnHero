from django.urls import reverse
from rest_framework.test import APIClient
from users_app.models import User
from yard_app.models import Yard, YardGroup

client = APIClient()

# Create your tests here.


def test_create_and_retrieve_yard(db):
    user = User.objects.create_user(email="u@y.com", password="pw")
    client.force_authenticate(user)
    resp = client.post(reverse("yard-list"), {"yard_name": "Front", "yard_size": 10})
    assert resp.status_code == 201
    yard_id = resp.data["id"]
    resp = client.get(reverse("yard-detail", args=[yard_id]))
    assert resp.status_code == 200
    assert resp.data["yard_name"] == "Front"


def test_update_yard(db):
    user = User.objects.create_user(email="u2@y.com", password="pw")
    client.force_authenticate(user)
    resp = client.post(reverse("yard-list"), {"yard_name": "Front", "yard_size": 10})
    yard_id = resp.data["id"]
    resp = client.put(
        reverse("yard-detail", args=[yard_id]),
        {"yard_name": "Back", "yard_size": 20},
    )
    assert resp.status_code == 200
    assert resp.data["yard_name"] == "Back"


def test_delete_yard(db):
    user = User.objects.create_user(email="u3@y.com", password="pw")
    client.force_authenticate(user)
    resp = client.post(reverse("yard-list"), {"yard_name": "Front", "yard_size": 10})
    yard_id = resp.data["id"]
    resp = client.delete(reverse("yard-detail", args=[yard_id]))
    assert resp.status_code == 204
    resp = client.get(reverse("yard-detail", args=[yard_id]))
    assert resp.status_code == 404


def test_create_and_delete_yard_group(db):
    user = User.objects.create_user(email="u4@y.com", password="pw")
    client.force_authenticate(user)
    resp = client.post(reverse("yard-group-list"), {"group_name": "Main"})
    assert resp.status_code == 201
    group_id = resp.data["id"]
    resp = client.delete(reverse("yard-group-delete", args=[group_id]))
    assert resp.status_code == 204
    assert YardGroup.objects.filter(id=group_id).count() == 0


def test_assign_and_remove_yard_from_group(db):
    user = User.objects.create_user(email="u5@y.com", password="pw")
    client.force_authenticate(user)
    yard_resp = client.post(
        reverse("yard-list"), {"yard_name": "Front", "yard_size": 10}
    )
    yard_id = yard_resp.data["id"]
    group_resp = client.post(reverse("yard-group-list"), {"group_name": "G1"})
    group_id = group_resp.data["id"]
    resp = client.post(
        reverse("group-method", kwargs={"group_id": group_id, "yard_id": yard_id})
    )
    assert resp.status_code == 201
    assert Yard.objects.get(id=yard_id).yard_group_id == group_id
    resp = client.delete(
        reverse("group-method", kwargs={"group_id": group_id, "yard_id": yard_id})
    )
    assert resp.status_code == 204
    assert Yard.objects.get(id=yard_id).yard_group is None
