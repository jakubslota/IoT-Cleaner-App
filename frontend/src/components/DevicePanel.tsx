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
} from "recharts";

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
		Promise.all([fetchDevice(id), fetchTelemetry(id, 120)]).then(
			([d, t]) => {
				setDetail(d);
				setTelemetry([...t].reverse());
			}
		);
	}, [id]);

	if (!id) return null;
	return (
		<aside
			style={{
				width: 380,
				padding: 16,
				borderLeft: "1px solid #eee",
				height: "100%",
				overflow: "auto",
				background: "#fff",
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<h3 style={{ margin: 0 }}>{detail?.name ?? "Urządzenie"}</h3>
				<button onClick={onClose}>×</button>
			</div>
			{detail && (
				<>
					<p>
						SN: {detail.serial_number}
						<br />
						Status: {detail.status}
					</p>
					<p>
						Poj.: {detail.capacity_ml} ml, Próg:{" "}
						{detail.threshold_pct}%
					</p>
					<p>
						Ostatni poziom: {detail.last_level_pct ?? "—"}% (
						{detail.last_level_ml ?? "—"} ml)
					</p>
					<h4>Poziom środka (ostatnie odczyty)</h4>
					<LineChart width={340} height={200} data={telemetry}>
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
				</>
			)}
		</aside>
	);
}
