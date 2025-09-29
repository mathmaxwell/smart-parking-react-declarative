import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import { Pie } from 'react-chartjs-2'

import type { DashboardResult } from '../function/calculateDashboard'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

const DashboardPieTime = ({
	result,
}: {
	result: {
		other: DashboardResult
		bus: DashboardResult
		whiteList: DashboardResult
		worker: DashboardResult
		tenant: DashboardResult
	}
}) => {
	// переводим минуты в часы и округляем до 1 знака
	const minutesToHours = (minutes: number) => +(minutes / 60).toFixed(1)

	const dataValues = [
		minutesToHours(result.other.totalDuration),
		minutesToHours(result.bus.totalDuration),
		minutesToHours(result.worker.totalDuration),
		minutesToHours(result.tenant.totalDuration),
	]

	const totalHours = dataValues.reduce((acc, h) => acc + h, 0)

	const pieData = {
		labels: ['others', 'bus', 'worker', 'tenant'],
		datasets: [
			{
				data: dataValues,
				backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#facc15'],
				hoverOffset: 10,
			},
		],
	}

	const pieOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top' as const,
				labels: {
					color: '#fff',
					font: { size: 14 },
				},
			},
			title: {
				display: true,
				text: `${'totalTime'}: ${totalHours} ${'hour'}`,
				color: '#fff',
				font: { size: 16 },
			},
			tooltip: {
				bodyColor: '#fff',
				titleColor: '#fff',
				callbacks: {
					label: function (tooltipItem: any) {
						const value = tooltipItem.raw
						return `${tooltipItem.label}: ${value} ${'hour'}`
					},
				},
			},
		},
	}

	return <Pie data={pieData} options={pieOptions} />
}

export default DashboardPieTime
