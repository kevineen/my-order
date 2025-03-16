import { ReactNode } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const menuItems = [
    {
      label: "マスター管理",
      items: [
        { href: "/admin/master/parts", label: "部品マスタ" },
        { href: "/admin/master/customers", label: "顧客マスタ" },
        { href: "/admin/master/documents", label: "仕様書・図面" },
      ],
    },
    {
      label: "オーダー管理",
      items: [
        { href: "/admin/orders/purchase", label: "発注管理" },
        { href: "/admin/orders/receiving", label: "入荷管理" },
        { href: "/admin/orders/inventory", label: "在庫管理" },
        { href: "/admin/orders/process", label: "工程管理" },
      ],
    },
    {
      label: "データ連携",
      items: [
        { href: "/admin/sync/excel", label: "Excel連携" },
        { href: "/admin/sync/access", label: "Access連携" },
      ],
    },
    {
      label: "システム設定",
      items: [
        { href: "/admin/settings/users", label: "ユーザー管理" },
        { href: "/admin/settings/permissions", label: "権限管理" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar menuItems={menuItems} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
