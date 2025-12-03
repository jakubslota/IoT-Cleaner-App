from django.urls import path
from django.http import JsonResponse
from .views import DeviceListView, DeviceDetailView, DeviceTelemetryView, ingest_telemetry

def health_check(_request):
    return JsonResponse({'status': 'ok'})

urlpatterns = [
    path('health', health_check),
    path('devices', DeviceListView.as_view()),
    path('devices/<uuid:pk>', DeviceDetailView.as_view()),
    path('devices/<uuid:pk>/telemetry', DeviceTelemetryView.as_view()),
    path('telemetry', ingest_telemetry),
]