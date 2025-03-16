import { FC } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { SalesData } from "app/types/report";

interface SalesChartProps {
  data: SalesData[];
}

/**
 * 売上グラフコンポーネント
 * @param {SalesChartProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} 売上グラフ
 */
const SalesChart: FC<SalesChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => format(new Date(value), "MM/dd")}
        />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip
          labelFormatter={(value) => format(new Date(value), "yyyy/MM/dd")}
          formatter={(value: number) =>
            value.toLocaleString("ja-JP", {
              style: "currency",
              currency: "JPY",
            })
          }
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="amount"
          name="売上金額"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="orders"
          name="注文数"
          stroke="#82ca9d"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
