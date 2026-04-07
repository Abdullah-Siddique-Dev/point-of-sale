import { useEffect, useState } from "react";
import HorizontalNavbar from "../components/navbar/HorizontalNavbar";
import { Spin } from "antd";
import { 
  ShoppingCartOutlined, DollarOutlined, PlusCircleOutlined, 
  HistoryOutlined, ThunderboltOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

// Simple Stat Card for Cashier
const StatCard = ({ title, value, icon, color = "#4f46e5" }) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      transition: 'all 0.3s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', margin: '0 0 8px' }}>
            {title}
          </p>
          <h3 style={{ fontSize: 32, fontWeight: 800, color: '#111827', margin: 0 }}>
            {value}
          </h3>
        </div>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '14px',
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 24,
          boxShadow: `0 4px 12px ${color}40`
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Quick Action Button
const QuickActionButton = ({ label, icon, onClick, color = "#4f46e5" }) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        padding: '20px 24px',
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.3s',
        boxShadow: `0 4px 12px ${color}40`,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        justifyContent: 'center'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 16px ${color}60`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 4px 12px ${color}40`;
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
};

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch today's data
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [invoicesRes] = await Promise.all([
        fetch(`${BASE}/api/invoices/get-all`)
      ]);

      const allInvoices = await invoicesRes.json();
      
      // Filter today's invoices
      const todayInvoices = allInvoices.filter(inv => {
        const invDate = new Date(inv.createdAt);
        return invDate >= today && invDate < tomorrow;
      });

      // Calculate today's metrics
      const todaySales = todayInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
      const todayOrders = todayInvoices.length;
      const todayTax = todayInvoices.reduce((sum, inv) => sum + (inv.taxAmount || 0), 0);

      setDashboardData({
        todaySales,
        todayOrders,
        todayTax,
        recentOrders: allInvoices.slice(0, 10)
      });
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setLoading(false);
    }
  };

  if (loading || !dashboardData) {
    return (
      <div style={{ display: "flex", flexDirection: "column", background: "#f5f5f7", minHeight: "100vh" }}>
        <HorizontalNavbar />
        <div style={{ marginTop: 100, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh - 100px)" }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#f5f5f7", minHeight: "100vh" }}>
      <HorizontalNavbar />
      <div style={{ marginTop: 100, width: "100%" }}>
        <div style={{ padding: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* TOP CARDS - Today's Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              <StatCard 
                title="Today Sales" 
                value={`Rs ${dashboardData.todaySales.toLocaleString()}`} 
                icon={<DollarOutlined />} 
                color="#10b981"
              />
              <StatCard 
                title="Today Orders" 
                value={dashboardData.todayOrders} 
                icon={<ShoppingCartOutlined />} 
                color="#4f46e5"
              />
            </div>

            {/* QUICK ACTION BUTTONS */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <ThunderboltOutlined style={{ fontSize: 20, color: '#f59e0b' }} />
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#111827' }}>Quick Actions</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <QuickActionButton 
                  label="Go to POS" 
                  icon={<ShoppingCartOutlined />} 
                  onClick={() => navigate("/")}
                  color="#4f46e5"
                />
                <QuickActionButton 
                  label="New Order" 
                  icon={<PlusCircleOutlined />} 
                  onClick={() => navigate("/")}
                  color="#10b981"
                />
                <QuickActionButton 
                  label="Sales History" 
                  icon={<HistoryOutlined />} 
                  onClick={() => navigate("/invoices")}
                  color="#f59e0b"
                />
              </div>
            </div>

            {/* RECENT ORDERS TABLE */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ padding: '24px 28px', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#111827' }}>Recent Orders</h3>
                <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0', fontWeight: 500 }}>Latest transactions</p>
              </div>
              
              <div style={{ padding: 28 }}>
                {dashboardData.recentOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
                    <ShoppingCartOutlined style={{ fontSize: 48, color: '#e5e7eb', marginBottom: 16 }} />
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>No orders yet</p>
                    <p style={{ margin: '8px 0 0', fontSize: 14 }}>Start creating orders from POS</p>
                  </div>
                ) : (
                  <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                        <th style={{ textAlign: "left", paddingBottom: 12, color: "#6b7280", fontWeight: 800, fontSize: 11, textTransform: "uppercase" }}>Order ID</th>
                        <th style={{ textAlign: "left", paddingBottom: 12, color: "#6b7280", fontWeight: 800, fontSize: 11, textTransform: "uppercase" }}>Customer</th>
                        <th style={{ textAlign: "left", paddingBottom: 12, color: "#6b7280", fontWeight: 800, fontSize: 11, textTransform: "uppercase" }}>Amount</th>
                        <th style={{ textAlign: "left", paddingBottom: 12, color: "#6b7280", fontWeight: 800, fontSize: 11, textTransform: "uppercase" }}>Tax</th>
                        <th style={{ textAlign: "left", paddingBottom: 12, color: "#6b7280", fontWeight: 800, fontSize: 11, textTransform: "uppercase" }}>Payment</th>
                        <th style={{ textAlign: "left", paddingBottom: 12, color: "#6b7280", fontWeight: 800, fontSize: 11, textTransform: "uppercase" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentOrders.map(order => (
                        <tr key={order._id} style={{ 
                          borderBottom: "1px solid #f3f4f6", 
                          transition: "all 0.2s",
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f9fafb";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}>
                          <td style={{ padding: "14px 0", fontWeight: 700, color: "#4f46e5", fontSize: 13 }}>
                            #{order.orderId}
                          </td>
                          <td style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>
                            {order.customerName}
                          </td>
                          <td style={{ color: "#111827", fontWeight: 800, fontSize: 15 }}>
                            Rs {order.totalAmount?.toLocaleString()}
                          </td>
                          <td style={{ color: "#6b7280", fontWeight: 600, fontSize: 13 }}>
                            {order.taxAmount ? `Rs ${order.taxAmount.toLocaleString()}` : 'Rs 0'}
                          </td>
                          <td>
                            <span style={{ 
                              background: order.paymentMode === 'Cash' ? '#d1fae5' : '#dbeafe',
                              color: order.paymentMode === 'Cash' ? '#059669' : '#1d4ed8',
                              padding: '6px 12px', 
                              borderRadius: 6, 
                              fontSize: 11, 
                              fontWeight: 700
                            }}>
                              {order.paymentMode}
                            </span>
                          </td>
                          <td>
                            <span style={{ 
                              background: order.status === 'Delivered' ? '#d1fae5' : '#fef3c7',
                              color: order.status === 'Delivered' ? '#059669' : '#d97706',
                              padding: '6px 12px', 
                              borderRadius: 6, 
                              fontSize: 11, 
                              fontWeight: 700
                            }}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* TAX DISPLAY INFO */}
            {dashboardData.todayTax > 0 && (
              <div style={{ 
                background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', 
                borderRadius: 12, 
                padding: '20px 24px',
                border: '1px solid #c7d2fe'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase' }}>
                      Today's Tax Collected
                    </p>
                    <h4 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: '#4f46e5' }}>
                      Rs {dashboardData.todayTax.toLocaleString()}
                    </h4>
                  </div>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 20,
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                  }}>
                    💰
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
