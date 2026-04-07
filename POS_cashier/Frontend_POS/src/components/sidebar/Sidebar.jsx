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
  TeamOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("postUser"));
  const isAdmin = !user?.role || user?.role === "admin";

  const getDefaultOpen = () => {
    if (pathname === "/" || pathname === "/dashboard" || pathname === "/invoices") return "POS Management";
    if (["/categories", "/categories/add", "/sub-categories", "/sub-categories/add"].includes(pathname)) return "Category Management";
    if (["/products", "/products/add"].includes(pathname)) return "Product Management";
    if (["/inventory/total-stock", "/inventory/out-of-stock"].includes(pathname)) return "Inventory";
    return null;
  };

  const [openMenu, setOpenMenu] = useState(getDefaultOpen);

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("postUser");
      localStorage.removeItem("superAdmin");
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
    { path: "/suppliers", icon: <TeamOutlined />, label: "Suppliers" },
    {
      icon: <DatabaseOutlined />, label: "Inventory",
      submenu: [
        { path: "/inventory/total-stock", label: "Total Stock" },
        { path: "/inventory/out-of-stock", label: "Out of Stock" },
      ],
    },
  ];

  return (
    <div style={{
      width: '260px',
      height: '100vh',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border-dark)',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100
    }}>
      {/* Logo & Brand */}
      <div style={{
        padding: '4px 15px 12px',
        borderBottom: '1px solid var(--border-dark)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0
      }}>
        <img 
          src="/images/exenra-logo.jpeg" 
          alt="Exenra Logo" 
          style={{
            width: 220,
            height: 220,
            objectFit: 'contain',
            marginBottom: -55,
            display: 'block'
          }}
        />
        <div style={{ textAlign: 'center', width: '100%', marginTop: -30 }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            margin: 0,
            padding: 0,
            color: 'var(--text-light)',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.01em',
            lineHeight: 0.9
          }}>
            Exenra POS
          </h2>
          <p style={{
            fontSize: '13px',
            margin: '5px 0 0',
            padding: 0,
            color: 'var(--text-gray)',
            fontWeight: '500',
            textTransform: 'capitalize'
          }}>
            {user?.role || "Cashier"}
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 12px'
      }}>
        {menuItems.map((item, index) => (
          <div key={index} style={{ marginBottom: '4px' }}>
            {item.submenu ? (
              <div>
                <div
                  onClick={() => toggleMenu(item.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: openMenu === item.label ? 'var(--bg-hover)' : 'transparent',
                    color: openMenu === item.label ? 'var(--text-light)' : 'var(--text-gray)',
                    fontWeight: openMenu === item.label ? '600' : '500',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => {
                    if (openMenu !== item.label) {
                      e.currentTarget.style.background = 'var(--bg-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (openMenu !== item.label) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: '18px', marginRight: '12px' }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <span style={{ fontSize: '12px', transition: 'transform 0.2s', transform: openMenu === item.label ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                    <DownOutlined />
                  </span>
                </div>
                {openMenu === item.label && (
                  <div style={{ marginTop: '4px', marginLeft: '12px' }}>
                    {item.submenu.map((sub, subIndex) => (
                      <Link
                        key={subIndex}
                        to={sub.path}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px 16px',
                          paddingLeft: '44px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                          background: pathname === sub.path ? 'var(--primary)' : 'transparent',
                          color: pathname === sub.path ? 'white' : 'var(--text-gray)',
                          fontWeight: pathname === sub.path ? '600' : '500',
                          fontSize: '13px',
                          marginBottom: '2px',
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                          if (pathname !== sub.path) {
                            e.currentTarget.style.background = 'var(--bg-hover)';
                            e.currentTarget.style.color = 'var(--text-light)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (pathname !== sub.path) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-gray)';
                          }
                        }}
                      >
                        {pathname === sub.path && (
                          <div style={{
                            position: 'absolute',
                            left: '16px',
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: 'white'
                          }} />
                        )}
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  background: pathname === item.path ? 'var(--primary)' : 'transparent',
                  color: pathname === item.path ? 'white' : 'var(--text-gray)',
                  fontWeight: pathname === item.path ? '600' : '500',
                  fontSize: '14px',
                  boxShadow: pathname === item.path ? '0 2px 8px rgba(79, 70, 229, 0.4)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (pathname !== item.path) {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text-light)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== item.path) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-gray)';
                  }
                }}
              >
                <span style={{ fontSize: '18px', marginRight: '12px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div style={{
        padding: '16px 12px',
        borderTop: '1px solid var(--border-dark)'
      }}>
        <div
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: 'transparent',
            color: 'var(--text-gray)',
            fontWeight: '600',
            fontSize: '14px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-hover)';
            e.currentTarget.style.color = 'var(--text-light)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-gray)';
          }}
        >
          <span style={{ fontSize: '18px', marginRight: '12px' }}><LogoutOutlined /></span>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
