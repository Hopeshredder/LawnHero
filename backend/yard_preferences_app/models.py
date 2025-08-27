from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# TODO: VERIFY YARD IS IMPORTED CORRECTLY WHEN YARD_APP IS COMPLETED AND MERGED
from yard_app.models import Yard


# Create your models here.
class Preferences(models.Model):

    yard = models.OneToOneField(
        Yard, related_name="yard_preferences", on_delete=models.CASCADE
    )

    """
    Intervals are set in DAYS
    """
    # Watering interval set as FLOAT for cases where the watering sessions needs to be split due to soil/grass type (ex. sandy soil)
    watering_interval = models.FloatField(
        default=2.0, validators=[MinValueValidator(0.5), MaxValueValidator(7)]
    )
    fertilizing_interval = models.PositiveIntegerField(
        default=90, validators=[MinValueValidator(15), MaxValueValidator(365)]
    )
    mowing_interval = models.PositiveIntegerField(
        default=7, validators=[MinValueValidator(1), MaxValueValidator(30)]
    )
    aeration_interval = models.PositiveIntegerField(
        default=180, validators=[MinValueValidator(30), MaxValueValidator(365)]
    )
    dethatching_interval = models.PositiveIntegerField(
        default=180, validators=[MinValueValidator(30), MaxValueValidator(365)]
    )

    # Watering rate measured in INCHES per WEEK (7 DAYS)
    watering_rate = models.FloatField(
        default=2.0, validators=[MinValueValidator(0.5), MaxValueValidator(5)]
    )

    # Fertilizing rate measured in POUNDS per 1000sqft
    fertilizing_rate = models.FloatField(
        default=1, validators=[MinValueValidator(0), MaxValueValidator(10)]
    )

    def __str__(self):
        return f"Preferences for yard id: {self.yard.id}"
