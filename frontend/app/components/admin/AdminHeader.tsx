import { AppBar, Toolbar, Typography } from "@mui/material";

export const AdminHeader = () => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          注文管理システム
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
