from django.db.models import OuterRef, Subquery, F, Q
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Device, Telemetry
from .serializers import DeviceListSerializer, DeviceDetailSerializer, TelemetryIngestSerializer

class DeviceListView(generics.ListAPIView):
    serializer_class = DeviceListSerializer
    def get_queryset(self):
        qs = Device.objects.all()
         # --- ostatnia telemetria per urządzenie ---
        last = Telemetry.objects.filter(device=OuterRef('pk')).order_by('-ts')
        qs = qs.annotate(
            last_level_pct=Subquery(last.values('level_pct')[:1]),
            last_ts=Subquery(last.values('ts')[:1]),
        )

        # (opcjonalnie) filtry jak wcześniej:
        q = self.request.query_params.get('q')
        if q:
            qs = qs.filter(Q(name__icontains=q) | Q(serial_number__icontains=q))

        bbox = self.request.query_params.get('bbox')
        if bbox:
            try:
                minLng, minLat, maxLng, maxLat = map(float, bbox.split(','))
                qs = qs.filter(lat__gte=minLat, lat__lte=maxLat, lng__gte=minLng, lng__lte=maxLng)
            except Exception:
                pass

        status = self.request.query_params.get('status')
        if status:
            qs = qs.filter(status=status)

        low = self.request.query_params.get('low')
        if low in ('1', 'true', 'True'):
            qs = qs.filter(last_level_pct__lt=F('threshold_pct'))

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