import Sidebar from "../../components/Sidebar";
import { Table, Button, Popconfirm, message, Spin, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PurchaseReturnsPage = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const BASE = process.env.REACT_APP_SERVER_URL;

  const fetchReturns = () => {
    setLoading(true);
    fetch(BASE + "/api/purchases/returns/get-all")
      .then(r => r.json())
      .then(data => { setReturns(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchReturns(); }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(BASE + "/api/purchases/returns/delete", {
        method: "DELETE",
        body: JSON.stringify({ returnId: id }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 200) { message.success("Return deleted!"); fetchReturns(); }
      else message.error("Delete failed!");
    } catch (e) { message.error("Something went wrong!"); }
  };

  const columns = [
    { title: "SL", key: "i", render: (_, __, i) => i + 1, width: 60 },
    { title: "Supplier", dataIndex: "supplierName", key: "supplierName" },
    { title: "Purchase Ref", dataIndex: "purchaseId", key: "purchaseId", render: v => `PUR-${v?.slice(-6).toUpperCase()}` },
    { title: "Total Products", key: "items", render: (_, r) => r.items?.length || 0 },
    { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount", render: v => `Rs ${v?.toLocaleString()}` },
    { title: "Status", dataIndex: "status", key: "status", render: s => <Tag color="#06b6d4">{s}</Tag> },
    { title: "Date", dataIndex: "createdAt", key: "createdAt", render: t => t?.substring(0, 10) },
    {
      title: "Action", key: "action",
      render: (_, record) => (
        <Popconfirm title="Delete this return?" okText="Yes" cancelText="No" onConfirm={() => handleDelete(record._id)}>
          <Button size="small" danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>
        <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "24px 40px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: "#111827" }}>Purchase Returns</h1>
            <p style={{ fontSize: 15, color: "#6b7280", margin: "6px 0 0", fontWeight: 500 }}>Manage returned purchase items</p>
          </div>
          <Button type="primary" size="large" onClick={() => navigate("/purchase/returns/add")}
            style={{ background: "#4f46e5", borderColor: "#4f46e5", fontWeight: 600 }}>+ Create Return</Button>
        </div>
        <div style={{ padding: 40 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: 32 }}>
              {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spin size="large" /></div>
                : <Table dataSource={returns} columns={columns} rowKey="_id" pagination={{ pageSize: 10 }} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseReturnsPage;
