import { Card, CardContent, Typography, Box, SxProps } from "@mui/material";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  sx?: SxProps;
}

/**
 * 統計情報を表示するカードコンポーネント
 * @param props - コンポーネントのプロパティ
 * @returns StatsCardコンポーネント
 */
export const StatsCard = ({
  title,
  value,
  icon,
  trend,
  sx = {},
}: StatsCardProps) => {
  return (
    <Card sx={{ height: "100%", ...sx }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          {icon && (
            <Box
              sx={{
                backgroundColor: "primary.light",
                borderRadius: 1,
                p: 1,
                color: "primary.main",
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
        <Typography color="textSecondary" variant="subtitle2" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="h4">{value}</Typography>
        {trend && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Typography
              color={trend.isPositive ? "success.main" : "error.main"}
              variant="body2"
              sx={{ mr: 1 }}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </Typography>
            <Typography color="textSecondary" variant="caption">
              前月比
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
