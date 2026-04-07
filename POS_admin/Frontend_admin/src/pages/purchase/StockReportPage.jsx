import Sidebar from "../../components/Sidebar";
import { Table, Spin, Tag } from "antd";
import { useEffect, useState } from "react";

const StockReportPage = () => {
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    Promise.all([
      fetch(BASE + "/api/products/get-all").then(r => r.json()),
      fetch(BASE + "/api/purchases/get-all").then(r => r.json()),
      fetch(BASE + "/api/invoices/get-all").then(r => r.json()),
    ]).then(([p, pur, inv]) => {
      setProducts(p); setPurchases(pur); setInvoices(inv); setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Calculate purchased qty per product
  const getPurchased = (productId) => {
    let total = 0;
    purchases.forEach(p => {
      p.items?.forEach(item => {
        if (item.productId === productId) total += item.quantity;
      });
    });
    return total;
  };

  // Calculate sold qty per product from invoices
  const getSold = (productTitle) => {
    let total = 0;
    invoices.forEach(inv => {
      inv.cartItems?.forEach(item => {
        if (item.title === productTitle) total += (item.quantity || 1);
      });
    });
    return total;
  };

  const data = products.map(p => {
    const purchased = getPurchased(p._id);
    const sold = getSold(p.title);
    const available = (p.stock || 0);
    return { ...p, purchased, sold, available };
  });

  const columns = [
    { title: "SL", key: "i", render: (_, __, i) => i + 1, width: 60 },
    { title: "Product Name", dataIndex: "title", key: "title" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Purchased (In)", dataIndex: "purchased", key: "purchased", render: v => <span style={{ color: "#10b981", fontWeight: 600 }}>{v}</span> },
    { title: "Sold (Out)", dataIndex: "sold", key: "sold", render: v => <span style={{ color: "#ef4444", fontWeight: 600 }}>{v}</span> },
    {
      title: "Available Stock", dataIndex: "available", key: "available",
      render: v => <Tag color={v > 0 ? "#10b981" : v === 0 ? "#f59e0b" : "#ef4444"}>{v}</Tag>
    },
  ];

  return (
    <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>
        <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "24px 40px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: "#111827" }}>Stock Report</h1>
          <p style={{ fontSize: 15, color: "#6b7280", margin: "6px 0 0", fontWeight: 500 }}>Comprehensive stock movement analysis</p>
        </div>
        <div style={{ padding: 40 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: "24px 32px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#111827" }}>All Products — Stock Details</h3>
            </div>
            <div style={{ padding: 32 }}>
              {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spin size="large" /></div>
                : <Table dataSource={data} columns={columns} rowKey="_id" pagination={{ pageSize: 15 }} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockReportPage;
