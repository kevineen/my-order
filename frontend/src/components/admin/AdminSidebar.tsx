import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ShoppingCart, Dashboard } from "@mui/icons-material";
import { useRouter } from "next/router";

export const AdminSidebar = () => {
  const router = useRouter();

  const menuItems = [
    { text: "ダッシュボード", icon: <Dashboard />, path: "/admin" },
    { text: "注文管理", icon: <ShoppingCart />, path: "/admin/orders" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          top: "64px", // ヘッダーの高さ分下げる
          height: "calc(100% - 64px)", // ヘッダーの高さ分引く
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => router.push(item.path)}
            selected={router.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};
