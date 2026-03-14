import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  CopyOutlined,
  UserOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  TagsOutlined,
  LogoutOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState("POS Management");

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
    { path: "/", icon: <HomeOutlined />, label: "Dashboard" },
    { 
      icon: <ShoppingCartOutlined />, 
      label: "POS Management", 
      submenu: [
        { path: "/", label: "POS" },
        { path: "/invoices", label: "POS Sales History" },
      ]
    },
    { path: "/customers", icon: <UserOutlined />, label: "Customer" },
    { 
      icon: <TagsOutlined />, 
      label: "Category Management", 
      submenu: [
        { path: "/categories", label: "Category" },
        { path: "/sub-categories", label: "Sub Category" },
      ]
    },
    { 
      icon: <AppstoreOutlined />, 
      label: "Product Management", 
      submenu: [
        { path: "/products", label: "All Product" },
        { path: "/products/add", label: "Add Product" },
        { path: "/products/add-digital", label: "Add Digital Product" },
      ]
    },
    { path: "/statistics", icon: <BarChartOutlined />, label: "Statistics" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="text-xl font-bold text-white">POS System</h2>
      </div>
      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.submenu ? (
              <div className="menu-item-group">
                <div 
                  className={`menu-item ${openMenu === item.label && "active"}`}
                  onClick={() => toggleMenu(item.label)}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {openMenu === item.label ? <UpOutlined className="text-xs" /> : <DownOutlined className="text-xs" />}
                </div>
                {openMenu === item.label && (
                  <div className="submenu">
                    {item.submenu.map((sub, subIndex) => (
                      <Link
                        key={subIndex}
                        to={sub.path}
                        className={`submenu-item ${pathname === sub.path && "active"}`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.path}
                className={`menu-item ${pathname === item.path && "active"}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
        <div className="menu-item logout" onClick={logout}>
          <LogoutOutlined />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
