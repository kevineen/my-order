import { useState } from "react";
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import SecurityIcon from "@mui/icons-material/Security";
import ProfileSettings from "@/components/settings/ProfileSettings";
import SystemSettings from "@/components/settings/SystemSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function SettingsPage() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <StyledContainer>
      <Typography variant="h4" component="h1" gutterBottom>
        設定
      </Typography>
      <StyledPaper>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="設定タブ"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            icon={<PersonIcon />}
            iconPosition="start"
            label="プロフィール"
            id="settings-tab-0"
          />
          <Tab
            icon={<SettingsIcon />}
            iconPosition="start"
            label="システム設定"
            id="settings-tab-1"
          />
          <Tab
            icon={<SecurityIcon />}
            iconPosition="start"
            label="セキュリティ"
            id="settings-tab-2"
          />
        </Tabs>
        <Divider />

        <TabPanel value={currentTab} index={0}>
          <ProfileSettings />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <SystemSettings />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <SecuritySettings />
        </TabPanel>
      </StyledPaper>
    </StyledContainer>
  );
}
