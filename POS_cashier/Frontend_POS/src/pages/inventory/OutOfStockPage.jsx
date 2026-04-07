import { useEffect, useState } from "react";
import { Table, Tag, Spin } from "antd";
import { StopOutlined } from "@ant-design/icons";
import HorizontalNavbar from "../../components/navbar/HorizontalNavbar";

const BASE = process.env.REACT_APP_SERVER_URL;

const OutOfStockPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(BASE + "/api/inventory/out-of-stock")
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const columns = [
    { title: "#", render: (_, __, i) => i + 1, width: 50 },
    { title: "Product", dataIndex: "title" },
    { title: "Category", dataIndex: "category" },
    { title: "Price (Rs)", dataIndex: "price", render: (v) => `Rs ${v.toLocaleString()}` },
    {
      title: "Quantity",
      render: () => <Tag color="red" style={{ fontWeight: 700, fontSize: 13 }}>0 — Out of Stock</Tag>,
    },
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
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#111827', display: 'flex', alignItems: 'center', gap: 12 }}>
            <StopOutlined style={{ color: "#ef4444" }} /> Out of Stock
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>
            Products with zero quantity remaining
          </p>
        </div>

        <div style={{ padding: 40 }}>
          {products.length > 0 && (
            <div style={{ 
              background: "#fef2f2", 
              border: "2px solid #fecaca", 
              borderRadius: 12, 
              padding: "16px 24px", 
              marginBottom: 24, 
              display: "flex", 
              alignItems: "center", 
              gap: 12 
            }}>
              <StopOutlined style={{ color: "#ef4444", fontSize: 20 }} />
              <span style={{ color: "#b91c1c", fontWeight: 700, fontSize: 15 }}>
                {products.length} product{products.length > 1 ? "s" : ""} out of stock — Requires immediate restocking
              </span>
            </div>
          )}
          
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '28px 36px', borderBottom: '1px solid #e5e7eb', background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#111827', letterSpacing: '-0.01em' }}>Out of Stock Products</h3>
              <p style={{ fontSize: 14, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>Products that need immediate attention</p>
            </div>
            
            <div style={{ padding: 36 }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
                  <Spin size="large" />
                </div>
              ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                  <div style={{
                    width: 96,
                    height: 96,
                    margin: '0 auto 24px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(16, 185, 129, 0.15)'
                  }}>
                    <span style={{ fontSize: 42 }}>✓</span>
                  </div>
                  <p style={{ color: '#111827', fontSize: 20, margin: '0 0 8px', fontWeight: 700 }}>All products are in stock</p>
                  <p style={{ color: '#6b7280', fontSize: 15, margin: 0, fontWeight: 500 }}>Great job maintaining inventory levels!</p>
                </div>
              ) : (
                <Table 
                  dataSource={products} 
                  columns={columns} 
                  rowKey="_id" 
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

export default OutOfStockPage;

