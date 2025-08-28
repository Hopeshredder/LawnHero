from django.db import models
from users_app.models import User


# Create your models here.
class YardGroup(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="yard_groups")
    group_name = models.CharField(max_length=100, default="Unnamed Group")


class Yard(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="yards")
    yard_name = models.CharField(max_length=100, default="Unnamed Yard")
    yard_size = models.IntegerField(min_value=0, default=0)
    soil_type = models.CharField(max_length=20, default="Unknown")
    grass_type = models.CharField(max_length=20, default="Unknown")
    longitude = models.CharField(max_length=100, default="Unknown")
    latitude = models.CharField(max_length=100, default="Unknown")
    yard_group = models.ForeignKey(
        YardGroup, on_delete=models.SET_NULL, related_name="yards", null=True
    )
