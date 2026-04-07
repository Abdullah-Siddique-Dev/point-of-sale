import { useEffect, useState } from "react";
import { Table, Tag, Input, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Sidebar from "../../components/Sidebar";

const BASE = process.env.REACT_APP_SERVER_URL;

const TotalStockPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(BASE + "/api/inventory/total-stock")
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (stock) => {
    if (stock === 0) return <Tag color="#ef4444">Out of Stock</Tag>;
    if (stock < 10) return <Tag color="#f59e0b">Low Stock</Tag>;
    return <Tag color="#10b981">In Stock</Tag>;
  };

  const columns = [
    { title: "#", render: (_, __, i) => i + 1, width: 50 },
    { title: "Product", dataIndex: "title", sorter: (a, b) => a.title.localeCompare(b.title) },
    { title: "Category", dataIndex: "category" },
    { title: "Price (Rs)", dataIndex: "price", render: (v) => `Rs ${v.toLocaleString()}`, sorter: (a, b) => a.price - b.price },
    { title: "Quantity", dataIndex: "stock", sorter: (a, b) => a.stock - b.stock, render: (v) => <span style={{ fontWeight: 600 }}>{v}</span> },
    { title: "Status", dataIndex: "stock", render: (v) => getStatus(v) },
  ];

  return (
    <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>
        <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "24px 40px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: "#111827" }}>Total Stock</h1>
          <p style={{ fontSize: 15, color: "#6b7280", margin: "6px 0 0", fontWeight: 500 }}>All products and their current stock levels</p>
        </div>
        <div style={{ padding: 40 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: "24px 32px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
              <Input prefix={<SearchOutlined />} placeholder="Search by product or category..." value={search}
                onChange={(e) => setSearch(e.target.value)} size="large" style={{ width: 400 }} />
            </div>
            <div style={{ padding: 32 }}>
              {loading ? <div style={{ textAlign: "center", padding: 60 }}><Spin size="large" /></div> : (
                <Table dataSource={filtered} columns={columns} rowKey="_id"
                  pagination={{ pageSize: 15, showSizeChanger: true }}
                  summary={() => (
                    <Table.Summary.Row style={{ background: "#f9fafb", fontWeight: 600 }}>
                      <Table.Summary.Cell colSpan={4}><strong>Total SKUs: {filtered.length}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <strong style={{ color: "#4f46e5" }}>{filtered.reduce((s, p) => s + p.stock, 0)}</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell />
                    </Table.Summary.Row>
                  )}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalStockPage;
