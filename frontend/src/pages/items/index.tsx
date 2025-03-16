import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { withAuth } from '@/lib/auth';
import axios from '@/lib/axios';
import { formatCurrency } from '@/lib/utils';
import { MagnifyingGlassIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

interface Item {
  id: number;
  code: string;
  name: string;
  description: string | null;
  unit: string;
  unit_price: number;
  min_stock: number;
  current_stock: number;
  is_active: boolean;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/items');
        setItems(response.data);
        setFilteredItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = items.filter(
        (item) =>
          item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchTerm, items]);

  const getStockStatus = (item: Item) => {
    if (item.current_stock <= 0) {
      return {
        label: '在庫切れ',
        color: 'bg-red-100 text-red-800',
      };
    } else if (item.current_stock < item.min_stock) {
      return {
        label: '在庫少',
        color: 'bg-yellow-100 text-yellow-800',
      };
    } else {
      return {
        label: '正常',
        color: 'bg-green-100 text-green-800',
      };
    }
  };

  return (
    <Layout title="部品管理">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">部品管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            全 {filteredItems.length} 件の部品
          </p>
        </div>
        <Link href="/items/new">
          <a className="btn-primary">
            <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            新規部品
          </a>
        </Link>
      </div>

      <div className="px-4 sm:px-6 pb-5">
        <div className="mb-4">
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="部品コードまたは名称で検索"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <li key={item.id}>
                      <Link href={`/items/${item.id}`}>
                        <a className="block hover:bg-gray-50">
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="truncate">
                                <div className="flex text-sm">
                                  <p className="font-medium text-primary-600 truncate">{item.code}</p>
                                  <p className="ml-1 flex-shrink-0 font-normal text-gray-500">- {item.name}</p>
                                </div>
                              </div>
                              <div className="ml-2 flex-shrink-0 flex">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}
                                >
                                  {status.label}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <div className="mr-6 flex items-center text-sm text-gray-500">
                                  現在庫: {item.current_stock} {item.unit}
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                  最小在庫: {item.min_stock} {item.unit}
                                </div>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                単価: {formatCurrency(item.unit_price)}
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
                  検索条件に一致する部品がありません
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
