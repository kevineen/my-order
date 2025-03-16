/**
 * 取引先データの型定義
 */
export interface Supplier {
  id: number;
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 取引先作成用データの型定義
 */
export type CreateSupplierData = Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * 取引先更新用データの型定義
 */
export type UpdateSupplierData = Partial<CreateSupplierData>;

/**
 * 取引先ステータスの定義
 */
export const SUPPLIER_STATUSES = {
  active: '取引中',
  inactive: '取引停止',
} as const; 