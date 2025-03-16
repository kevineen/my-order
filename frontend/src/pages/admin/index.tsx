import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DashboardSummary } from "@/components/admin/DashboardSummary";
import { OrderStatus } from "@/types/order";

/**
 * 管理画面トップページ
 */
export default function AdminDashboard() {
  const [summaryData, setSummaryData] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    todayDeliveries: 0,
  });

  return (
    <AdminLayout>
      <DashboardSummary data={summaryData} />
    </AdminLayout>
  );
}
