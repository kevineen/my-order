import React, { useState, ChangeEvent } from "react";
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
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

/**
 * 商品登録ページコンポーネント
 * 新規商品の登録フォームを提供する
 *
 * 機能：
 * - 商品基本情報の入力（名称、コード、価格）
 * - カテゴリー選択
 * - 在庫管理情報の設定
 * - フォームバリデーション
 * - 登録前の入力チェック
 */
const NewProduct: React.FC = () => {
  const router = useRouter();

  /**
   * 商品データの状態管理
   * すべてのフォーム入力値をオブジェクトとして管理
   */
  const [productData, setProductData] = useState({
    name: "",
    code: "",
    price: "",
    category: "",
    description: "",
    stockQuantity: "",
    minimumStock: "",
  });

  /**
   * カテゴリーの選択肢
   * TODO: APIから動的に取得するように変更
   */
  const categories = [
    { id: "1", name: "食品" },
    { id: "2", name: "飲料" },
    { id: "3", name: "日用品" },
  ];

  /**
   * テキストフィールドの変更ハンドラ
   * @param e - 入力イベント
   */
  const handleTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * セレクトフィールドの変更ハンドラ
   * @param e - 選択イベント
   */
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * フォーム送信ハンドラ
   * @param e - フォーム送信イベント
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API を呼び出して商品を登録
    console.log("Product submitted:", productData);
    router.push("/products");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* ページヘッダー */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/products")}
          sx={{ mr: 2 }}
        >
          戻る
        </Button>
        <Typography variant="h4" component="h1">
          商品登録
        </Typography>
      </Box>

      {/* 登録フォーム */}
      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* 商品基本情報 */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="商品名"
                fullWidth
                required
                value={productData.name}
                onChange={handleTextChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="code"
                label="商品コード"
                fullWidth
                required
                value={productData.code}
                onChange={handleTextChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="価格"
                fullWidth
                required
                type="number"
                InputProps={{
                  startAdornment: "¥",
                }}
                value={productData.price}
                onChange={handleTextChange}
              />
            </Grid>

            {/* カテゴリー選択 */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="category-label">カテゴリー</InputLabel>
                <Select
                  labelId="category-label"
                  name="category"
                  value={productData.category}
                  label="カテゴリー"
                  onChange={handleSelectChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* 商品詳細情報 */}
            <Grid item xs={12}>
              <TextField
                name="description"
                label="商品説明"
                fullWidth
                multiline
                rows={4}
                value={productData.description}
                onChange={handleTextChange}
              />
            </Grid>

            {/* 在庫管理情報 */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="stockQuantity"
                label="在庫数"
                fullWidth
                required
                type="number"
                value={productData.stockQuantity}
                onChange={handleTextChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="minimumStock"
                label="最小在庫数"
                fullWidth
                required
                type="number"
                value={productData.minimumStock}
                onChange={handleTextChange}
              />
            </Grid>
          </Grid>

          {/* アクションボタン */}
          <Box
            sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button variant="outlined" onClick={() => router.push("/products")}>
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                !productData.name || !productData.code || !productData.price
              }
            >
              登録
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default NewProduct;
