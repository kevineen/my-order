import { format } from "date-fns";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  orderDate: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  amount: number;
}

const statusMap = {
  pending: { text: "処理待ち", class: "bg-yellow-100 text-yellow-800" },
  processing: { text: "処理中", class: "bg-blue-100 text-blue-800" },
  completed: { text: "完了", class: "bg-green-100 text-green-800" },
  cancelled: { text: "キャンセル", class: "bg-red-100 text-red-800" },
};

/**
 * 最近のオーダー一覧表示コンポーネント
 */
export function RecentOrders() {
  const orders: Order[] = [
    {
      id: "1",
      orderNumber: "ORD-2024-001",
      customerName: "株式会社ABC",
      orderDate: "2024-03-16",
      status: "pending",
      amount: 123400,
    },
    {
      id: "2",
      orderNumber: "ORD-2024-002",
      customerName: "株式会社XYZ",
      orderDate: "2024-03-16",
      status: "processing",
      amount: 45600,
    },
    {
      id: "3",
      orderNumber: "ORD-2024-003",
      customerName: "株式会社123",
      orderDate: "2024-03-15",
      status: "completed",
      amount: 78900,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">最近のオーダー</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            すべて表示 →
          </button>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  オーダー番号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  顧客名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusMap[order.status].class
                      }`}
                    >
                      {statusMap[order.status].text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ¥{order.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
