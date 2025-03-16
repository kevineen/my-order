import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { OrderStatus } from "@/types/order";
import { DashboardSummary } from "@/components/admin/DashboardSummary";

/**
 * 管理画面トップページ
 */
export default function AdminDashboard() {
  const [orderCounts, setOrderCounts] = useState<{
    [key in OrderStatus]?: number;
  }>({});
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    // TODO: APIから実際のデータを取得する
    // モックデータを設定
    setOrderCounts({
      pending: 5,
      confirmed: 3,
      processing: 2,
      shipped: 4,
      delivered: 10,
      cancelled: 1,
    });
    setTotalOrders(25);
    setTotalCustomers(15);
    setTotalRevenue(1250000);
  }, []);

  return (
    <AdminLayout>
      <DashboardSummary
        orderCounts={orderCounts}
        totalOrders={totalOrders}
        totalCustomers={totalCustomers}
        totalRevenue={totalRevenue}
      />
    </AdminLayout>
  );
}
