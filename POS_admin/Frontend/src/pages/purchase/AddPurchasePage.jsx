import Sidebar from "../../components/Sidebar";
import { Input, Button, Select, message, Table, InputNumber } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const AddPurchasePage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  const BASE = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    fetch(BASE + "/api/suppliers/get-all").then(r => r.json()).then(setSuppliers).catch(console.log);
    fetch(BASE + "/api/products/get-all").then(r => r.json()).then(setProducts).catch(console.log);
  }, []);

  const addItem = () => {
    setItems([...items, { productId: "", productName: "", quantity: 1, purchasePrice: 0, total: 0 }]);
  };

  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = value;
    if (field === "productId") {
      const p = products.find(p => p._id === value);
      updated[i].productName = p?.title || "";
    }
    updated[i].total = (updated[i].quantity || 0) * (updated[i].purchasePrice || 0);
    setItems(updated);
  };

  const totalAmount = items.reduce((s, i) => s + i.total, 0);

  const onSubmit = async () => {
    if (!selectedSupplier) { message.error("Please select a supplier!"); return; }
    if (items.length === 0) { message.error("Please add at least one product!"); return; }
    if (items.some(i => !i.productId || i.quantity <= 0 || i.purchasePrice <= 0)) {
      message.error("Please fill all product details!"); return;
    }
    setLoading(true);
    try {
      const sup = suppliers.find(s => s._id === selectedSupplier);
      const res = await fetch(BASE + "/api/purchases/add-purchase", {
        method: "POST",
        body: JSON.stringify({ supplierId: selectedSupplier, supplierName: sup?.name || "", items, totalAmount, notes }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 200) { message.success("Purchase added & stock updated!"); navigate("/purchase/invoices"); }
      else message.error("Failed to add purchase!");
    } catch (e) { message.error("Something went wrong!"); }
    setLoading(false);
  };

  const columns = [
    { title: "Product", key: "product", render: (_, __, i) => (
      <Select style={{ width: 200 }} placeholder="Select Product" value={items[i].productId || undefined}
        onChange={v => updateItem(i, "productId", v)}>
        {products.map(p => <Select.Option key={p._id} value={p._id}>{p.title}</Select.Option>)}
      </Select>
    )},
    { title: "Quantity", key: "qty", render: (_, __, i) => (
      <InputNumber min={1} value={items[i].quantity} onChange={v => updateItem(i, "quantity", v)} style={{ width: 90 }} />
    )},
    { title: "Purchase Price (Rs)", key: "price", render: (_, __, i) => (
      <InputNumber min={0} value={items[i].purchasePrice} onChange={v => updateItem(i, "purchasePrice", v)} style={{ width: 130 }} />
    )},
    { title: "Total", key: "total", render: (_, __, i) => `Rs ${items[i].total}` },
    { title: "", key: "del", render: (_, __, i) => (
      <Button danger icon={<DeleteOutlined />} onClick={() => removeItem(i)} />
    )},
  ];

  return (
    <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>
        <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "24px 40px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: "#111827" }}>Add New Purchase</h1>
          <p style={{ fontSize: 15, color: "#6b7280", margin: "6px 0 0", fontWeight: 500 }}>Create a new purchase order</p>
        </div>
        <div style={{ padding: 40 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: 32 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                <div>
                  <label style={{ fontWeight: 600, display: "block", marginBottom: 8, color: "#374151", fontSize: 15 }}>Supplier *</label>
                  <Select style={{ width: "100%" }} size="large" placeholder="Select Supplier"
                    onChange={v => setSelectedSupplier(v)} value={selectedSupplier || undefined}>
                    {suppliers.map(s => <Select.Option key={s._id} value={s._id}>{s.name} {s.company ? `(${s.company})` : ""}</Select.Option>)}
                  </Select>
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: "block", marginBottom: 8, color: "#374151", fontSize: 15 }}>Notes</label>
                  <Input size="large" placeholder="Enter short notes" value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontWeight: 700, margin: 0, fontSize: 18, color: "#111827" }}>Products</h3>
                  <Button type="primary" icon={<PlusOutlined />} onClick={addItem} size="large"
                    style={{ background: "#4f46e5", borderColor: "#4f46e5", fontWeight: 600 }}>Add Product</Button>
                </div>
                <Table dataSource={items} columns={columns} rowKey={(_, i) => i} pagination={false}
                  locale={{ emptyText: "Click 'Add Product' to add items" }} />
              </div>

              <div style={{ textAlign: "right", fontSize: 20, fontWeight: 700, marginBottom: 24, color: "#10b981", padding: "16px 20px", background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0" }}>
                Total: Rs {totalAmount.toLocaleString()}
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <Button size="large" onClick={() => navigate("/purchase/invoices")} style={{ fontWeight: 600 }}>Cancel</Button>
                <Button type="primary" size="large" loading={loading} onClick={onSubmit}
                  style={{ background: "#4f46e5", borderColor: "#4f46e5", fontWeight: 600 }}>Submit Purchase</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPurchasePage;
