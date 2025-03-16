// 前回と同じコード内容

interface DeliveryItem {
  id: string;
  orderNumber: string;
  customerName: string;
  deliveryDate: string;
  deliveryTime: string;
  status: "pending" | "in_progress" | "ready" | "delivered";
  items: number;
}

const statusMap = {
  pending: { text: "準備待ち", class: "bg-gray-100 text-gray-800" },
  in_progress: { text: "準備中", class: "bg-yellow-100 text-yellow-800" },
  ready: { text: "出荷準備完了", class: "bg-blue-100 text-blue-800" },
  delivered: { text: "出荷済み", class: "bg-green-100 text-green-800" },
};

/**
 * 出荷予定表示コンポーネント
 */
export function DeliverySchedule() {
  const deliveries: DeliveryItem[] = [
    {
      id: "1",
      orderNumber: "ORD-2024-001",
      customerName: "株式会社ABC",
      deliveryDate: "2024-03-16",
      deliveryTime: "10:00",
      status: "ready",
      items: 5,
    },
    {
      id: "2",
      orderNumber: "ORD-2024-002",
      customerName: "株式会社XYZ",
      deliveryDate: "2024-03-16",
      deliveryTime: "14:00",
      status: "in_progress",
      items: 3,
    },
    {
      id: "3",
      orderNumber: "ORD-2024-003",
      customerName: "株式会社123",
      deliveryDate: "2024-03-16",
      deliveryTime: "16:00",
      status: "pending",
      items: 2,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">本日の出荷予定</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            出荷予定一覧 →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  出荷時間
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  オーダー番号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  顧客名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アイテム数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状態
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {delivery.deliveryTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {delivery.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.items}点
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusMap[delivery.status].class
                      }`}
                    >
                      {statusMap[delivery.status].text}
                    </span>
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
