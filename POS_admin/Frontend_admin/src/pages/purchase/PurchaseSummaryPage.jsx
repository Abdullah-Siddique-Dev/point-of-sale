import Sidebar from "../../components/Sidebar";
import { Table, Spin, Select } from "antd";
import { useEffect, useState } from "react";

const PurchaseSummaryPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterProduct, setFilterProduct] = useState(null);
  const [filterSupplier, setFilterSupplier] = useState(null);
  const BASE = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    Promise.all([
      fetch(BASE + "/api/purchases/get-all").then(r => r.json()),
      fetch(BASE + "/api/products/get-all").then(r => r.json()),
      fetch(BASE + "/api/suppliers/get-all").then(r => r.json()),
    ]).then(([pur, prod, sup]) => {
      setPurchases(pur); setProducts(prod); setSuppliers(sup); setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Flatten purchases into rows
  const rows = [];
  purchases.forEach(p => {
    p.items?.forEach(item => {
      rows.push({
        _id: p._id + item.productId,
        purchaseName: `PUR-${p._id?.slice(-6).toUpperCase()}`,
        supplierName: p.supplierName,
        supplierId: p.supplierId,
        productName: item.productName,
        productId: item.productId,
        quantity: item.quantity,
        purchasePrice: item.purchasePrice,
        total: item.total,
        date: p.createdAt?.substring(0, 10),
      });
    });
  });

  const filtered = rows.filter(r => {
    if (filterProduct && r.productId !== filterProduct) return false;
    if (filterSupplier && r.supplierId !== filterSupplier) return false;
    return true;
  });

  const grandTotal = filtered.reduce((s, r) => s + r.total, 0);
  const totalStock = filtered.reduce((s, r) => s + r.quantity, 0);

  const columns = [
    { title: "SN", key: "i", render: (_, __, i) => i + 1, width: 60 },
    { title: "Purchase Name", dataIndex: "purchaseName", key: "purchaseName" },
    { title: "Supplier", dataIndex: "supplierName", key: "supplierName" },
    { title: "Products", dataIndex: "productName", key: "productName" },
    { title: "Price", dataIndex: "purchasePrice", key: "purchasePrice", render: v => `Rs ${v}` },
    { title: "Total Stock Add", dataIndex: "quantity", key: "quantity" },
    { title: "Total", dataIndex: "total", key: "total", render: v => `Rs ${v}` },
    { title: "Date", dataIndex: "date", key: "date" },
  ];

  return (
    <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>
        <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "24px 40px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: "#111827" }}>Purchase Summary</h1>
          <p style={{ fontSize: 15, color: "#6b7280", margin: "6px 0 0", fontWeight: 500 }}>Detailed purchase transaction analysis</p>
        </div>
        <div style={{ padding: 40 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: "24px 32px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Select allowClear placeholder="Choose Product" size="large" style={{ width: 240 }} onChange={setFilterProduct}>
                  {products.map(p => <Select.Option key={p._id} value={p._id}>{p.title}</Select.Option>)}
                </Select>
                <Select allowClear placeholder="Choose Supplier" size="large" style={{ width: 240 }} onChange={setFilterSupplier}>
                  {suppliers.map(s => <Select.Option key={s._id} value={s._id}>{s.name}</Select.Option>)}
                </Select>
              </div>
            </div>
            <div style={{ padding: 32 }}>
              {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spin size="large" /></div> : (
                <>
                  <Table dataSource={filtered} columns={columns} rowKey="_id" pagination={{ pageSize: 10 }}
                    summary={() => (
                      <Table.Summary.Row style={{ fontWeight: 700, background: "#f9fafb" }}>
                        <Table.Summary.Cell colSpan={5} index={0}><strong>Total</strong></Table.Summary.Cell>
                        <Table.Summary.Cell index={5}><strong style={{ color: "#4f46e5" }}>{totalStock}</strong></Table.Summary.Cell>
                        <Table.Summary.Cell index={6}><strong style={{ color: "#10b981" }}>Rs {grandTotal.toLocaleString()}</strong></Table.Summary.Cell>
                        <Table.Summary.Cell index={7} />
                      </Table.Summary.Row>
                    )}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSummaryPage;
