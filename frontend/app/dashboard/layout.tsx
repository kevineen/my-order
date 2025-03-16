import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ダッシュボード | My Order System",
  description: "注文管理システムのダッシュボード",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="flex-1 py-8">{children}</main>
    </div>
  );
}
