// 前回と同じコード内容

interface StockAlertItem {
  id: string;
  partCode: string;
  partName: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
}

/**
 * 在庫アラート表示コンポーネント
 */
export function StockAlert() {
  const alertItems: StockAlertItem[] = [
    {
      id: "1",
      partCode: "PART-001",
      partName: "サンプル部品A",
      currentStock: 5,
      minimumStock: 10,
      unit: "個",
    },
    {
      id: "2",
      partCode: "PART-002",
      partName: "サンプル部品B",
      currentStock: 2,
      minimumStock: 8,
      unit: "個",
    },
    {
      id: "3",
      partCode: "PART-003",
      partName: "サンプル部品C",
      currentStock: 1,
      minimumStock: 5,
      unit: "個",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">在庫アラート</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            在庫一覧 →
          </button>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  部品コード
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  部品名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  在庫状況
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alertItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {item.partCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.partName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.currentStock} {item.unit}
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
