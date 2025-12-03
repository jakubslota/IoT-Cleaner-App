from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Device, Telemetry
from .serializers import DeviceListSerializers, DeviceDetailSerializer, TelemetryIngestSerializer

class DeviceListView(generics.ListAPIView):
    serializer_class = DeviceListSerializers
    def get_queryset(self):
        qs = Device.objects.all()
        bbox = self.request.query_params.get('bbox')
        if bbox:
            try:
                minLng, minLat, maxLng, maxLat = map(float, bbox.split(','))
                qs = qs.filter(lat__gte=minLat, lat__lte=maxLat, lng__gte=minLng, lng__lte=maxLng)
            except Exception:
                pass
        return qs

class DeviceDetailView(generics.RetrieveAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceDetailSerializer

class DeviceTelemetryView(generics.ListAPIView):
    def get(self, request, pk):
        limit = int(request.query_params.get('limit', 200))
        items = Telemetry.objects.filter(device_id=pk).order_by('-ts')[:limit]
        data = [
            {'ts': t.ts, 'level_pct': t.level_pct, 'level_ml': t.level_ml, 'temperature_c': t.temperature_c}
            for t in items
        ]
        return Response(data)

@api_view(['POST'])
def ingest_telemetry(request):
    ser = TelemetryIngestSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    ser.save()
    return Response({'status': 'created'}, status=status.HTTP_201_CREATED)