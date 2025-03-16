/**
 * 売上データの型定義
 */
export interface SalesData {
  date: string;
  amount: number;
  orders: number;
}

/**
 * 在庫データの型定義
 */
export interface InventoryData {
  productId: number;
  productName: string;
  stock: number;
  reorderPoint: number;
}

/**
 * 人気商品データの型定義
 */
export interface PopularProductData {
  productId: number;
  productName: string;
  totalSales: number;
  totalQuantity: number;
}

/**
 * レポートデータの型定義
 */
export interface ReportData {
  dailySales: SalesData[];
  inventory: InventoryData[];
  popularProducts: PopularProductData[];
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
} 