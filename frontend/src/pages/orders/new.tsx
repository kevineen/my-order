import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

/**
 * 注文登録ページ
 * ステップ形式で注文情報を入力する
 */
const NewOrder: React.FC = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [orderData, setOrderData] = useState({
    customerName: "",
    customerEmail: "",
    productId: "",
    quantity: "",
    deliveryDate: "",
    notes: "",
  });

  // ステップの定義
  const steps = ["顧客情報", "商品情報", "配送情報"];

  // サンプルの商品リスト（実際のアプリケーションでは API から取得）
  const products = [
    { id: "1", name: "商品A", price: 1000 },
    { id: "2", name: "商品B", price: 2000 },
    { id: "3", name: "商品C", price: 3000 },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    // TODO: API を呼び出して注文を登録
    console.log("Order submitted:", orderData);
    // 成功したらダッシュボードに戻る
    router.push("/");
  };

  // ステップごとのコンテンツ
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="customerName"
                label="顧客名"
                fullWidth
                required
                value={orderData.customerName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="customerEmail"
                label="メールアドレス"
                fullWidth
                required
                type="email"
                value={orderData.customerEmail}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="productId"
                label="商品"
                fullWidth
                required
                select
                value={orderData.productId}
                onChange={handleChange}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} - ¥{product.price.toLocaleString()}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="quantity"
                label="数量"
                fullWidth
                required
                type="number"
                value={orderData.quantity}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="deliveryDate"
                label="配送希望日"
                fullWidth
                required
                type="date"
                InputLabelProps={{ shrink: true }}
                value={orderData.deliveryDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="備考"
                fullWidth
                multiline
                rows={4}
                value={orderData.notes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* ヘッダー */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/")}
          sx={{ mr: 2 }}
        >
          戻る
        </Button>
        <Typography variant="h4" component="h1">
          新規注文登録
        </Typography>
      </Box>

      {/* メインコンテンツ */}
      <Paper sx={{ p: 4 }}>
        {/* ステッパー */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* フォーム */}
        <Box sx={{ mt: 4, mb: 4 }}>{getStepContent(activeStep)}</Box>

        {/* ボタン */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          {activeStep > 0 && <Button onClick={handleBack}>戻る</Button>}
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={
                !orderData.customerName ||
                !orderData.productId ||
                !orderData.deliveryDate
              }
            >
              注文を確定
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && !orderData.customerName) ||
                (activeStep === 1 && !orderData.productId)
              }
            >
              次へ
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default NewOrder;
