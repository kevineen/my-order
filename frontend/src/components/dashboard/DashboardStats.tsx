// 前回と同じコード内容

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

function StatCard({ title, value, description, trend, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        {icon && <div className="mr-4 text-blue-600">{icon}</div>}
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <span
                className={`ml-2 text-sm ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * ダッシュボードの統計情報表示コンポーネント
 */
export function DashboardStats() {
  const stats = [
    {
      title: "本日の受注件数",
      value: "24件",
      trend: { value: 12, isPositive: true },
      description: "前日比",
    },
    {
      title: "今月の売上",
      value: "¥1,234,567",
      trend: { value: 8, isPositive: true },
      description: "前月比",
    },
    {
      title: "在庫アラート",
      value: "5件",
      description: "最小在庫を下回る部品数",
      trend: { value: 2, isPositive: false },
    },
    {
      title: "本日の出荷予定",
      value: "15件",
      description: "残り処理件数",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
