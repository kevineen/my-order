import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import SupplierTable from "@/components/suppliers/SupplierTable";
import SupplierForm from "@/components/suppliers/SupplierForm";
import { Supplier, CreateSupplierData } from "@/types/supplier";

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

/**
 * 取引先管理ページ
 */
export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<
    Supplier | undefined
  >();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("/api/suppliers");
      if (!response.ok) {
        throw new Error("取引先データの取得に失敗しました");
      }
      const data = await response.json();
      setSuppliers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "予期せぬエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleAdd = () => {
    setSelectedSupplier(undefined);
    setFormOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormOpen(true);
  };

  const handleDelete = async (supplier: Supplier) => {
    if (!window.confirm("この取引先を削除してもよろしいですか？")) {
      return;
    }

    try {
      const response = await fetch(`/api/suppliers/${supplier.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("取引先の削除に失敗しました");
      }

      setSnackbar({
        open: true,
        message: "取引先を削除しました",
        severity: "success",
      });
      fetchSuppliers();
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err instanceof Error ? err.message : "予期せぬエラーが発生しました",
        severity: "error",
      });
    }
  };

  const handleSubmit = async (data: CreateSupplierData) => {
    try {
      const url = selectedSupplier
        ? `/api/suppliers/${selectedSupplier.id}`
        : "/api/suppliers";
      const method = selectedSupplier ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("取引先の保存に失敗しました");
      }

      setSnackbar({
        open: true,
        message: `取引先を${selectedSupplier ? "更新" : "追加"}しました`,
        severity: "success",
      });
      setFormOpen(false);
      fetchSuppliers();
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err instanceof Error ? err.message : "予期せぬエラーが発生しました",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <StyledContainer>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1">
          取引先管理
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          取引先を追加
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <SupplierTable
        suppliers={suppliers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <SupplierForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedSupplier}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
}
