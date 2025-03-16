import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { withAuth } from '@/lib/auth';
import axios from '@/lib/axios';
import { formatDate, getOrderStatusInfo } from '@/lib/utils';
import { MagnifyingGlassIcon, PlusCircleIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  customer_name: string;
  order_date: string;
  delivery_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders');
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;
    
    // ステータスフィルタ適用
    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }
    
    // 検索語フィルタ適用
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const statusOptions = [
    { value: 'draft', label: '下書き' },
    { value: 'confirmed', label: '確定' },
    { value: 'in_progress', label: '処理中' },
    { value: 'completed', label: '完了' },
    { value: 'cancelled', label: 'キャンセル' },
  ];

  return (
    <Layout title="注文管理">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">注文管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            全 {filteredOrders.length} 件の注文
          </p>
        </div>
        <Link href="/orders/new">
          <a className="btn-primary">
            <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            新規注文
          </a>
        </Link>
      </div>

      <div className="px-4 sm:px-6 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="mb-2 sm:mb-0">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
              ステータスで絞り込み
            </label>
            <div className="mt-1 sm:flex sm:items-center">
              <div className="relative inline-block">
                <select
                  id="status-filter"
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="">全て</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FunnelIcon className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-96">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              検索
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="注文番号または顧客名で検索"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const statusInfo = getOrderStatusInfo(order.status);
                  return (
                    <li key={order.id}>
                      <Link href={`/orders/${order.id}`}>
                        <a className="block hover:bg-gray-50">
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-primary-600 truncate">
                                {order.order_number}
                              </div>
                              <div className="ml-2 flex-shrink-0 flex">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}
                                >
                                  {statusInfo.label}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <div className="flex items-center text-sm text-gray-500">
                                  <svg
                                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  {order.customer_name}
                                </div>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <svg
                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>{formatDate(order.order_date)}</span>
                              </div>
                            </div>
                          </div>
                        </a>
                      </Link>
                    </li>
                  );
                })
              ) : (
                <li className="px-4 py-5 text-center text-sm text-gray-500">
                  {statusFilter
                    ? `${statusOptions.find((o) => o.value === statusFilter)?.label}状態の注文はありません`
                    : '検索条件に一致する注文がありません'}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return {
    props: {},
  };
});
