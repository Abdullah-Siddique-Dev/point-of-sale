import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { UserOutlined, ShoppingOutlined, AppstoreOutlined, DollarOutlined } from "@ant-design/icons";

const StatCard = ({ title, value, icon, color, bg }) => (
  <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
    <div>
      <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 4px" }}>{title}</p>
      <h2 style={{ fontSize: 26, fontWeight: "bold", margin: 0, color: "#111827" }}>{value}</h2>
    </div>
    <div style={{ width: 50, height: 50, borderRadius: "50%", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
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
  }, []);

  const totalRevenue = invoices ? invoices.reduce((s, i) => s + (i.totalAmount || 0), 0) : 0;
  const uniqueCustomers = invoices ? new Set(invoices.map((i) => i.customerPhoneNumber)).size : 0;

  // Group revenue by date
  const revenueByDate = invoices
    ? invoices.reduce((acc, inv) => {
        const date = inv.createdAt?.substring(0, 10) || "Unknown";
        acc[date] = (acc[date] || 0) + (inv.totalAmount || 0);
        return acc;
      }, {})
    : {};

  // Top customers by spend
  const customerSpend = invoices
    ? invoices.reduce((acc, inv) => {
        const key = inv.customerName || "Unknown";
        acc[key] = (acc[key] || 0) + (inv.totalAmount || 0);
        return acc;
      }, {})
    : {};
  const topCustomers = Object.entries(customerSpend).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div style={{ display: "flex", background: "#f3f4f6", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, width: "calc(100% - 220px)" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 24px", position: "sticky", top: 0, zIndex: 10 }}>
          <h1 style={{ fontSize: 20, fontWeight: "bold", margin: 0 }}>Statistics</h1>
        </div>
        <div style={{ padding: 24 }}>
          {!invoices ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}><Spin size="large" /></div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 24 }}>
                <StatCard title="Total Products" value={products.length} icon={<AppstoreOutlined />} color="#6366f1" bg="#ede9fe" />
                <StatCard title="Total Orders" value={invoices.length} icon={<ShoppingOutlined />} color="#ec4899" bg="#fce7f3" />
                <StatCard title="Total Customers" value={uniqueCustomers} icon={<UserOutlined />} color="#10b981" bg="#d1fae5" />
                <StatCard title="Total Revenue" value={`Rs ${totalRevenue.toLocaleString()}`} icon={<DollarOutlined />} color="#f59e0b" bg="#fef3c7" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Revenue by Date</h3>
                  {Object.keys(revenueByDate).length === 0 ? <p style={{ color: "#9ca3af" }}>No data</p> : (
                    <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                      <thead><tr style={{ color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
                        <th style={{ textAlign: "left", paddingBottom: 8 }}>Date</th>
                        <th style={{ textAlign: "right", paddingBottom: 8 }}>Revenue</th>
                      </tr></thead>
                      <tbody>
                        {Object.entries(revenueByDate).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 10).map(([date, amt]) => (
                          <tr key={date} style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <td style={{ padding: "8px 0" }}>{date}</td>
                            <td style={{ textAlign: "right", color: "#10b981", fontWeight: 600 }}>Rs {amt.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Top Customers</h3>
                  {topCustomers.length === 0 ? <p style={{ color: "#9ca3af" }}>No data</p> : (
                    <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                      <thead><tr style={{ color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
                        <th style={{ textAlign: "left", paddingBottom: 8 }}>Customer</th>
                        <th style={{ textAlign: "right", paddingBottom: 8 }}>Total Spent</th>
                      </tr></thead>
                      <tbody>
                        {topCustomers.map(([name, amt], i) => (
                          <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <td style={{ padding: "8px 0" }}>{name}</td>
                            <td style={{ textAlign: "right", color: "#ec4899", fontWeight: 600 }}>Rs {amt.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
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
