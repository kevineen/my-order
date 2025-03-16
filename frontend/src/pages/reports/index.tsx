import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SalesChart from "@/components/reports/SalesChart";
import InventoryTable from "@/components/reports/InventoryTable";
import { ReportData } from "@/types/report";

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const LoadingWrapper = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "50vh",
});

const StatBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
}));

/**
 * レポートページコンポーネント
 * @returns {JSX.Element} レポートページ
 */
export default function ReportsPage(): JSX.Element {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch("/api/reports");
        if (!response.ok) {
          throw new Error("レポートデータの取得に失敗しました");
        }
        const data = await response.json();
        setReportData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "予期せぬエラーが発生しました"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (loading) {
    return (
      <LoadingWrapper>
        <CircularProgress />
      </LoadingWrapper>
    );
  }

  if (error || !reportData) {
    return (
      <StyledContainer>
        <Typography color="error" align="center">
          {error || "データの取得に失敗しました"}
        </Typography>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Typography variant="h4" component="h1" gutterBottom>
        レポート
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatBox>
            <Typography variant="h6" gutterBottom>
              総売上
            </Typography>
            <Typography variant="h4">
              {reportData.totalRevenue.toLocaleString("ja-JP", {
                style: "currency",
                currency: "JPY",
              })}
            </Typography>
          </StatBox>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatBox>
            <Typography variant="h6" gutterBottom>
              総注文数
            </Typography>
            <Typography variant="h4">
              {reportData.totalOrders.toLocaleString()}件
            </Typography>
          </StatBox>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatBox>
            <Typography variant="h6" gutterBottom>
              平均注文金額
            </Typography>
            <Typography variant="h4">
              {reportData.averageOrderValue.toLocaleString("ja-JP", {
                style: "currency",
                currency: "JPY",
              })}
            </Typography>
          </StatBox>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              売上推移
            </Typography>
            <SalesChart data={reportData.dailySales} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              在庫状況
            </Typography>
            <InventoryTable data={reportData.inventory} />
          </StyledPaper>
        </Grid>
      </Grid>
    </StyledContainer>
  );
}
