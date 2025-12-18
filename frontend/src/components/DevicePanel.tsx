import { useEffect, useState } from "react";
import { fetchDevice, fetchTelemetry } from "../api/api";
import type { DeviceDetail } from "../types/DeviceDetail";
import type { TelemetryPoint } from "../types/TelemetryPoint";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	ResponsiveContainer,
} from "recharts";
import styles from "./DevicePanel.module.css";

export default function DevicePanel({
	id,
	onClose,
}: {
	id: string | null;
	onClose: () => void;
}) {
	const [detail, setDetail] = useState<DeviceDetail | null>(null);
	const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);

	useEffect(() => {
    if (!id) return;
    let alive = true;
    (async () => {
      const [d, t] = await Promise.all([fetchDevice(id), fetchTelemetry(id, 120)]);
      if (!alive) return;
      setDetail(d);
      setTelemetry([...t].reverse());
    })();
    return () => { alive = false; };
  }, [id]);

  if (!id) return null;

	return (
		<aside className={styles.panel}>
			<div className={styles.header}>
				<h3 className={styles.title}>{detail?.name ?? "Urządzenie"}</h3>
				<button className={styles.closeBtn} onClick={onClose}>X</button>
			</div>
			{detail && (
				<>
					<p className={styles.meta}>
						SN: {detail.serial_number}
						<br />
						Status: {detail.status}
					</p>
					<p className={styles.meta}>
						Poj.: {detail.capacity_ml} ml, Próg:{" "}
						{detail.threshold_pct}%
					</p>
					<p className={styles.meta}>
						Ostatni poziom: {detail.last_level_pct ?? "—"}% (
						{detail.last_level_ml ?? "—"} ml)
					</p>
					<h4 className={styles.sectionTitle}>Poziom środka (ostatnie odczyty)</h4>
					<div className={styles.chartBox}>
					<ResponsiveContainer>
					<LineChart data={telemetry}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="ts"
							minTickGap={24}
							tickFormatter={(v) =>
								new Date(v).toLocaleTimeString()
							}
						/>
						<YAxis domain={[0, 100]} />
						<Tooltip
							labelFormatter={(v) => new Date(v).toLocaleString()}
						/>
						<Line type="monotone" dataKey="level_pct" dot={false} />
					</LineChart>
					</ResponsiveContainer>
					</div>
				</>
			)}
		</aside>
	);
}
