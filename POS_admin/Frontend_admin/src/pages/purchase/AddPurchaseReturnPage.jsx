import Sidebar from "../../components/Sidebar";
import { Button, Select, message, Table, InputNumber, Input } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const AddPurchaseReturnPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [items, setItems] = useState([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BASE = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    fetch(BASE + "/api/purchases/get-all").then(r => r.json()).then(setPurchases).catch(console.log);
  }, []);

  const onSelectPurchase = (purchaseId) => {
    const p = purchases.find(p => p._id === purchaseId);
    setSelectedPurchase(p);
    // Pre-fill items from the purchase
    setItems(p?.items?.map(item => ({ ...item, returnQty: 1, returnTotal: item.purchasePrice })) || []);
  };

  const updateQty = (i, qty) => {
    const updated = [...items];
    updated[i].returnQty = qty;
    updated[i].returnTotal = qty * updated[i].purchasePrice;
    setItems(updated);
  };

  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

  const totalAmount = items.reduce((s, i) => s + i.returnTotal, 0);

  const onSubmit = async () => {
    if (!selectedPurchase) { message.error("Please select a purchase!"); return; }
    if (items.length === 0) { message.error("No items to return!"); return; }
    setLoading(true);
    try {
      const returnItems = items.map(i => ({
        productId: i.productId,
        productName: i.productName,
        quantity: i.returnQty,
        purchasePrice: i.purchasePrice,
        total: i.returnTotal,
      }));
      const res = await fetch(BASE + "/api/purchases/returns/add", {
        method: "POST",
        body: JSON.stringify({
          purchaseId: selectedPurchase._id,
          supplierId: selectedPurchase.supplierId,
          supplierName: selectedPurchase.supplierName,
          items: returnItems,
          totalAmount,
          reason,
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 200) { message.success("Return created & stock updated!"); navigate("/purchase/returns"); }
      else message.error("Failed to create return!");
    } catch (e) { message.error("Something went wrong!"); }
    setLoading(false);
  };

  const columns = [
    { title: "Product", dataIndex: "productName", key: "productName" },
    { title: "Original Qty", dataIndex: "quantity", key: "quantity" },
    { title: "Return Qty", key: "returnQty", render: (_, __, i) => (
      <InputNumber min={1} max={items[i].quantity} value={items[i].returnQty}
        onChange={v => updateQty(i, v)} style={{ width: 90 }} />
    )},
    { title: "Price", dataIndex: "purchasePrice", key: "purchasePrice", render: v => `Rs ${v}` },
    { title: "Return Total", key: "returnTotal", render: (_, __, i) => `Rs ${items[i].returnTotal}` },
    { title: "", key: "del", render: (_, __, i) => <Button danger icon={<DeleteOutlined />} onClick={() => removeItem(i)} /> },
  ];

  return (
    <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>
        <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "24px 40px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: "#111827" }}>Add Purchase Return</h1>
          <p style={{ fontSize: 15, color: "#6b7280", margin: "6px 0 0", fontWeight: 500 }}>Process returned purchase items</p>
        </div>
        <div style={{ padding: 40 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: 32 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                <div>
                  <label style={{ fontWeight: 600, display: "block", marginBottom: 8, color: "#374151", fontSize: 15 }}>Select Purchase Invoice *</label>
                  <Select style={{ width: "100%" }} size="large" placeholder="Select Purchase"
                    onChange={onSelectPurchase}>
                    {purchases.map(p => (
                      <Select.Option key={p._id} value={p._id}>
                        PUR-{p._id?.slice(-6).toUpperCase()} — {p.supplierName} — Rs {p.totalAmount}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: "block", marginBottom: 8, color: "#374151", fontSize: 15 }}>Reason</label>
                  <Input size="large" placeholder="Reason for return" value={reason} onChange={e => setReason(e.target.value)} />
                </div>
              </div>

              {selectedPurchase && (
                <>
                  <div style={{ background: "#f9fafb", borderRadius: 8, padding: "12px 20px", marginBottom: 20, fontSize: 14, border: "1px solid #e5e7eb" }}>
                    <strong>Supplier:</strong> {selectedPurchase.supplierName} &nbsp;|&nbsp;
                    <strong>Date:</strong> {selectedPurchase.createdAt?.substring(0, 10)}
                  </div>
                  <Table dataSource={items} columns={columns} rowKey={(_, i) => i} pagination={false} />
                  <div style={{ textAlign: "right", fontSize: 20, fontWeight: 700, marginTop: 20, color: "#ef4444", padding: "16px 20px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca" }}>
                    Return Total: Rs {totalAmount.toLocaleString()}
                  </div>
                </>
              )}

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
                <Button size="large" onClick={() => navigate("/purchase/returns")} style={{ fontWeight: 600 }}>Cancel</Button>
                <Button type="primary" size="large" loading={loading} onClick={onSubmit}
                  style={{ background: "#4f46e5", borderColor: "#4f46e5", fontWeight: 600 }}>Submit Return</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPurchaseReturnPage;
