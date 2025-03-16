import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/common/DataTable";
import { PartMasterForm } from "@/components/admin/master/PartMasterForm";

interface PartMaster {
  id: string;
  partCode: string;
  name: string;
  specification: string;
  minimumStock: number;
  currentStock: number;
  unit: string;
}

/**
 * 部品マスタ管理画面
 */
export default function PartMasterPage() {
  const columns = [
    { field: "partCode", header: "部品コード" },
    { field: "name", header: "部品名" },
    { field: "specification", header: "仕様" },
    { field: "currentStock", header: "現在庫" },
    { field: "minimumStock", header: "最小在庫" },
    { field: "unit", header: "単位" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">部品マスタ管理</h1>
          <button className="btn-primary">新規登録</button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <DataTable<PartMaster>
            columns={columns}
            data={[]}
            onEdit={(id) => console.log("Edit:", id)}
            onDelete={(id) => console.log("Delete:", id)}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
