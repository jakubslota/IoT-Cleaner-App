import os, django, random
from datetime import datetime, timedelta, timezone
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django.setup()
from core.models import Device, Telemetry

DEVICES = [
    {"serial_number": "A-0001", "name": "Automat 0001", "latitude": 40.7128, "longitude": 21.0060},
    {"serial_number": "A-0002", "name": "Automat 0002", "latitude": 54.5435, "longitude": 19.3454},
]

for d in DEVICES:
    obj, _ = Device.objects.get_or_create(
        serial_number=d["serial_number"],
        defaults={
            "name": d["name"],
            "latitude": d["latitude"],
            "longitude": d["longitude"],
            "capacity_ml": 3000,
            "threshold_pct": 20.0,
        }
    )

for dev in Device.objects.all():
    Telemetry.objects.filter(device=dev).delete()
    now = datetime.now(timezone.utc)
    level = random.uniform(40.0, 80.0)

    for i in range(0, 48*3):
        ts = now - timedelta(minutes=30*i)
        level = max(0, level - random.uniform(0.0, 0.3))
        Telemetry.objects.create(
            device=dev,
            ts=ts,
            level_pct=round(level, 1),
            level_ml=None,
            temperature_c=22+random.uniform(-1, 1)
        )

print("Mock data seeded successfully.")