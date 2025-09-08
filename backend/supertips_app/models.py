from django.db import models
from yard_app.models import Yard


# Create your models here.
class SuperTips(models.Model):
    yard = models.ForeignKey(Yard, on_delete=models.CASCADE, related_name="supertips")
    watering = models.TextField(max_length=255, null=False)
    tools = models.TextField(max_length=255, null=False)
    yard_problems = models.TextField(max_length=255, null=False)
    mowing = models.TextField(max_length=255, null=False)
    fertilizing = models.TextField(max_length=255, null=False)
    aerating = models.TextField(max_length=255, null=False)
    detatching = models.TextField(max_length=255, null=False)