import { FC } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { InventoryData } from "app/types/report";

interface InventoryTableProps {
  data: InventoryData[];
}

const columns: GridColDef[] = [
  {
    field: "productName",
    headerName: "商品名",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "stock",
    headerName: "在庫数",
    type: "number",
    width: 130,
    align: "right",
    headerAlign: "right",
  },
  {
    field: "reorderPoint",
    headerName: "発注点",
    type: "number",
    width: 130,
    align: "right",
    headerAlign: "right",
  },
  {
    field: "status",
    headerName: "状態",
    width: 130,
    renderCell: (params) => {
      const stock = params.row.stock;
      const reorderPoint = params.row.reorderPoint;

      if (stock <= reorderPoint) {
        return <span style={{ color: "#f44336" }}>要発注</span>;
      }
      return <span style={{ color: "#4caf50" }}>適正</span>;
    },
  },
];

/**
 * 在庫テーブルコンポーネント
 * @param {InventoryTableProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} 在庫テーブル
 */
const InventoryTable: FC<InventoryTableProps> = ({ data }) => {
  const rows = data.map((item) => ({
    id: item.productId,
    ...item,
  }));

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
};

export default InventoryTable;
