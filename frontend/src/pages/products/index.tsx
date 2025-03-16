import { useState, useEffect } from "react";
import { Container, Typography, Grid, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types/product";

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const LoadingWrapper = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "50vh",
});

/**
 * 商品一覧ページコンポーネント
 * @returns {JSX.Element} 商品一覧ページ
 */
export default function ProductsPage(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("商品データの取得に失敗しました");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "予期せぬエラーが発生しました"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <LoadingWrapper>
        <CircularProgress />
      </LoadingWrapper>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Typography variant="h4" component="h1" gutterBottom>
        商品一覧
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </StyledContainer>
  );
}
