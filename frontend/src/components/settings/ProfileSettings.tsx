import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Avatar,
  Typography,
  Box,
  Alert,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { styled } from "@mui/material/styles";
import { useAuth } from "@/hooks/useAuth";

const Input = styled("input")({
  display: "none",
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  marginBottom: theme.spacing(2),
}));

export default function ProfileSettings() {
  const { getUser } = useAuth();
  const user = getUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        position: user.position || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("プロフィールの更新に失敗しました");
      }

      setSuccess(true);
      // ユーザー情報を更新
      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "予期せぬエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const response = await fetch("/api/users/avatar", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("アバターの更新に失敗しました");
        }

        // アバターのURLを更新
        const data = await response.json();
        const currentUser = getUser();
        if (currentUser) {
          localStorage.setItem(
            "user",
            JSON.stringify({ ...currentUser, avatarUrl: data.avatarUrl })
          );
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "予期せぬエラーが発生しました"
        );
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          プロフィールを更新しました
        </Alert>
      )}

      <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
        <StyledAvatar src={user?.avatarUrl} alt={user?.name}>
          {user?.name?.charAt(0)}
        </StyledAvatar>
        <label htmlFor="avatar-input">
          <Input
            accept="image/*"
            id="avatar-input"
            type="file"
            onChange={handleAvatarChange}
          />
          <IconButton color="primary" component="span">
            <PhotoCamera />
          </IconButton>
        </label>
        <Typography variant="caption" color="textSecondary">
          クリックしてアバターを変更
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="name"
            label="名前"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="email"
            label="メールアドレス"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            type="email"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="phone"
            label="電話番号"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="position"
            label="役職"
            value={formData.position}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "更新中..." : "更新"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
