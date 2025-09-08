from django.test import TestCase

# Create your tests here.
from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from users_app.models import User
from yard_app.models import Yard
from datetime import date, timedelta


class TaskAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_and_fetch_task(self):
        user = User.objects.create_user(email="t@t.com", password="pw")
        yard = Yard.objects.create(user=user, yard_name="Front")
        self.client.force_authenticate(user)
        payload = {"activity_type": "Mow", "day_scheduled": date.today()}
        resp = self.client.post(reverse("task-add", args=[yard.id]), payload)
        self.assertEqual(resp.status_code, 201)
        task_id = resp.data["id"]
        expected = {
            "id": task_id,
            "activity_type": "Mow",
            "day_scheduled": date.today().isoformat(),
            "day_completed": None,
            "yard": yard.id,
            "auto_generated": False,
        }
        self.assertEqual(resp.data, expected)
        resp = self.client.get(reverse("task-detail", args=[task_id]))
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data, expected)

    def test_due_and_completed_view(self):
        user = User.objects.create_user(email="t2@t.com", password="pw")
        yard = Yard.objects.create(user=user, yard_name="Back")
        self.client.force_authenticate(user)
        upcoming_resp = self.client.post(
            reverse("task-add", args=[yard.id]),
            {"activity_type": "Mow", "day_scheduled": date.today() + timedelta(days=1)},
        )
        recent_resp = self.client.post(
            reverse("task-add", args=[yard.id]),
            {
                "activity_type": "Water",
                "day_scheduled": date.today(),
                "day_completed": date.today(),
            },
        )
        resp = self.client.get(reverse("task-due-and-completed", args=[yard.id]))
        self.assertEqual(resp.status_code, 200)
        expected = {
            "upcoming_tasks": [
                {
                    "id": upcoming_resp.data["id"],
                    "activity_type": "Mow",
                    "day_scheduled": (date.today() + timedelta(days=1)).isoformat(),
                    "day_completed": None,
                    "yard": yard.id,
                    "auto_generated": False,
                }
            ],
            "recent_tasks": [
                {
                    "id": recent_resp.data["id"],
                    "activity_type": "Water",
                    "day_scheduled": date.today().isoformat(),
                    "day_completed": date.today().isoformat(),
                    "yard": yard.id,
                    "auto_generated": False,
                }
            ],
        }
        self.assertEqual(resp.data, expected)

    def test_update_task(self):
        user = User.objects.create_user(email="t3@t.com", password="pw")
        yard = Yard.objects.create(user=user, yard_name="Side")
        self.client.force_authenticate(user)
        resp = self.client.post(
            reverse("task-add", args=[yard.id]),
            {"activity_type": "Mow", "day_scheduled": date.today()},
        )
        self.assertEqual(resp.status_code, 201)
        task_id = resp.data["id"]
        resp = self.client.put(
            reverse("task-detail", args=[task_id]),
            {"activity_type": "Trim"},
        )
        self.assertEqual(resp.status_code, 200)
        expected = {
            "id": task_id,
            "activity_type": "Trim",
            "day_scheduled": date.today().isoformat(),
            "day_completed": None,
            "yard": yard.id,
            "auto_generated": False,
        }
        self.assertEqual(resp.data, expected)

    def test_delete_task(self):
        user = User.objects.create_user(email="t4@t.com", password="pw")
        yard = Yard.objects.create(user=user, yard_name="Patio")
        self.client.force_authenticate(user)
        resp = self.client.post(
            reverse("task-add", args=[yard.id]),
            {"activity_type": "Mow", "day_scheduled": date.today()},
        )
        self.assertEqual(resp.status_code, 201)
        task_id = resp.data["id"]
        resp = self.client.delete(reverse("task-detail", args=[task_id]))
        self.assertEqual(resp.status_code, 204)
        resp = self.client.get(reverse("task-detail", args=[task_id]))
        self.assertEqual(resp.status_code, 404)
        self.assertEqual(resp.data, {"error": "Task not found"})