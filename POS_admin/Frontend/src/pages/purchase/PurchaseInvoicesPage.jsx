import Sidebar from "../../components/Sidebar";
import { Table, Button, Popconfirm, message, Spin, Modal, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PurchaseInvoicesPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewItem, setViewItem] = useState(null);
  const navigate = useNavigate();
  const BASE = process.env.REACT_APP_SERVER_URL;

  const fetchPurchases = () => {
    setLoading(true);
    fetch(BASE + "/api/purchases/get-all")
      .then(r => r.json())
      .then(data => { setPurchases(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchPurchases(); }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(BASE + "/api/purchases/delete-purchase", {
        method: "DELETE",
        body: JSON.stringify({ purchaseId: id }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 200) { message.success("Purchase deleted!"); fetchPurchases(); }
      else message.error("Delete failed!");
    } catch (e) { message.error("Something went wrong!"); }
  };

  const columns = [
    { title: "SL", key: "i", render: (_, __, i) => i + 1, width: 60 },
    { title: "Supplier", dataIndex: "supplierName", key: "supplierName" },
    { title: "Products", key: "items", render: (_, r) => r.items?.length || 0 },
    { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount", render: t => `Rs ${t?.toLocaleString()}` },
    { title: "Status", dataIndex: "status", key: "status", render: s => <Tag color="#10b981">{s}</Tag> },
    { title: "Date", dataIndex: "createdAt", key: "createdAt", render: t => t?.substring(0, 10) },
    {
      title: "Action", key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button size="small" type="primary" onClick={() => setViewItem(record)}>View</Button>
          <Popconfirm title="Delete this purchase?" okText="Yes" cancelText="No" onConfirm={() => handleDelete(record._id)}>
            <Button size="small" danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>
        <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "24px 40px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: "#111827" }}>Purchase Invoices</h1>
            <p style={{ fontSize: 15, color: "#6b7280", margin: "6px 0 0", fontWeight: 500 }}>All purchase transactions</p>
          </div>
          <Button type="primary" size="large" onClick={() => navigate("/purchase/add")}
            style={{ background: "#4f46e5", borderColor: "#4f46e5", fontWeight: 600 }}>+ Create New</Button>
        </div>
        <div style={{ padding: 40 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: 32 }}>
              {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spin size="large" /></div>
                : <Table dataSource={purchases} columns={columns} rowKey="_id" pagination={{ pageSize: 10 }} />}
            </div>
          </div>
        </div>
      </div>

      <Modal title="Purchase Details" open={!!viewItem} onCancel={() => setViewItem(null)}
        footer={<Button onClick={() => setViewItem(null)}>Close</Button>} width={600}>
        {viewItem && (
          <div style={{ fontSize: 14 }}>
            <p><strong>Supplier:</strong> {viewItem.supplierName}</p>
            <p><strong>Date:</strong> {viewItem.createdAt?.substring(0, 10)}</p>
            <p><strong>Status:</strong> {viewItem.status}</p>
            {viewItem.notes && <p><strong>Notes:</strong> {viewItem.notes}</p>}
            <hr />
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ borderBottom: "1px solid #e5e7eb", color: "#6b7280" }}>
                <th style={{ textAlign: "left", paddingBottom: 8 }}>Product</th>
                <th style={{ textAlign: "right", paddingBottom: 8 }}>Qty</th>
                <th style={{ textAlign: "right", paddingBottom: 8 }}>Price</th>
                <th style={{ textAlign: "right", paddingBottom: 8 }}>Total</th>
              </tr></thead>
              <tbody>
                {viewItem.items?.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "8px 0" }}>{item.productName}</td>
                    <td style={{ textAlign: "right" }}>{item.quantity}</td>
                    <td style={{ textAlign: "right" }}>Rs {item.purchasePrice}</td>
                    <td style={{ textAlign: "right" }}>Rs {item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr />
            <p style={{ textAlign: "right", fontWeight: "bold", fontSize: 16 }}>Total: Rs {viewItem.totalAmount?.toLocaleString()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PurchaseInvoicesPage;
