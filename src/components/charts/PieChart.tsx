import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Pie} from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend);

const PChart = ({data = [], colors = [], borderColors = ["transparent"], borderWidth = 2, labels = [], label = ""}) => {
    const chartData = {
        labels: data.map(d => d.name),
        height: 120,
        datasets: [
            {
                label: label,
                data: data,
                backgroundColor: colors,
                borderColor: borderColors,
                borderWidth: borderWidth,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        radius: 110,
        plugins: {
            legend: false,
            datalabels: {
                anchor: 'center',
                backgroundColor: null,
                borderWidth: 0,
                color: "white",
                fontWeight: 'bold',
                formatter: function (value, context) {
                    return `${context.chart.data.labels[context.dataIndex]} \n ${context.chart.data.datasets[0].data.map(d => d.value)[context.dataIndex]}%`;
                },
                clamp: true,
                clip: true,
                rotate: 60,
            }
        }
    };


    return (
        <Pie data={chartData} options={chartOptions} plugins={[ChartDataLabels]}
             style={{height: "280px", width: "280px", marginLeft: "auto", marginRight: "auto", marginTop: "10px"}}/>
    )
}
export default PChart
