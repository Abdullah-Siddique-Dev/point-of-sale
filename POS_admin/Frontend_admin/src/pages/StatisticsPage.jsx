import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { UserOutlined, ShoppingOutlined, AppstoreOutlined, DollarOutlined } from "@ant-design/icons";

const StatCard = ({ title, value, icon, color, bg }) => (
  <div style={{
    background: "white",
    borderRadius: 12,
    padding: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    border: "1px solid #e5e7eb",
    transition: "all 0.3s",
    cursor: "pointer"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
  }}>
    <div>
      <p style={{ color: "#6b7280", fontSize: 12, margin: "0 0 8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</p>
      <h2 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: "#111827" }}>{value}</h2>
    </div>
    <div style={{
      width: 56,
      height: 56,
      borderRadius: 12,
      background: bg,
      color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 24,
      boxShadow: `0 4px 12px ${bg}80`
    }}>{icon}</div>
  </div>
);

const StatisticsPage = () => {
  const [invoices, setInvoices] = useState(null);
  const [products, setProducts] = useState([]);
  const BASE = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    Promise.all([
      fetch(BASE + "/api/invoices/get-all").then((r) => r.json()),
      fetch(BASE + "/api/products/get-all").then((r) => r.json()),
    ]).then(([inv, prod]) => { setInvoices(inv); setProducts(prod); })
      .catch(console.log);
  }, [BASE]);

  const totalRevenue = invoices ? invoices.reduce((s, i) => s + (i.totalAmount || 0), 0) : 0;
  const uniqueCustomers = invoices ? new Set(invoices.map((i) => i.customerPhoneNumber)).size : 0;

  const revenueByDate = invoices
    ? invoices.reduce((acc, inv) => {
        const date = inv.createdAt?.substring(0, 10) || "Unknown";
        acc[date] = (acc[date] || 0) + (inv.totalAmount || 0);
        return acc;
      }, {})
    : {};

  const customerSpend = invoices
    ? invoices.reduce((acc, inv) => {
        const key = inv.customerName || "Unknown";
        acc[key] = (acc[key] || 0) + (inv.totalAmount || 0);
        return acc;
      }, {})
    : {};
  const topCustomers = Object.entries(customerSpend).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '24px 40px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#111827' }}>Statistics</h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>
            Business analytics and performance metrics
          </p>
        </div>

        <div style={{ padding: 40 }}>
          {!invoices ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
              <Spin size="large" />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 28 }}>
                <StatCard title="Total Products" value={products.length} icon={<AppstoreOutlined />} color="#4f46e5" bg="#eef2ff" />
                <StatCard title="Total Orders" value={invoices.length} icon={<ShoppingOutlined />} color="#10b981" bg="#d1fae5" />
                <StatCard title="Total Customers" value={uniqueCustomers} icon={<UserOutlined />} color="#06b6d4" bg="#cffafe" />
                <StatCard title="Total Revenue" value={`Rs ${totalRevenue.toLocaleString()}`} icon={<DollarOutlined />} color="#10b981" bg="#d1fae5" />
              </div>

              {/* Data Tables */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Revenue by Date */}
                <div style={{
                  background: "white",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  overflow: "hidden",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}>
                  <div style={{ padding: "24px 32px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#111827" }}>Revenue by Date</h3>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>Daily revenue breakdown</p>
                  </div>
                  <div style={{ padding: 32 }}>
                    {Object.keys(revenueByDate).length === 0 ? (
                      <p style={{ color: "#9ca3af", textAlign: "center", padding: 20 }}>No data available</p>
                    ) : (
                      <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                            <th style={{ textAlign: "left", paddingBottom: 12, color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Date</th>
                            <th style={{ textAlign: "right", paddingBottom: 12, color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(revenueByDate).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 10).map(([date, amt]) => (
                            <tr key={date} style={{ borderBottom: "1px solid #f3f4f6" }}>
                              <td style={{ padding: "12px 0", color: "#111827" }}>{date}</td>
                              <td style={{ textAlign: "right", color: "#10b981", fontWeight: 700 }}>Rs {amt.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Top Customers */}
                <div style={{
                  background: "white",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  overflow: "hidden",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}>
                  <div style={{ padding: "24px 32px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#111827" }}>Top Customers</h3>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>Highest spending customers</p>
                  </div>
                  <div style={{ padding: 32 }}>
                    {topCustomers.length === 0 ? (
                      <p style={{ color: "#9ca3af", textAlign: "center", padding: 20 }}>No data available</p>
                    ) : (
                      <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                            <th style={{ textAlign: "left", paddingBottom: 12, color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Customer</th>
                            <th style={{ textAlign: "right", paddingBottom: 12, color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Total Spent</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topCustomers.map(([name, amt], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                              <td style={{ padding: "12px 0", color: "#111827", fontWeight: 600 }}>{name}</td>
                              <td style={{ textAlign: "right", color: "#4f46e5", fontWeight: 700 }}>Rs {amt.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
