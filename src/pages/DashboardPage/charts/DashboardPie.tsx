import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import { Pie } from 'react-chartjs-2'

import { Card } from '@mui/material'
import { formatNumber } from '../../CarsSessions/view/function'
import type { Result } from '../function/calculateForFreeMonth'

const DashboardPie = ({ resultMounthFree }: { resultMounthFree: Result }) => {
	ChartJS.register(ArcElement, Tooltip, Legend, Title)

	const totalSum = resultMounthFree.worker.sum + resultMounthFree.tenant.sum

	const pieData = {
		labels: ['Сотрудники', 'Арендаторы'],
		color: '#fff',
		datasets: [
			{
				data: [resultMounthFree.worker.sum, resultMounthFree.tenant.sum],
				backgroundColor: ['#34d399', '#facc15'],
				hoverOffset: 10,
				color: '#fff',
			},
		],
	}

	const pieOptions = {
		responsive: true,
		maintainAspectRatio: false,
		color: '#fff',
		plugins: {
			legend: { position: 'top' as const },
			title: {
				display: true,
				color: '#fff',
				text: `Общий доход: ${formatNumber(totalSum)} сум`,
			},
		},
	}

	return <Pie data={pieData} options={pieOptions} />
}

export default DashboardPie
