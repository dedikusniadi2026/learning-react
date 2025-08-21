import { useState } from "react";
import {
  ProductOutlined,
  PieChartOutlined,
  UserOutlined,
  SearchOutlined,
  SettingOutlined,
  BellOutlined,
  MessageOutlined,
  DownOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  theme,
  Input,
  Space,
  Badge,
  Avatar,
  Typography,
  Dropdown,
  Switch,
  ConfigProvider,
} from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const { Text } = Typography;
const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigate = useNavigate();
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const user = useAuthStore((state) => state.user);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    getItem("Dashboard", "dashboard", <PieChartOutlined />),
    getItem("Products", "products", <ProductOutlined />),
    getItem("Users", "users", <UserOutlined />),
  ];

  const onMenuClick = ({ key }) => {
    if (key === "logout") {
      setLoggedIn(false);
      navigate("/login");
    } else {
      navigate(`/${key}`);
    }
  };

  const avatarMenu = {
    items: [
      { key: "profile", label: "Profile" },
      { key: "settings", label: "Settings" },
      { type: "divider" },
      { key: "logout", label: "Logout" },
    ],
    onClick: ({ key }) => {
      if (key === "logout") {
        setLoggedIn(false);
        navigate("/login");
      } else {
        console.log("Menu clicked:", key);
      }
    },
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div
            style={{
              height: 32,
              margin: 16,
              color: "#fff",
              textAlign: "center",
            }}
          >
            Admin
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={["dashboard"]}
            mode="inline"
            items={menuItems}
            onClick={onMenuClick}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: "0 24px",
              background: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <Input
              placeholder="Type to search..."
              prefix={<SearchOutlined />}
              style={{ width: 250, borderRadius: 20 }}
            />

            <Space size="large" align="center">
              <Space>
                <BulbOutlined style={{ fontSize: 18, color: "#8c8c8c" }} />
                <Switch
                  checked={isDarkMode}
                  onChange={setIsDarkMode}
                  checkedChildren="Dark"
                  unCheckedChildren="Light"
                />
              </Space>

              <SettingOutlined style={{ fontSize: 18, color: "#8c8c8c" }} />

              <Badge dot>
                <BellOutlined style={{ fontSize: 18, color: "#8c8c8c" }} />
              </Badge>

              <Badge dot>
                <MessageOutlined style={{ fontSize: 18, color: "#8c8c8c" }} />
              </Badge>

              <Dropdown menu={avatarMenu} placement="bottomRight" arrow>
                <Space style={{ cursor: "pointer" }}>
                  <Avatar src="https://i.pravatar.cc/40" />
                  <div style={{ lineHeight: 1 }}>
                    <Text strong>{user?.username || "Guest"}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {user?.role || "User"}
                    </Text>
                  </div>
                  <DownOutlined style={{ fontSize: 12 }} />
                </Space>
              </Dropdown>
            </Space>
          </Header>

          <Content style={{ margin: "0 16px" }}>
            <br />
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
