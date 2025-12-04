import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { DeviceListItem } from '../types/DeviceListItem';
import type { DeviceDetail } from '../types/DeviceDetail';
import type { TelemetryPoint } from '../types/TelemetryPoint';
import type { DevicesQuery } from '../types/DevicesQuery';
import type { Paginated } from '../types/Paginated';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10000,
});

type DevicesResponse = DeviceListItem[] | Paginated<DeviceListItem>;

function normalizeDevices(res: AxiosResponse<DevicesResponse>): DeviceListItem[] {
  return Array.isArray(res.data) ? res.data : res.data.results;
}

export async function fetchDevices(params?: DevicesQuery) {
  const res = await api.get<DevicesResponse>('/devices', { params });
  return normalizeDevices(res);
}

export async function fetchDevice(id: string) {
  const res = await api.get<DeviceDetail>(`/devices/${id}`);
  return res.data;
}

export async function fetchTelemetry(id: string, limit = 200) {
  const res = await api.get<TelemetryPoint[]>(`/devices/${id}/telemetry`, { params: { limit } });
  return res.data;
}
