import { NextPage } from "next";
import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { StatsCard } from "../components/dashboard/StatsCard";
import { RecentOrders } from "../components/dashboard/RecentOrders";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PeopleIcon from "@mui/icons-material/People";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

/**
 * ダッシュボードページコンポーネント
 * システムの主要な情報や機能へのアクセスを提供します
 */
const DashboardPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>ダッシュボード | My Order System</title>
        <meta name="description" content="注文管理システムのダッシュボード" />
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              mb: 5,
              fontWeight: "bold",
            }}
          >
            ダッシュボード
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="本日の注文数"
                value={42}
                icon={<ShoppingCartIcon />}
                trend={{ value: 12, isPositive: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="本日の売上"
                value="¥156,000"
                icon={<MonetizationOnIcon />}
                trend={{ value: 8, isPositive: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="新規顧客数"
                value={15}
                icon={<PeopleIcon />}
                trend={{ value: 5, isPositive: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="配送待ち"
                value={8}
                icon={<LocalShippingIcon />}
                trend={{ value: 3, isPositive: false }}
              />
            </Grid>
            <Grid item xs={12}>
              <RecentOrders />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default DashboardPage;
