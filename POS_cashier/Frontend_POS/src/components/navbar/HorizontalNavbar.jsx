import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

const HorizontalNavbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("postUser"));
  const isAdmin = !user?.role || user?.role === "admin";
  const [openDropdown, setOpenDropdown] = useState(null);
  const closeTimeoutRef = useRef(null);

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("postUser");
      localStorage.removeItem("superAdmin");
      navigate("/login");
      message.success("Logout successful.");
    }
  };

  const toggleDropdown = (menuLabel) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setOpenDropdown(openDropdown === menuLabel ? null : menuLabel);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 300); // 300ms delay before closing
  };

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
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
      icon: <DatabaseOutlined />, 
      label: "Inventory",
      submenu: [
        { path: "/inventory/total-stock", label: "Total Stock" },
        { path: "/inventory/out-of-stock", label: "Out of Stock" },
      ],
    },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100px',
      background: 'linear-gradient(135deg, #1a1625 0%, #2d2640 100%)',
      borderBottom: '2px solid #4f46e5',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      padding: '0 32px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      {/* Logo & Brand */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        marginRight: 60,
        paddingRight: 40,
        borderRight: '1px solid rgba(255,255,255,0.1)',
        height: '100%',
        paddingTop: 10,
        paddingBottom: 10
      }}>
        <img 
          src="/images/exenra-logo.jpeg" 
          alt="Exenra Logo" 
          style={{
            width: 140,
            height: 140,
            objectFit: 'contain',
            borderRadius: '12px',
            filter: 'brightness(1.15) contrast(1.05)',
            marginBottom: -8
          }}
        />
        <p style={{
          fontSize: '11px',
          margin: 0,
          color: '#a78bfa',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          POS Cashier
        </p>
      </div>

      {/* Navigation Menu */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        justifyContent: 'flex-end',
        marginRight: 20
      }}>
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            style={{ position: 'relative' }}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
          >
            {item.submenu ? (
              <div>
                <div
                  onClick={() => toggleDropdown(item.label)}
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 20px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    background: openDropdown === item.label ? 'rgba(79, 70, 229, 0.2)' : 'transparent',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '15px',
                    gap: 10,
                    whiteSpace: 'nowrap',
                    border: openDropdown === item.label ? '1px solid rgba(79, 70, 229, 0.5)' : '1px solid transparent'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                  <span style={{ 
                    fontSize: '10px', 
                    transition: 'transform 0.3s', 
                    transform: openDropdown === item.label ? 'rotate(180deg)' : 'rotate(0deg)',
                    marginLeft: 4
                  }}>
                    <DownOutlined />
                  </span>
                </div>
                
                {/* Dropdown Menu */}
                {openDropdown === item.label && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: 12,
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                    minWidth: '240px',
                    padding: '8px',
                    zIndex: 1001,
                    animation: 'slideDown 0.3s ease'
                  }}>
                    {item.submenu.map((sub, subIndex) => (
                      <Link
                        key={subIndex}
                        to={sub.path}
                        onClick={closeDropdown}
                        style={{
                          display: 'block',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                          background: pathname === sub.path ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                          color: pathname === sub.path ? 'white' : '#6b7280',
                          fontWeight: pathname === sub.path ? '600' : '500',
                          fontSize: '14px',
                          marginBottom: '2px'
                        }}
                        onMouseEnter={(e) => {
                          if (pathname !== sub.path) {
                            e.currentTarget.style.background = '#f9fafb';
                            e.currentTarget.style.color = '#111827';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (pathname !== sub.path) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#6b7280';
                          }
                        }}
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  background: pathname === item.path ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '15px',
                  gap: 10,
                  whiteSpace: 'nowrap',
                  border: pathname === item.path ? '1px solid rgba(79, 70, 229, 0.5)' : '1px solid transparent',
                  boxShadow: pathname === item.path ? '0 4px 12px rgba(79, 70, 229, 0.4)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (pathname !== item.path) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== item.path) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div
        onClick={logout}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '14px 24px',
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'all 0.3s',
          background: 'transparent',
          color: 'white',
          fontWeight: '600',
          fontSize: '15px',
          gap: 10,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
          e.currentTarget.style.borderColor = '#ef4444';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <span style={{ fontSize: '18px' }}><LogoutOutlined /></span>
        <span>Logout</span>
      </div>
    </div>
  );
};

export default HorizontalNavbar;
