import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  TableContainer,
} from "@mui/material";

interface Order {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: "pending" | "processing" | "completed" | "cancelled";
}

const mockOrders: Order[] = [
  {
    id: "ORD001",
    customer: "山田太郎",
    date: "2024-03-16",
    amount: "¥12,800",
    status: "completed",
  },
  {
    id: "ORD002",
    customer: "佐藤花子",
    date: "2024-03-16",
    amount: "¥8,500",
    status: "processing",
  },
  {
    id: "ORD003",
    customer: "鈴木一郎",
    date: "2024-03-15",
    amount: "¥15,200",
    status: "pending",
  },
  {
    id: "ORD004",
    customer: "田中美咲",
    date: "2024-03-15",
    amount: "¥6,300",
    status: "cancelled",
  },
];

const getStatusColor = (status: Order["status"]) => {
  const colors = {
    pending: "warning",
    processing: "info",
    completed: "success",
    cancelled: "error",
  } as const;
  return colors[status];
};

const getStatusLabel = (status: Order["status"]) => {
  const labels = {
    pending: "保留中",
    processing: "処理中",
    completed: "完了",
    cancelled: "キャンセル",
  } as const;
  return labels[status];
};

/**
 * 最近の注文履歴を表示するテーブルコンポーネント
 * @returns RecentOrdersコンポーネント
 */
export const RecentOrders = () => {
  return (
    <Card>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">最近の注文</Typography>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>注文ID</TableCell>
              <TableCell>顧客名</TableCell>
              <TableCell>日付</TableCell>
              <TableCell>金額</TableCell>
              <TableCell>ステータス</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockOrders.map((order) => (
              <TableRow hover key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(order.status)}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};
