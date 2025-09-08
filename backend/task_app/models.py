from django.db import models
from django.core.validators import MinValueValidator
import datetime
from yard_app.models import Yard

# Create your models here.
class Task(models.Model):
    activity_type = models.CharField(max_length=100)
    day_scheduled = models.DateField(default=datetime.date.today)
    day_completed = models.DateField(null=True, blank=True) 
    yard = models.ForeignKey(Yard, on_delete=models.CASCADE, related_name='tasks')
    auto_generated = models.BooleanField(default=False)