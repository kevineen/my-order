import { FC } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Chip, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Supplier, SUPPLIER_STATUSES } from "app/types/supplier";

interface SupplierTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
  loading?: boolean;
}

/**
 * 取引先一覧テーブルコンポーネント
 */
const SupplierTable: FC<SupplierTableProps> = ({
  suppliers,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "取引先コード",
      width: 150,
    },
    {
      field: "name",
      headerName: "取引先名",
      width: 200,
    },
    {
      field: "contactPerson",
      headerName: "担当者",
      width: 150,
    },
    {
      field: "email",
      headerName: "メールアドレス",
      width: 200,
    },
    {
      field: "phone",
      headerName: "電話番号",
      width: 150,
    },
    {
      field: "status",
      headerName: "ステータス",
      width: 120,
      renderCell: (params: GridRenderCellParams<Supplier>) => (
        <Chip
          label={
            SUPPLIER_STATUSES[params.value as keyof typeof SUPPLIER_STATUSES]
          }
          color={params.value === "active" ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "操作",
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Supplier>) => (
        <>
          <Tooltip title="編集">
            <IconButton
              size="small"
              onClick={() => onEdit(params.row)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="削除">
            <IconButton
              size="small"
              onClick={() => onDelete(params.row)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <DataGrid
      rows={suppliers}
      columns={columns}
      loading={loading}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 10 },
        },
      }}
      pageSizeOptions={[10, 25, 50]}
      disableRowSelectionOnClick
      autoHeight
    />
  );
};

export default SupplierTable;
