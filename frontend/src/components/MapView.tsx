import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import type { DeviceListItem } from "../types/DeviceListItem";
import styles from "./MapView.module.css";

function colorIcon(color: "green" | "yellow" | "red" | "gray") {
	const svg = encodeURIComponent(
		`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 41'>
      <path d='M12 0C5.4 0 0 5.4 0 12c0 9 12 29 12 29s12-20 12-29C24 5.4 18.6 0 12 0z' fill='${color}' stroke='#333'/>
      <circle cx='12' cy='12' r='6' fill='white'/>
    </svg>`
	);
	return new L.Icon({
		iconUrl: `data:image/svg+xml;utf8,${svg}`,
		iconSize: [24, 41],
		iconAnchor: [12, 41],
		popupAnchor: [0, -34],
	});
}

const icons = {
	green: colorIcon("green"),
	yellow: colorIcon("yellow"),
	red: colorIcon("red"),
	gray: colorIcon("gray"),
};

function pickIcon(level: number | null, status: string) {
	if (status === "OFFLINE") return icons.gray;
	if (level === null) return icons.gray;
	if (level < 20) return icons.red;
	if (level < 50) return icons.yellow;
	return icons.green;
}

export default function MapView({
	devices,
	onSelect,
	onBboxChange,
}: {
	devices: DeviceListItem[];
	onSelect: (id: string) => void;
	onBboxChange: (bbox: string) => void;
}) {
	function BboxWatcher() {
		useMapEvents({
			moveend(e) {
				const b = e.target.getBounds();
				const bbox = `${b.getWest()},${b.getSouth()},${b.getEast()},${b.getNorth()}`;
				onBboxChange(bbox);
			},
			load(e) {
				const b = e.target.getBounds();
				const bbox = `${b.getWest()},${b.getSouth()},${b.getEast()},${b.getNorth()}`;
				onBboxChange(bbox);
			},
		});
		return null;
	}

	return (
		<div className={styles.mapWrapper}>
		<MapContainer
			center={[52.1, 18.4]}
			zoom={6}
		>
			<TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			<BboxWatcher />
			{devices.map((d) => (
				<Marker
					key={d.id}
					position={[d.latitude, d.longitude]}
					icon={pickIcon(d.last_level_pct, d.status)}
					eventHandlers={{ click: () => onSelect(d.id) }}
				>
					<Popup>
						<b>{d.name}</b>
						<br />
						SN: {d.serial_number}
						<br />
						Poziom: {d.last_level_pct ?? "-"}%
						<br />
						Status: {d.status}
						<br />
					</Popup>
				</Marker>
			))}
		</MapContainer>
		</div>
	);
}
