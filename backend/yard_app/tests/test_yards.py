from django.urls import reverse
from rest_framework.test import APIClient
from users_app.models import User
from yard_app.models import Yard, YardGroup

client = APIClient()

# Create your tests here.


def test_create_and_retrieve_yard(db):
    user = User.objects.create_user(email="u@y.com", password="pw")
    client.force_authenticate(user)
    resp = client.post(reverse("yard-list"), {"yard_name": "Front", "yard_size": 10, "zip_code":"27613", "latitude":"lat", "longitude":"long"})
    assert resp.status_code == 201
    yard_id = resp.data["id"]
    expected = {
        "id": yard_id,
        "user": user.id,
        "yard_name": "Front",
        "zip_code": "27613",
        "yard_size": 10,
        "soil_type": "Unknown",
        "grass_type": "Unknown",
        "longitude": "long",
        "latitude": "lat",
        "yard_group": None,
    }
    assert resp.data == expected
    resp = client.get(reverse("yard-detail", args=[yard_id]))
    assert resp.status_code == 200
    assert resp.data == expected


def test_update_yard(db):
    user = User.objects.create_user(email="u2@y.com", password="pw")
    client.force_authenticate(user)
    resp = client.post(reverse("yard-list"), {"yard_name": "Front", "yard_size": 10, "zip_code":"27613", "latitude":"lat", "longitude":"long"})
    yard_id = resp.data["id"]
    resp = client.put(
        reverse("yard-detail", args=[yard_id]),
        {"yard_name": "Back", "yard_size": 20},
    )
    assert resp.status_code == 200
    expected = {
        "id": yard_id,
        "user": user.id,
        "yard_name": "Back",
        "zip_code": "27613",
        "yard_size": 20,
        "soil_type": "Unknown",
        "grass_type": "Unknown",
        "longitude": "long",
        "latitude": "lat",
        "yard_group": None,
    }
    assert resp.data == expected


def test_delete_yard(db):
    user = User.objects.create_user(email="u3@y.com", password="pw")
    client.force_authenticate(user)
    resp = client.post(reverse("yard-list"), {"yard_name": "Front", "yard_size": 10})
    yard_id = resp.data["id"]
    resp = client.delete(reverse("yard-detail", args=[yard_id]))
    assert resp.status_code == 204
    resp = client.get(reverse("yard-detail", args=[yard_id]))
    assert resp.status_code == 404
    assert resp.data == {"error": "Yard not found"}


def test_create_and_delete_yard_group(db):
    user = User.objects.create_user(email="u4@y.com", password="pw")
    client.force_authenticate(user)
    resp = client.post(reverse("yard-group-list"), {"group_name": "Main"})
    assert resp.status_code == 201
    group_id = resp.data["id"]
    assert resp.data == {
        "id": group_id,
        "user": user.id,
        "group_name": "Main",
        "yards": [],
    }
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
    assert resp.data == {"success": "Yard added to group"}
    assert Yard.objects.get(id=yard_id).yard_group_id == group_id
    resp = client.delete(
        reverse("group-method", kwargs={"group_id": group_id, "yard_id": yard_id})
    )
    assert resp.status_code == 204
    assert resp.data == {"success": "Yard removed from group"}
    assert Yard.objects.get(id=yard_id).yard_group is None