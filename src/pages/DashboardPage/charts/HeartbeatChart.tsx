import { Line } from 'react-chartjs-2'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
)

interface HeartbeatChartProps {
	arrivalsByHour: Record<string, number>
}

export function HeartbeatChart({ arrivalsByHour }: HeartbeatChartProps) {
	const labels = Object.keys(arrivalsByHour).sort(
		(a, b) => Number(a) - Number(b)
	)
	const dataPoints = labels.map(hour => arrivalsByHour[hour])

	const data = {
		labels,
		datasets: [
			{
				label: 'hourlyArrivals',
				data: dataPoints,
				borderColor: '#FF3D00',
				backgroundColor: 'rgba(255,61,0,0.2)',
				tension: 0.4,
				fill: true,
				pointRadius: 0,
			},
		],
	}

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			tooltip: { mode: 'index' as const, intersect: false },
		},
		scales: {
			x: {
				title: { display: true, text: 'hour', color: '#FFFFFF' },
				ticks: { color: '#FFFFFF' },
				grid: { color: 'rgba(255,255,255,0.1)' },
			},
			y: {
				title: { display: true, text: 'total', color: '#FFFFFF' },
				beginAtZero: true,
				ticks: { color: '#FFFFFF' },
				grid: { color: 'rgba(255,255,255,0.1)' },
			},
		},
	}

	return (
		<Line
			data={data}
			options={options}
			style={{ height: '100%', width: '100%' }}
		/>
	)
}
