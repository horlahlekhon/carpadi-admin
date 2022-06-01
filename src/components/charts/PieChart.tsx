import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts'

const PChart = ({ data = [], colors = [] }) => {
  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    console.log(`elem: ${data[index].name} cx: ${cx}, cy: ${cy}, radius: ${radius}, x: ${x}, y: ${y}`)

    return (
      <text
        x={x > 180 ? x - 20 : x + 20}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={10}
        fontWeight={700}
      >
        {`${data[index].name} \n ${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
export default PChart
