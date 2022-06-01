import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const LChart = ({ data = [], showYAxis = false, showLegend = false, height=320, showGrid=false }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        width={707}
        height={276}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="2 3" />
        <XAxis dataKey="name" />
        {showYAxis && <YAxis />}
        <Tooltip />
        {showLegend && <Legend />}
        <Line type="monotone" dataKey="pv" strokeWidth={2} stroke="#56A0D7" />
        <Line type="monotone" dataKey="uv" stroke="#243773" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
export default LChart
