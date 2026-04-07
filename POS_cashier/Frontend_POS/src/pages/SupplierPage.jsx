import HorizontalNavbar from "../components/navbar/HorizontalNavbar";
import { Table, Spin, Tag } from "antd";
import { useEffect, useState } from "react";

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(process.env.REACT_APP_SERVER_URL + "/api/suppliers/get-all")
      .then((r) => r.json())
      .then((data) => { setSuppliers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const columns = [
    { title: "SL", key: "i", render: (_, __, i) => i + 1, width: 60 },
    {
      title: "Photo", dataIndex: "img", key: "img", width: 80,
      render: (img) => img
        ? <img src={img} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
        : <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👤</div>
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Company", dataIndex: "company", key: "company" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Status", dataIndex: "status", key: "status", render: (s) => <Tag color={s ? "green" : "red"}>{s ? "Active" : "Inactive"}</Tag> },
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
            Suppliers
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>
            Manage your supplier information
          </p>
        </div>

        <div style={{ padding: 40 }}>
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '28px 36px', borderBottom: '1px solid #e5e7eb', background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#111827', letterSpacing: '-0.01em' }}>List of Suppliers</h3>
              <p style={{ fontSize: 14, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>Total suppliers: {suppliers.length}</p>
            </div>
            
            <div style={{ padding: 36 }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
                  <Spin size="large" />
                </div>
              ) : (
                <Table 
                  dataSource={suppliers} 
                  columns={columns} 
                  rowKey="_id" 
                  pagination={{ pageSize: 10 }} 
                  scroll={{ x: 700 }} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierPage;

