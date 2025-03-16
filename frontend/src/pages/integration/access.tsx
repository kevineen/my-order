import { useState } from "react";
import { GetServerSideProps } from "next";
import Layout from "@/components/layout/Layout";
import { withAuth } from "@/lib/auth";
import axios from "@/lib/axios";

interface AccessIntegrationProps {
  // 必要に応じてプロパティを追加
}

function AccessIntegration({}: AccessIntegrationProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSyncingMaster, setIsSyncingMaster] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Accessへ注文データをエクスポート
  const exportOrdersToAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExporting(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      if (fromDate) formData.append("from_date", fromDate);
      if (toDate) formData.append("to_date", toDate);

      const response = await axios.post("/api/access/export-orders", formData);
      setMessage("注文データのエクスポートタスクを開始しました");
    } catch (error: any) {
      setError(
        error.response?.data?.detail || "エクスポート中にエラーが発生しました"
      );
    } finally {
      setIsExporting(false);
    }
  };

  // Accessから注文データをインポート
  const importOrdersFromAccess = async () => {
    setIsImporting(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post("/api/access/import-orders");
      setMessage("注文データのインポートタスクを開始しました");
    } catch (error: any) {
      setError(
        error.response?.data?.detail || "インポート中にエラーが発生しました"
      );
    } finally {
      setIsImporting(false);
    }
  };

  // マスターデータをAccessと同期
  const syncMasterData = async () => {
    setIsSyncingMaster(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post("/api/access/export-master");
      setMessage("マスターデータのエクスポートタスクを開始しました");
    } catch (error: any) {
      setError(error.response?.data?.detail || "同期中にエラーが発生しました");
    } finally {
      setIsSyncingMaster(false);
    }
  };

  return (
    <Layout title="Access連携">
      <div className="px-4 py-5 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900">Access連携</h1>
        <p className="mt-1 text-sm text-gray-500">
          Microsoft Accessデータベースとの連携機能
        </p>
      </div>

      <div className="px-4 sm:px-6 pb-5">
        {message && (
          <div className="mb-4 p-4 bg-green-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{message}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              マスターデータの同期
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>部品マスターや顧客マスターをAccessと同期します。</p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                onClick={syncMasterData}
                disabled={isSyncingMaster}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isSyncingMaster ? "同期中..." : "マスターデータを同期する"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              注文データのエクスポート
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>システムの注文データをAccessにエクスポートします。</p>
            </div>
            <form onSubmit={exportOrdersToAccess} className="mt-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="from-date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    開始日
                  </label>
                  <input
                    type="date"
                    id="from-date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="to-date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    終了日
                  </label>
                  <input
                    type="date"
                    id="to-date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={isExporting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isExporting
                    ? "エクスポート中..."
                    : "注文データをエクスポートする"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              注文データのインポート
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Accessの注文データをシステムにインポートします。</p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                onClick={importOrdersFromAccess}
                disabled={isImporting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isImporting ? "インポート中..." : "注文データをインポートする"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    return {
      props: {},
    };
  }
);

export default AccessIntegration;
