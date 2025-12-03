import uuid
from django.db import models

# Create your models here.

class Device(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    serial_number = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=120)
    latitude = models.FloatField()
    longitude = models.FloatField()
    capacity_ml = models.PositiveIntegerField(default=2000)
    threshold_pct = models.FloatField(default=20.0)
    status = models.CharField(max_length=16, default='ONLINE') # e.g., ONLINE, OFFLINE, MAINTENANCE
    instalation_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.serial_number})"

class Telemetry(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='telemetry')
    ts = models.DateTimeField()
    level_pct = models.FloatField()
    level_ml = models.FloatField(null=True, blank=True)
    temperature_c = models.FloatField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['device', 'ts']),
        ]
        ordering = ['-ts']