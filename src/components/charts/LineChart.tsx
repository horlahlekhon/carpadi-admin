import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


const LChart = ({ttc = [], rot = []}) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
            line: {
                fill: false,
                tension: 0.4
            }
        },
        scales: {
            y: {
                display: false
            }
        },
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false,
            },
        },
    };

    const labels = ['WK 1', 'WK 2', 'WK 3', 'WK 4', 'WK 5'];

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Total Trading Cash',
                data: ttc,
                borderColor: '#56A0D7',
                backgroundColor: '#56A0D7',
            },
            {
                label: 'Return On Trades',
                data: rot,
                borderColor: '#162A69',
                backgroundColor: '#162A69',
            },
        ],
    };
    return (
        <Line options={options} data={chartData} height={"136px"}/>
    )
}
export default LChart
