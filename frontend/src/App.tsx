import { useEffect, useState } from "react";
import { fetchDevices } from "./api/api";
import type { DeviceListItem } from "./types/DeviceListItem";
import type { DevicesQuery } from "./types/DevicesQuery";
import MapView from "./components/MapView";
import DevicePanel from "./components/DevicePanel";
import styles from "./App.module.css";

export default function App() {
	const [devices, setDevices] = useState<DeviceListItem[]>([]);
	const [selected, setSelected] = useState<string | null>(null);
	const [q, setQ] = useState("");
	const [status, setStatus] = useState<string>("");
	const [bbox, setBbox] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [tick, setTick] = useState(0); // do auto-refresh

	// Auto-refresh co 30 s – aktualizacja stanu w callbacku setInterval (OK dla lintera)
	useEffect(() => {
		const id = setInterval(() => setTick((t) => t + 1), 30000);
		return () => clearInterval(id);
	}, []);

	// Pobieranie danych – asynchroniczne IIFE + flaga mounted
	useEffect(() => {
		let mounted = true;

		(async () => {
			setLoading(true);
			try {
				const params: DevicesQuery = {};
				if (q) params.q = q;
				if (status) params.status = status;
				if (bbox) params.bbox = bbox;

				const data = await fetchDevices(params);
				if (mounted) setDevices(data); // setState w callbacku, nie bezpośrednio w ciele efektu
			} finally {
				if (mounted) setLoading(false);
			}
		})();

		return () => {
			mounted = false;
		};
	}, [q, status, bbox, tick]);

	return (
		<div className={styles.layout}>
			<div className={styles.leftPane}>
				<div className={styles.toolbar}>
					<input
						value={q}
						onChange={(e) => setQ(e.target.value)}
						placeholder="Szukaj po nazwie/SN"
					/>
					<select
						value={status}
						onChange={(e) => setStatus(e.target.value)}
					>
						<option value="">status: wszystkie</option>
						<option value="ONLINE">ONLINE</option>
						<option value="OFFLINE">OFFLINE</option>
						<option value="MAINT">MAINT</option>
					</select>
					<button
						onClick={() => setTick((t) => t + 1)}
						disabled={loading}
					>
						{loading ? "..." : "Odśwież"}
					</button>
				</div>
				<MapView
					devices={devices}
					onSelect={setSelected}
					onBboxChange={(b) => setBbox(b)}
				/>
			</div>
			<DevicePanel id={selected} onClose={() => setSelected(null)} />
		</div>
	);
}
