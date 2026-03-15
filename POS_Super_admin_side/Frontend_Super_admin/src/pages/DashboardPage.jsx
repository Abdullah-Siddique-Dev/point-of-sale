import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Spin } from "antd";
import { UserOutlined, ShoppingOutlined, AppstoreOutlined, DollarOutlined } from "@ant-design/icons";

const StatCard = ({ title, value, icon, color, bg }) => (
  <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
    <div>
      <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 4px" }}>{title}</p>
      <h2 style={{ fontSize: 28, fontWeight: "bold", margin: 0, color: "#111827" }}>{value}</h2>
    </div>
    <div style={{ width: 52, height: 52, borderRadius: "50%", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
  </div>
);

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    Promise.all([
      fetch(BASE + "/api/products/get-all").then(r => r.json()),
      fetch(BASE + "/api/invoices/get-all").then(r => r.json()),
    ]).then(([p, i]) => { setProducts(p); setInvoices(i); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalRevenue = invoices.reduce((s, i) => s + (i.totalAmount || 0), 0);
  const uniqueCustomers = new Set(invoices.map(i => i.customerPhoneNumber)).size;

  return (
    <div style={{ display: "flex", background: "#f3f4f6", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, width: "calc(100% - 220px)" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: "bold", margin: 0 }}>Dashboard</h1>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>Monitor your business analytics</p>
          </div>
          <span style={{ fontSize: 13, color: "#6b7280" }}>Super Admin</span>
        </div>
        <div style={{ padding: 24 }}>
          {loading ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}><Spin size="large" /></div> : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 24 }}>
                <StatCard title="Total Products" value={products.length} icon={<AppstoreOutlined />} color="#6366f1" bg="#ede9fe" />
                <StatCard title="Total Orders" value={invoices.length} icon={<ShoppingOutlined />} color="#ec4899" bg="#fce7f3" />
                <StatCard title="Total Customers" value={uniqueCustomers} icon={<UserOutlined />} color="#10b981" bg="#d1fae5" />
                <StatCard title="Total Revenue" value={`Rs ${totalRevenue.toLocaleString()}`} icon={<DollarOutlined />} color="#f59e0b" bg="#fef3c7" />
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Recent Orders</h3>
                {invoices.length === 0 ? <p style={{ color: "#9ca3af", textAlign: "center", padding: 32 }}>No orders yet</p> : (
                  <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                    <thead><tr style={{ color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
                      <th style={{ textAlign: "left", paddingBottom: 8 }}>Customer</th>
                      <th style={{ textAlign: "left", paddingBottom: 8 }}>Phone</th>
                      <th style={{ textAlign: "left", paddingBottom: 8 }}>Payment</th>
                      <th style={{ textAlign: "left", paddingBottom: 8 }}>Amount</th>
                      <th style={{ textAlign: "left", paddingBottom: 8 }}>Date</th>
                    </tr></thead>
                    <tbody>{invoices.slice(0, 8).map(inv => (
                      <tr key={inv._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "10px 0" }}>{inv.customerName}</td>
                        <td>{inv.customerPhoneNumber}</td>
                        <td>{inv.paymentMode}</td>
                        <td style={{ color: "#10b981", fontWeight: 600 }}>Rs {inv.totalAmount}</td>
                        <td style={{ color: "#9ca3af" }}>{inv.createdAt?.substring(0, 10)}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
