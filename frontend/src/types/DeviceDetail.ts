export type DeviceDetail = {
    id: string;
    name: string;
    serial_number: string;
    lat: number;
    lng: number;
    status: string;
    capacity_ml: number;
    threshold_pct: number;
    last_level_pct: number | null;
    last_level_ml: number | null;
    last_ts: string | null;
};
