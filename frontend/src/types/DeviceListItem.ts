export type DeviceListItem = {
    id: string;
    name: string;
    serial_number: string;
    latitude: number;
    longitude: number;
    status: 'ONLINE' | 'OFFLINE' | 'MAINT' | string;
    last_level_pct: number | null;
    last_ts: string | null;
};