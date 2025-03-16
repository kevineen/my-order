import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { ShoppingCart, Dashboard } from "@mui/icons-material";
import { useRouter } from "next/router";

interface AdminSidebarProps {
  menuItems: {
    label: string;
    items: {
      href: string;
      label: string;
    }[];
  }[];
}

export const AdminSidebar = ({ menuItems }: AdminSidebarProps) => {
  const router = useRouter();

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
        {menuItems.map((section) => (
          <div key={section.label}>
            <ListSubheader>{section.label}</ListSubheader>
            {section.items.map((item) => (
              <ListItemButton
                key={item.href}
                onClick={() => router.push(item.href)}
                selected={router.pathname === item.href}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </div>
        ))}
      </List>
    </Drawer>
  );
};
