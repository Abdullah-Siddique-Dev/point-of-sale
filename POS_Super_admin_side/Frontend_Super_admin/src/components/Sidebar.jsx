import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined, ShoppingCartOutlined, UserOutlined, BarChartOutlined,
  AppstoreOutlined, TagsOutlined, LogoutOutlined, DownOutlined, RightOutlined, FileTextOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const getDefaultOpen = () => {
    if (["/", "/dashboard"].includes(pathname)) return null;
    if (["/invoices"].includes(pathname)) return "POS Sales";
    if (["/categories", "/categories/add", "/sub-categories", "/sub-categories/add"].includes(pathname)) return "Category";
    if (["/products", "/products/add"].includes(pathname)) return "Products";
    return null;
  };

  const [openMenu, setOpenMenu] = useState(getDefaultOpen);

  const logout = () => {
    if (window.confirm("Logout?")) {
      localStorage.removeItem("superAdmin");
      localStorage.removeItem("postUser");
      window.location.href = "http://localhost:3000/login";
    }
  };

  const toggle = (label) => setOpenMenu(openMenu === label ? null : label);

  const menuItems = [
    { path: "/dashboard", icon: <HomeOutlined />, label: "Dashboard" },
    {
      icon: <ShoppingCartOutlined />, label: "POS Sales",
      submenu: [
        { path: "/invoices", label: "All Orders" },
      ],
    },
    { path: "/customers", icon: <UserOutlined />, label: "Customers" },
    {
      icon: <TagsOutlined />, label: "Category",
      submenu: [
        { path: "/categories", label: "All Category" },
        { path: "/categories/add", label: "Add Category" },
        { path: "/sub-categories", label: "All Sub Category" },
        { path: "/sub-categories/add", label: "Add Sub Category" },
      ],
    },
    {
      icon: <AppstoreOutlined />, label: "Products",
      submenu: [
        { path: "/products", label: "All Products" },
        { path: "/products/add", label: "Add Product" },
      ],
    },
    { path: "/statistics", icon: <BarChartOutlined />, label: "Statistics" },
  ];

  return (
    <div style={{ width: 220, background: "#1a1f2e", height: "100vh", position: "fixed", left: 0, top: 0, overflowY: "auto", zIndex: 100, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px", borderBottom: "1px solid #2d3348" }}>
        <h2 style={{ color: "#fff", fontSize: 18, fontWeight: "bold", margin: 0 }}>Super Admin</h2>
        <p style={{ color: "#ec4899", fontSize: 11, margin: "4px 0 0" }}>Administrator</p>
      </div>
      <div style={{ padding: "8px 0", flex: 1 }}>
        {menuItems.map((item, i) => (
          <div key={i}>
            {item.submenu ? (
              <>
                <div onClick={() => toggle(item.label)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 18px", color: openMenu === item.label ? "#fff" : "#8b95a9", cursor: "pointer", background: openMenu === item.label ? "#252b3b" : "transparent", borderLeft: openMenu === item.label ? "3px solid #ec4899" : "3px solid transparent", fontSize: 14 }}>
                  <span style={{ fontSize: 16, width: 20 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <span style={{ fontSize: 11 }}>{openMenu === item.label ? <DownOutlined /> : <RightOutlined />}</span>
                </div>
                {openMenu === item.label && (
                  <div style={{ background: "#141824" }}>
                    {item.submenu.map((sub, j) => (
                      <Link key={j} to={sub.path}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px 9px 48px", color: pathname === sub.path ? "#fff" : "#8b95a9", textDecoration: "none", fontSize: 13, background: pathname === sub.path ? "#ec4899" : "transparent", borderLeft: pathname === sub.path ? "3px solid #c2185b" : "3px solid transparent" }}>
                        <span>•</span>{sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link to={item.path}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 18px", color: pathname === item.path ? "#fff" : "#8b95a9", textDecoration: "none", background: pathname === item.path ? "#ec4899" : "transparent", borderLeft: pathname === item.path ? "3px solid #c2185b" : "3px solid transparent", fontSize: 14 }}>
                <span style={{ fontSize: 16, width: 20 }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
        <div onClick={logout}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 18px", color: "#8b95a9", cursor: "pointer", borderTop: "1px solid #2d3348", marginTop: 8, fontSize: 14 }}>
          <LogoutOutlined style={{ fontSize: 16 }} /><span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
