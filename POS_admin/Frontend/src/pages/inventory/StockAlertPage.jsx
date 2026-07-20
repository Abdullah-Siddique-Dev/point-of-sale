import { useEffect, useState } from "react";
import { Table, Spin, Empty, Progress } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import Sidebar from "../../components/Sidebar";

const BASE = process.env.REACT_APP_SERVER_URL;

const StockAlertPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(BASE + "/api/inventory/alerts")
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const columns = [
    { title: "#", render: (_, __, i) => i + 1, width: 50 },
    { title: "Product", dataIndex: "title", sorter: (a, b) => a.title.localeCompare(b.title) },
    { title: "Category", dataIndex: "category" },
    { title: "Price (Rs)", dataIndex: "price", render: (v) => `Rs ${v.toLocaleString()}` },
    {
      title: "Quantity Remaining",
      dataIndex: "stock",
      sorter: (a, b) => a.stock - b.stock,
      render: (v) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#dc2626", fontWeight: 700, fontSize: 16, minWidth: 24 }}>{v}</span>
          <Progress percent={Math.round((v / 10) * 100)} size="small" strokeColor="#dc2626"
            trailColor="#fee2e2" style={{ width: 100, margin: 0 }} showInfo={false} />
          <span style={{ color: "#dc2626", fontSize: 12 }}>Critical</span>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>
        <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "24px 40px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: "#111827", display: "flex", alignItems: "center", gap: 12 }}>
            <WarningOutlined style={{ color: "#f59e0b" }} /> Stock Alert
          </h1>
          <p style={{ fontSize: 15, color: "#6b7280", margin: "6px 0 0", fontWeight: 500 }}>Products with less than 10 units remaining</p>
        </div>
        <div style={{ padding: 40 }}>
          {products.length > 0 && (
            <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 12, padding: "16px 24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
              <WarningOutlined style={{ color: "#d97706", fontSize: 20 }} />
              <span style={{ color: "#92400e", fontWeight: 600, fontSize: 15 }}>
                {products.length} product{products.length > 1 ? "s are" : " is"} critically low — restock soon to avoid stockout
              </span>
            </div>
          )}
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: 32 }}>
              {loading ? <div style={{ textAlign: "center", padding: 60 }}><Spin size="large" /></div> : (
                products.length === 0
                  ? <Empty description="No critical stock alerts — all products are well stocked" style={{ padding: 60 }} />
                  : <Table dataSource={products} columns={columns} rowKey="_id"
                      pagination={{ pageSize: 15 }}
                    />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAlertPage;
