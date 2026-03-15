import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  TagsOutlined,
  LogoutOutlined,
  DownOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("postUser"));
  const isAdmin = !user?.role || user?.role === "admin";

  const getDefaultOpen = () => {
    if (pathname === "/" || pathname === "/dashboard" || pathname === "/invoices") return "POS Management";
    if (["/categories", "/categories/add", "/sub-categories", "/sub-categories/add"].includes(pathname)) return "Category Management";
    if (["/products", "/products/add"].includes(pathname)) return "Product Management";
    return null;
  };

  const [openMenu, setOpenMenu] = useState(getDefaultOpen);

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("postUser");
      navigate("/login");
      message.success("Logout successful.");
    }
  };

  const toggleMenu = (menuLabel) => {
    setOpenMenu(openMenu === menuLabel ? null : menuLabel);
  };

  const menuItems = [
    { path: "/dashboard", icon: <HomeOutlined />, label: "Dashboard" },
    {
      icon: <ShoppingCartOutlined />,
      label: "POS Management",
      submenu: [
        { path: "/", label: "POS" },
        { path: "/invoices", label: "POS Sales History" },
      ],
    },
    { path: "/customers", icon: <UserOutlined />, label: "Customer" },
    ...(isAdmin ? [
      {
        icon: <TagsOutlined />,
        label: "Category Management",
        submenu: [
          { path: "/categories", label: "All Category" },
          { path: "/categories/add", label: "Add Category" },
          { path: "/sub-categories", label: "All Sub Category" },
          { path: "/sub-categories/add", label: "Add Sub Category" },
        ],
      },
    ] : []),
    {
      icon: <AppstoreOutlined />,
      label: "Product Management",
      submenu: [
        { path: "/products", label: "All Product" },
        { path: "/products/add", label: "Add Product" },
      ],
    },
    { path: "/statistics", icon: <BarChartOutlined />, label: "Statistics" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="text-xl font-bold text-white">POS System</h2>
        <p className="text-xs mt-1" style={{ color: isAdmin ? "#ec4899" : "#8b95a9", textTransform: "capitalize" }}>
          {user?.role || "cashier"}
        </p>
      </div>
      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.submenu ? (
              <div className="menu-item-group">
                <div
                  className={`menu-item ${openMenu === item.label ? "menu-open" : ""}`}
                  onClick={() => toggleMenu(item.label)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  <span className="arrow-icon">
                    {openMenu === item.label ? <DownOutlined /> : <RightOutlined />}
                  </span>
                </div>
                {openMenu === item.label && (
                  <div className="submenu">
                    {item.submenu.map((sub, subIndex) => (
                      <Link
                        key={subIndex}
                        to={sub.path}
                        className={`submenu-item ${pathname === sub.path ? "submenu-active" : ""}`}
                      >
                        <span className="submenu-dot">•</span>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.path}
                className={`menu-item ${pathname === item.path ? "menu-active" : ""}`}
              >
                <span className="menu-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
        <div className="menu-item menu-logout" onClick={logout}>
          <span className="menu-icon"><LogoutOutlined /></span>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
