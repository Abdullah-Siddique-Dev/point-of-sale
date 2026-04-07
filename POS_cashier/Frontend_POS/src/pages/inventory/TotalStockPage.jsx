import { useEffect, useState } from "react";
import { Table, Tag, Input, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import HorizontalNavbar from "../../components/navbar/HorizontalNavbar";

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
    if (stock === 0) return <Tag color="red">Out of Stock</Tag>;
    if (stock < 10) return <Tag color="orange">Low Stock</Tag>;
    return <Tag color="green">In Stock</Tag>;
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
    <div style={{ display: "flex", flexDirection: "column", background: "#f5f5f7", minHeight: "100vh" }}>
      <HorizontalNavbar />
      <div style={{ marginTop: 100, width: "100%" }}>
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
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#111827' }}>
            Total Stock
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>
            All products and their current stock levels
          </p>
        </div>

        <div style={{ padding: 40 }}>
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '28px 36px', borderBottom: '1px solid #e5e7eb', background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#111827', letterSpacing: '-0.01em' }}>Inventory Overview</h3>
                  <p style={{ fontSize: 14, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>
                    Total SKUs: <strong>{filtered.length}</strong> &nbsp;|&nbsp; Total Units: <strong>{filtered.reduce((s, p) => s + p.stock, 0)}</strong>
                  </p>
                </div>
                <Input 
                  prefix={<SearchOutlined />} 
                  placeholder="Search product or category..."
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  style={{ width: 300 }}
                  size="large"
                />
              </div>
            </div>
            
            <div style={{ padding: 36 }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
                  <Spin size="large" />
                </div>
              ) : (
                <Table 
                  dataSource={filtered} 
                  columns={columns} 
                  rowKey="_id"
                  pagination={{ pageSize: 15, showSizeChanger: true }} 
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

