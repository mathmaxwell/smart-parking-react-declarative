import type { DashboardResult } from '../function/calculateDashboard'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { formatNumber } from '../../CarsSessions/view/function'
import { Card } from '@mui/material'
import type { Result } from '../function/calculateForFreeMonth'

const DashboardChard = ({
	result,
	resultMounthFree,
}: {
	result: {
		other: DashboardResult
		bus: DashboardResult
		whiteList: DashboardResult
		worker: DashboardResult
		tenant: DashboardResult
	}
	resultMounthFree: Result
}) => {
	ChartJS.register(
		CategoryScale,
		LinearScale,
		BarElement,
		Title,
		Tooltip,
		Legend,
		ArcElement
	)
	const sums = {
		other: result.other.sum,
		bus: result.bus.sum,
		worker: result.worker.sum + resultMounthFree.worker.sum,
		tenant: result.tenant.sum + resultMounthFree.tenant.sum,
	}
	const totalSum =
		sums.other +
		sums.bus +
		sums.worker +
		sums.tenant +
		resultMounthFree.tenant.sum +
		resultMounthFree.worker.sum
	const barData = {
		labels: [''],
		color: '#fff',
		datasets: [
			{
				color: '#fff',
				label: 'Пассажиры',
				data: [sums.other],
				backgroundColor: '#f87171',
			},
			{
				color: '#fff',
				label: 'Туристические',
				data: [sums.bus],
				backgroundColor: '#60a5fa',
			},
			{
				color: '#fff',
				label: 'Сотрудники',
				data: [sums.worker],
				backgroundColor: '#34d399',
			},
			{
				color: '#fff',
				label: 'Арендаторы',
				data: [sums.tenant],
				backgroundColor: '#facc15',
			},
		],
	}

	const barOptions = {
		responsive: true,
		color: '#fff',
		maintainAspectRatio: false,
		plugins: {
			color: '#fff',
			legend: { position: 'top' as const, color: '#fff' },
			title: {
				display: true,
				color: '#fff',
				text: `Общий доход: ${formatNumber(totalSum)} сум`,
			},
		},
		scales: {
			y: {
				color: '#fff',
				ticks: {
					font: { size: 12 },
					color: '#fff',
					callback: (value: number | string) => {
						if (typeof value === 'number') {
							if (value >= 1_000_000) return value / 1_000_000 + 'M'
							if (value >= 1_000) return value / 1_000 + 'k'
						}
						return value
					},
				},
			},
		},
	}

	return <Bar data={barData} options={barOptions} />
}

export default DashboardChard
