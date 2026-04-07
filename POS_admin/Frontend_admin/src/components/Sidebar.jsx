import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined, ShoppingCartOutlined, UserOutlined, BarChartOutlined,
  AppstoreOutlined, TagsOutlined, LogoutOutlined, DownOutlined, TeamOutlined, ShoppingOutlined, DatabaseOutlined, FileTextOutlined, PercentageOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
  const { pathname } = useLocation();

  const getDefaultOpen = () => {
    if (["/", "/dashboard"].includes(pathname)) return null;
    if (["/invoices"].includes(pathname)) return "POS Sales";
    if (["/categories", "/categories/add", "/sub-categories", "/sub-categories/add"].includes(pathname)) return "Category";
    if (["/products", "/products/add"].includes(pathname)) return "Products";
    if (["/suppliers", "/suppliers/add"].includes(pathname)) return "Suppliers";
    if (["/purchase/stock", "/purchase/add", "/purchase/invoices", "/purchase/summary", "/purchase/returns", "/purchase/returns/add"].includes(pathname)) return "Purchase";
    if (["/inventory/total-stock", "/inventory/out-of-stock", "/inventory/alerts"].includes(pathname)) return "Inventory";
    if (["/reports/sales", "/reports/purchase", "/reports/stock"].includes(pathname)) return "Reports";
    if (["/tax", "/tax/settings", "/tax/assignments"].includes(pathname)) return "Tax";
    return null;
  };

  const [openMenu, setOpenMenu] = useState(getDefaultOpen);

  const logout = () => {
    if (window.confirm("Logout?")) {
      localStorage.removeItem("superAdmin");
      localStorage.removeItem("postUser");
      window.location.href = "/login";
    }
  };

  const toggle = (label) => setOpenMenu(openMenu === label ? null : label);

  const menuItems = [
    { path: "/dashboard", icon: <HomeOutlined />, label: "Dashboard" },
    {
      icon: <ShoppingCartOutlined />, label: "POS Sales",
      submenu: [
        { path: "/invoices", label: "POS History" },
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
    {
      icon: <TeamOutlined />, label: "Suppliers",
      submenu: [
        { path: "/suppliers", label: "List of Suppliers" },
        { path: "/suppliers/add", label: "Add New Supplier" },
      ],
    },
    {
      icon: <ShoppingOutlined />, label: "Purchase",
      submenu: [
        { path: "/purchase/stock", label: "Stock Report" },
        { path: "/purchase/add", label: "Add New Purchase" },
        { path: "/purchase/invoices", label: "Purchase Invoices" },
        { path: "/purchase/summary", label: "Purchase Summary" },
        { path: "/purchase/returns", label: "Purchase Returns" },
        { path: "/purchase/returns/add", label: "Add Purchase Return" },
      ],
    },
    {
      icon: <DatabaseOutlined />, label: "Inventory",
      submenu: [
        { path: "/inventory/total-stock", label: "Total Stock" },
        { path: "/inventory/out-of-stock", label: "Out of Stock" },
        { path: "/inventory/alerts", label: "Stock Alert" },
      ],
    },
    {
      icon: <FileTextOutlined />, label: "Reports",
      submenu: [
        { path: "/reports/sales", label: "Sales Report" },
        { path: "/reports/purchase", label: "Purchase Report" },
        { path: "/reports/stock", label: "Stock Report" },
      ],
    },
    {
      icon: <PercentageOutlined />, label: "Tax",
      submenu: [
        { path: "/tax", label: "Manage Tax" },
        { path: "/tax/settings", label: "Tax Settings" },
        { path: "/tax/assignments", label: "Tax Assignment" },
      ],
    },
  ];

  return (
    <div style={{
      width: '260px',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1625 0%, #2d2640 100%)',
      borderRight: '2px solid #4f46e5',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      boxShadow: '4px 0 12px rgba(0,0,0,0.15)'
    }}>
      {/* Logo & Brand */}
      <div style={{
        padding: '24px 15px 20px',
        borderBottom: '1px solid var(--border-sidebar)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        background: 'linear-gradient(135deg, #1a1625 0%, #2d2640 100%)'
      }}>
        <img 
          src="/exenra-logo.jpeg" 
          alt="Exenra Logo" 
          style={{
            width: 160,
            height: 160,
            objectFit: 'contain',
            display: 'block',
            filter: 'brightness(1.15) contrast(1.05)',
            marginBottom: -12
          }}
        />
        <div style={{ textAlign: 'center', width: '100%' }}>
          <p style={{
            fontSize: '12px',
            margin: 0,
            padding: 0,
            color: '#a78bfa',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            POS Admin
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
                  onClick={() => toggle(item.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: openMenu === item.label ? 'var(--bg-sidebar-hover)' : 'transparent',
                    color: openMenu === item.label ? 'var(--text-sidebar)' : 'var(--text-sidebar-gray)',
                    fontWeight: openMenu === item.label ? '600' : '500',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => {
                    if (openMenu !== item.label) {
                      e.currentTarget.style.background = 'var(--bg-sidebar-hover)';
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
                          color: pathname === sub.path ? 'white' : 'var(--text-sidebar-gray)',
                          fontWeight: pathname === sub.path ? '600' : '500',
                          fontSize: '13px',
                          marginBottom: '2px',
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                          if (pathname !== sub.path) {
                            e.currentTarget.style.background = 'var(--bg-sidebar-hover)';
                            e.currentTarget.style.color = 'var(--text-sidebar)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (pathname !== sub.path) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-sidebar-gray)';
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
                  color: pathname === item.path ? 'white' : 'var(--text-sidebar-gray)',
                  fontWeight: pathname === item.path ? '600' : '500',
                  fontSize: '14px',
                  boxShadow: pathname === item.path ? '0 2px 8px rgba(79, 70, 229, 0.4)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (pathname !== item.path) {
                    e.currentTarget.style.background = 'var(--bg-sidebar-hover)';
                    e.currentTarget.style.color = 'var(--text-sidebar)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== item.path) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-sidebar-gray)';
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
        borderTop: '1px solid var(--border-sidebar)'
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
            color: 'var(--text-sidebar-gray)',
            fontWeight: '600',
            fontSize: '14px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-sidebar-hover)';
            e.currentTarget.style.color = 'var(--text-sidebar)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-sidebar-gray)';
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
