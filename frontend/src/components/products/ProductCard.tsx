import { FC } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  styled,
} from "@mui/material";
import { Product } from "@/types/product";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const StyledCardMedia = styled(CardMedia)({
  paddingTop: "56.25%", // 16:9
});

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
});

const ProductPrice = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: "bold",
}));

/**
 * 商品カードコンポーネント
 * @param {ProductCardProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} 商品カード
 */
const ProductCard: FC<ProductCardProps> = ({ product }) => {
  return (
    <StyledCard>
      <StyledCardMedia
        image={product.imageUrl || "/images/no-image.png"}
        title={product.name}
      />
      <StyledCardContent>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.description}
        </Typography>
        <ProductPrice variant="h6" sx={{ mt: 2 }}>
          ¥{product.price.toLocaleString()}
        </ProductPrice>
        <Typography variant="body2" color="textSecondary">
          在庫: {product.stock} 個
        </Typography>
      </StyledCardContent>
      <CardActions>
        <Link
          href={`/products/${product.id}`}
          passHref
          style={{ width: "100%" }}
        >
          <Button size="small" color="primary" fullWidth>
            詳細を見る
          </Button>
        </Link>
      </CardActions>
    </StyledCard>
  );
};

export default ProductCard;
