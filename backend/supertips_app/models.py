from django.db import models
from yard_app.models import Yard


# Create your models here.
class SuperTips(models.Model):
    yard = models.ForeignKey(Yard, on_delete=models.CASCADE, related_name="supertips")
    watering = models.TextField(null=False)
    tools = models.TextField(null=False)
    yard_problems = models.TextField(null=False)
    mowing = models.TextField(null=False)
    fertilizing = models.TextField(null=False)
    aerating = models.TextField(null=False)
    detatching = models.TextField(null=False)
