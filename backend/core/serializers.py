from rest_framework import serializers
from django.utils import timezone
from .models import Device, Telemetry

# Lista urządzeń (mapa) – bez metod get_*, pola z adnotacji z querysetu
class DeviceListSerializer(serializers.ModelSerializer):
    last_level_pct = serializers.FloatField(read_only=True, allow_null=True)
    last_ts = serializers.DateTimeField(read_only=True, allow_null=True)

    class Meta:
        model = Device
        fields = (
            'id',
            'serial_number',
            'name',
            'latitude',          # UPEWNIJ SIĘ: w modelu są 'lat' i 'lng'
            'longitude',
            'status',
            'last_level_pct',
            'last_ts',
        )

# Szczegóły urządzenia – metadane + ostatnie wartości (także z adnotacji)
class DeviceDetailSerializer(serializers.ModelSerializer):
    last_level_pct = serializers.FloatField(read_only=True, allow_null=True)
    last_level_ml = serializers.FloatField(read_only=True, allow_null=True)
    last_ts = serializers.DateTimeField(read_only=True, allow_null=True)

    class Meta:
        model = Device
        fields = (
            'id', 'name', 'serial_number', 'latitude', 'longitude', 'status',
            'capacity_ml', 'threshold_pct',
            'last_level_pct', 'last_level_ml', 'last_ts'
        )

# Do listowania telemetrii (GET /devices/{id}/telemetry)
class TelemetrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Telemetry
        fields = ('id', 'ts', 'level_pct', 'level_ml', 'temperature_c')

# Do POST /api/telemetry – przyjmujemy serial zamiast UUID
class TelemetryIngestSerializer(serializers.ModelSerializer):
    device_serial = serializers.CharField(write_only=True)

    class Meta:
        model = Telemetry
        fields = ('device_serial', 'ts', 'level_pct', 'level_ml', 'temperature_c')

    def validate_ts(self, value):
        if timezone.is_naive(value):
            return timezone.make_aware(value, timezone=timezone.utc)
        return value

    def create(self, validated_data):
        serial = validated_data.pop('device_serial')
        try:
            device = Device.objects.get(serial_number=serial)
        except Device.DoesNotExist:
            raise serializers.ValidationError({"device_serial": "Nie znaleziono urządzenia o podanym serialu."})
        return Telemetry.objects.create(device=device, **validated_data)
