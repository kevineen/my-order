import { useState, useEffect } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
  Box,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

interface SystemSettingsData {
  language: string;
  timezone: string;
  dateFormat: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

const TIMEZONES = [
  { value: "Asia/Tokyo", label: "東京 (UTC+9)" },
  { value: "Asia/Seoul", label: "ソウル (UTC+9)" },
  { value: "Asia/Shanghai", label: "上海 (UTC+8)" },
  { value: "Asia/Singapore", label: "シンガポール (UTC+8)" },
];

const DATE_FORMATS = [
  { value: "YYYY/MM/DD", label: "YYYY/MM/DD" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
];

export default function SystemSettings() {
  const [formData, setFormData] = useState<SystemSettingsData>({
    language: "ja",
    timezone: "Asia/Tokyo",
    dateFormat: "YYYY/MM/DD",
    emailNotifications: true,
    pushNotifications: true,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings/system", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("設定の取得に失敗しました");
        }

        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "予期せぬエラーが発生しました"
        );
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/settings/system", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("設定の更新に失敗しました");
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "予期せぬエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        システム設定
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          設定を更新しました
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>言語</InputLabel>
            <Select
              name="language"
              value={formData.language}
              onChange={handleChange}
              label="言語"
            >
              <MenuItem value="ja">日本語</MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="zh">中文</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>タイムゾーン</InputLabel>
            <Select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              label="タイムゾーン"
            >
              {TIMEZONES.map((tz) => (
                <MenuItem key={tz.value} value={tz.value}>
                  {tz.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>日付形式</InputLabel>
            <Select
              name="dateFormat"
              value={formData.dateFormat}
              onChange={handleChange}
              label="日付形式"
            >
              {DATE_FORMATS.map((format) => (
                <MenuItem key={format.value} value={format.value}>
                  {format.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            通知設定
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={formData.emailNotifications}
                onChange={handleSwitchChange}
                name="emailNotifications"
              />
            }
            label="メール通知"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.pushNotifications}
                onChange={handleSwitchChange}
                name="pushNotifications"
              />
            }
            label="プッシュ通知"
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
