from django.db import models
from users_app.models import User

# Create your models here.
class YardGroup(models.Model):
    group_name = models.CharField(max_length=100)

class Yard(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='yards')
    yard_name = models.CharField(max_length=100)
    yard_size = models.IntegerField() # add validators, min max values for yard size?
    soil_type = models.CharField(max_length=20)
    grass_type = models.CharField(max_length=20)
    yard_group = models.ForeignKey(YardGroup, on_delete=models.CASCADE, related_name='yards', null=True)

