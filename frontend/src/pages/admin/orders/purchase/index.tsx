import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PurchaseOrderList } from "@/components/admin/orders/PurchaseOrderList";
import { PurchaseOrderForm } from "@/components/admin/orders/PurchaseOrderForm";

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  orderDate: Date;
  supplier: string;
  items: PurchaseOrderItem[];
  status: "draft" | "ordered" | "received" | "cancelled";
}

interface PurchaseOrderItem {
  partId: string;
  quantity: number;
  unitPrice: number;
}

/**
 * 発注管理画面
 */
export default function PurchaseOrderPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">発注管理</h1>
          <button className="btn-primary">新規発注</button>
        </div>
        <PurchaseOrderList />
        <PurchaseOrderForm />
      </div>
    </AdminLayout>
  );
}
