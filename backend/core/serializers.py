from rest_framework import serializers
from django.utils import timezone
from .models import Device, Telemetry

class DeviceListSerializers(serializers.ModelSerializer):
    last_level_pct = serializers.SerializerMethodField()
    last_ts = serializers.SerializerMethodField()

    class Meta:
        model = Device
        fields = (
            'id',
            'serial_number',
            'name',
            'latitude',
            'longitude',
            'status',
            'last_level_pct',
            'last_ts',
        )

    def get_last_level_pct(self, obj):
        t = obj.telemetry.order_by('-ts').first()
        return t.last_level_pct if t else None

    def get_last_ts(self, obj):
        t = obj.telemetry.order_by('-ts').first()
        return t.ts if t else None

class DeviceDetailSerializer(serializers.ModelSerializer):
    """Na ekran szczegółów: metadane + ostatnie wartości."""
    last_level_pct = serializers.SerializerMethodField()
    last_level_ml = serializers.SerializerMethodField()
    last_ts = serializers.SerializerMethodField()

    class Meta:
        model = Device
        fields = (
            'id', 'name', 'serial_number', 'lat', 'lng', 'status',
            'capacity_ml', 'threshold_pct',
            'last_level_pct', 'last_level_ml', 'last_ts'
        )

    def get_last_level_pct(self, obj):
        t = obj.telemetry.order_by('-ts').first()
        return t.level_pct if t else None

    def get_last_level_ml(self, obj):
        t = obj.telemetry.order_by('-ts').first()
        return t.level_ml if t else None

    def get_last_ts(self, obj):
        t = obj.telemetry.order_by('-ts').first()
        return t.ts if t else None

class TelemetryIngestSerializer(serializers.ModelSerializer):
    """
    Na POST /api/telemetry – przyjmujemy serial urządzenia,
    a nie UUID. Tworzymy rekord Telemetry dla danego urządzenia.
    """
    device_serial = serializers.CharField(write_only=True)

    class Meta:
        model = Telemetry
        fields = ('device_serial', 'ts', 'level_pct', 'level_ml', 'temperature_c')

    def validate_ts(self, value):
        # Upewnij się, że jest „aware” (z timezone)
        if timezone.is_naive(value):
            # jeśli dostaniesz naive, zamień na aware w UTC
            return timezone.make_aware(value, timezone=timezone.utc)
        return value

    def create(self, validated_data):
        serial = validated_data.pop('device_serial')
        try:
            device = Device.objects.get(serial_number=serial)
        except Device.DoesNotExist:
            raise serializers.ValidationError({"device_serial": "Nie znaleziono urządzenia o podanym serialu."})
        return Telemetry.objects.create(device=device, **validated_data)