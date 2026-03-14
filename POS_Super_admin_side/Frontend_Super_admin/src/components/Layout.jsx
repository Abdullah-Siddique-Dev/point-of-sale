import React, { useState } from "react";
import { Layout as AntLayout, Menu } from "antd";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  ShopOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = AntLayout;

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "dashboard",
      icon: <HomeOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/"),
    },
    {
      key: "sales",
      icon: <ShoppingCartOutlined />,
      label: "Sales",
      children: [
        {
          key: "new-sale",
          label: "New sale",
          onClick: () => navigate("/sales/new"),
        },
        {
          key: "manage-sale",
          label: "Manage sale",
          onClick: () => navigate("/sales/manage"),
        },
        {
          key: "pos-sale",
          label: "Pos sale",
          onClick: () => navigate("/sales/pos"),
        },
        {
          key: "invoice-text",
          label: "Invoice Text",
          onClick: () => navigate("/sales/invoice-text"),
        },
      ],
    },
    {
      key: "order",
      icon: <FileTextOutlined />,
      label: "Order",
    },
    {
      key: "product",
      icon: <ShopOutlined />,
      label: "Product",
    },
    {
      key: "customer",
      icon: <TeamOutlined />,
      label: "Customer",
    },
    {
      key: "supplier",
      icon: <UserOutlined />,
      label: "Supplier",
    },
  ];

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          background: "#1a1a1a",
        }}
      >
        <div
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#52c41a",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          {!collapsed ? "ISSHUE" : "IS"}
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "20px 0",
            color: "#fff",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "#fff",
              margin: "0 auto 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            👨‍💼
          </div>
          {!collapsed && <div style={{ color: "#fff" }}>SUPER ADMIN</div>}
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["dashboard"]}
          mode="inline"
          items={menuItems}
          style={{ background: "#1a1a1a" }}
        />
      </Sider>
      <AntLayout>
        <Header style={{ padding: 0, background: "#fff" }} />
        <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
