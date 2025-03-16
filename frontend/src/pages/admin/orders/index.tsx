import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { Order, OrderStatus } from "@/types/order";
import { OrderList } from "@/components/admin/orders/OrderList";

// ステータスに応じたチップの色とラベルの定義
export const statusConfig: Record<
  OrderStatus,
  { color: "default" | "primary" | "success" | "error"; label: string }
> = {
  pending: { color: "default", label: "未処理" },
  confirmed: { color: "primary", label: "確認済み" },
  processing: { color: "primary", label: "処理中" },
  shipped: { color: "primary", label: "発送済" },
  delivered: { color: "success", label: "配達完了" },
  cancelled: { color: "error", label: "キャンセル" },
};

// サンプルデータ（実際のアプリケーションではAPIから取得）
const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  customer: {
    id: i + 1,
    name: `顧客${i + 1}`,
  },
  order_date: new Date(Date.now() - Math.random() * 10000000000)
    .toISOString()
    .split("T")[0],
  status: [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ][Math.floor(Math.random() * 6)] as OrderStatus,
  items: [
    {
      id: i + 1,
      item: {
        id: i + 1,
        name: "商品A",
        unit_price: 1000,
      },
      quantity: Math.floor(Math.random() * 10) + 1,
      unit_price: 1000,
    },
  ],
}));

/**
 * 注文管理画面
 */
export default function OrderManagement() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Loading mock orders:", mockOrders); // デバッグ用
    setOrders(mockOrders);
    setLoading(false);
  }, []);

  // 検索フィルター
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ページネーションの処理
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 削除ダイアログの処理
  const handleDeleteClick = (order: Order) => {
    setSelectedOrder(order);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedOrder) {
      // 実際のアプリケーションではAPIを呼び出して削除
      setOrders(orders.filter((order) => order.id !== selectedOrder.id));
    }
    setDeleteDialogOpen(false);
    setSelectedOrder(null);
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            注文管理
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <TextField
              label="検索"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 300 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push("/admin/orders/new")}
            >
              新規注文
            </Button>
          </Box>
        </Box>

        <Card>
          <OrderList
            orders={filteredOrders}
            loading={loading}
            error={error}
            page={page}
            rowsPerPage={rowsPerPage}
            onDeleteClick={handleDeleteClick}
            statusConfig={statusConfig}
          />
          <TablePagination
            component="div"
            count={filteredOrders.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="表示件数:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} / ${count !== -1 ? count : `${to}以上`}`
            }
          />
        </Card>

        {/* 削除確認ダイアログ */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>注文の削除</DialogTitle>
          <DialogContent>
            <Typography>
              注文ID: {selectedOrder?.id} を削除してもよろしいですか？
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleDeleteConfirm} color="error">
              削除
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
}
