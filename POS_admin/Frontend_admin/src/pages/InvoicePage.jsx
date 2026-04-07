import Sidebar from "../components/Sidebar";
import { Table, Button, Input, Space, Spin, Tag, Modal, Popconfirm, message, Select, DatePicker } from "antd";
import { useEffect, useState, useRef } from "react";
import { SearchOutlined, PrinterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

// ── Printable receipt ──────────────────────────────────────────────────────────
const InvoicePrint = ({ data }) => {
  if (!data) return null;

  const handlePrint = () => {
    const printContents = document.getElementById("invoice-print-area").innerHTML;
    const win = window.open("", "_blank", "width=700,height=900");
    win.document.write(`
      <html><head><title>Invoice - ${data.orderId}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 13px; padding: 30px; color: #111; }
        h2 { font-size: 20px; font-weight: bold; margin: 0; }
        hr { border: none; border-top: 1px solid #e5e7eb; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; }
        th { font-size: 12px; color: #374151; padding: 6px 0; border-bottom: 2px solid #e5e7eb; }
        td { padding: 5px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
        .right { text-align: right; }
        .center { text-align: center; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 10px 0; }
        .totals { text-align: right; margin-top: 8px; line-height: 1.9; }
        .grand { font-weight: bold; font-size: 15px; }
        .vat { color: #ef4444; }
        .thanks { text-align: center; margin-top: 20px; color: #9ca3af; font-size: 11px; }
        .header { text-align: center; margin-bottom: 12px; }
        .subtitle { color: #6b7280; font-size: 12px; margin: 2px 0 0; }
      </style></head><body>${printContents}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  return (
    <div>
      <div id="invoice-print-area">
        <div class="header">
          <h2>POS System</h2>
          <p class="subtitle">Sales Invoice</p>
        </div>
        <hr />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, margin: "10px 0", fontSize: 13 }}>
          <div><b>Order ID:</b> {data.orderId}</div>
          <div><b>Date:</b> {data.createdAt?.substring(0, 10)}</div>
          <div><b>Customer:</b> {data.customerName}</div>
          <div><b>Phone:</b> {data.customerPhoneNumber}</div>
          <div><b>Payment:</b> {data.paymentMode}</div>
          <div><b>Cashier:</b> {data.cashierName || "—"}</div>
          <div><b>Status:</b> {data.status || "Delivered"}</div>
        </div>
        <hr />
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Product</th>
              <th style={{ textAlign: "center" }}>Qty</th>
              <th style={{ textAlign: "right" }}>Price</th>
              <th style={{ textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.cartItems?.map((item, i) => (
              <tr key={i}>
                <td>{item.title}</td>
                <td style={{ textAlign: "center" }}>{item.quantity}</td>
                <td style={{ textAlign: "right" }}>Rs {item.price}</td>
                <td style={{ textAlign: "right" }}>Rs {(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
        <div style={{ textAlign: "right", marginTop: 6, lineHeight: 1.9 }}>
          <div>Subtotal: Rs {data.subTotal}</div>
          <div style={{ color: "#ef4444" }}>VAT: +Rs {data.tax}</div>
          <div style={{ fontWeight: "bold", fontSize: 15 }}>Grand Total: Rs {data.totalAmount}</div>
        </div>
        <div style={{ textAlign: "center", marginTop: 18, color: "#9ca3af", fontSize: 11 }}>
          Thank you for your business!
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
        <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}
          style={{ background: "#ec4899", borderColor: "#ec4899" }}>
          Print Invoice
        </Button>
      </div>
    </div>
  );
};

// ── Main page ──────────────────────────────────────────────────────────────────
const InvoicePage = () => {
  const [invoices, setInvoices]       = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [viewItem, setViewItem]       = useState(null);
  const [dateRange, setDateRange]     = useState(null);
  const [cashierFilter, setCashierFilter] = useState(null);
  const searchInput = useRef(null);
  const BASE = process.env.REACT_APP_SERVER_URL;

  const fetchInvoices = () => {
    setLoading(true);
    fetch(BASE + "/api/invoices/get-all")
      .then(r => r.json())
      .then(data => { setInvoices(data); setFiltered(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchInvoices(); }, []); // eslint-disable-line

  // re-filter whenever cashier or date changes
  useEffect(() => {
    let data = [...invoices];
    if (cashierFilter) data = data.filter(i => i.cashierName === cashierFilter);
    if (dateRange?.[0]) {
      const [start, end] = dateRange;
      data = data.filter(inv => {
        const d = dayjs(inv.createdAt);
        return d.isAfter(dayjs(start).startOf("day").subtract(1, "ms"))
            && d.isBefore(dayjs(end).endOf("day").add(1, "ms"));
      });
    }
    setFiltered(data);
  }, [cashierFilter, dateRange, invoices]);

  const cashierNames = [...new Set(invoices.map(i => i.cashierName).filter(Boolean))];

  // ── actions ──
  const handleDelete = async (id) => {
    const res = await fetch(BASE + "/api/invoices/delete-invoice", {
      method: "DELETE",
      body: JSON.stringify({ invoiceId: id }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    }).catch(() => null);
    if (res?.status === 200) { message.success("Invoice deleted!"); fetchInvoices(); }
    else message.error("Delete failed!");
  };

  const handleRefund = async (id) => {
    const res = await fetch(BASE + "/api/invoices/refund-invoice", {
      method: "PUT",
      body: JSON.stringify({ invoiceId: id }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    }).catch(() => null);
    if (res?.status === 200) { message.success("Marked as Refunded!"); fetchInvoices(); }
    else message.error("Refund failed!");
  };

  // ── column search helper ──
  const getSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input ref={searchInput} placeholder={`Search ${dataIndex}`} value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => { confirm(); }}
          style={{ marginBottom: 8, display: "block" }} />
        <Space>
          <Button type="primary" size="small" style={{ width: 90 }} icon={<SearchOutlined />}
            onClick={() => confirm()}>Search</Button>
          <Button size="small" style={{ width: 90 }}
            onClick={() => { clearFilters?.(); confirm(); }}>Reset</Button>
          <Button type="link" size="small" onClick={close}>close</Button>
        </Space>
      </div>
    ),
    filterIcon: f => <SearchOutlined style={{ color: f ? "#1890ff" : undefined }} />,
    onFilter: (value, record) => record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: v => { if (v) setTimeout(() => searchInput.current?.select(), 100); },
  });

  // ── table columns ──
  const columns = [
    { title: "#", key: "sl", render: (_, __, i) => i + 1, width: 50 },
    { title: "Order ID",  dataIndex: "orderId",             key: "orderId",  width: 160, ...getSearchProps("orderId") },
    { title: "Customer",  dataIndex: "customerName",        key: "customerName",         ...getSearchProps("customerName") },
    { title: "Phone",     dataIndex: "customerPhoneNumber", key: "phone" },
    { title: "Cashier",   dataIndex: "cashierName",         key: "cashier",  render: v => v || "—" },
    { title: "Payment",   dataIndex: "paymentMode",         key: "payment" },
    { title: "Total",     dataIndex: "totalAmount",         key: "total",    render: t => `Rs ${t}`, sorter: (a, b) => a.totalAmount - b.totalAmount },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: s => <Tag color={s === "Refunded" ? "#ef4444" : "#10b981"}>{s || "Delivered"}</Tag>,
    },
    { title: "Date", dataIndex: "createdAt", key: "date", render: t => t?.substring(0, 10) },
    {
      title: "Actions", key: "actions", width: 210,
      render: (_, record) => (
        <Space size={4} wrap>
          <Button size="small" type="primary"
            style={{ background: "#4f46e5", borderColor: "#4f46e5" }}
            onClick={() => setViewItem(record)}>View</Button>

          <Button size="small"
            style={{ background: "#10b981", borderColor: "#10b981", color: "#fff" }}
            icon={<PrinterOutlined />}
            onClick={() => setViewItem(record)}>Print</Button>

          {record.status !== "Refunded" && (
            <Popconfirm title="Mark as Refunded?" okText="Yes" cancelText="No"
              onConfirm={() => handleRefund(record._id)}>
              <Button size="small"
                style={{ background: "#06b6d4", borderColor: "#06b6d4", color: "#fff" }}>
                Refund
              </Button>
            </Popconfirm>
          )}

          <Popconfirm title="Delete this invoice?" okText="Yes" cancelText="No"
            onConfirm={() => handleDelete(record._id)}>
            <Button size="small" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ── summary stats ──
  const totalRevenue   = filtered.reduce((s, i) => i.status !== "Refunded" ? s + Number(i.totalAmount) : s, 0);
  const refundedCount  = filtered.filter(i => i.status === "Refunded").length;

  return (
    <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>

        {/* header */}
        <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "24px 40px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: "#111827" }}>Sales Invoices</h1>
          <p style={{ fontSize: 15, color: "#6b7280", margin: "6px 0 0", fontWeight: 500 }}>Complete sales transaction history</p>
        </div>

        <div style={{ padding: 40 }}>

          {/* summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 24 }}>
            {[
              { label: "Total Invoices",  value: filtered.length,                    color: "#4f46e5" },
              { label: "Total Revenue",   value: `Rs ${totalRevenue.toLocaleString()}`, color: "#10b981" },
              { label: "Refunded",        value: refundedCount,                      color: "#ef4444" },
            ].map((c, i) => (
              <div key={i} style={{ background: "white", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 2px rgba(0,0,0,.05)", borderLeft: `4px solid ${c.color}`, border: "1px solid #e5e7eb" }}>
                <p style={{ color: "#6b7280", fontSize: 14, margin: 0, fontWeight: 500 }}>{c.label}</p>
                <p style={{ fontSize: 28, fontWeight: 700, margin: "8px 0 0", color: c.color }}>{c.value}</p>
              </div>
            ))}
          </div>

          {/* table card */}
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}>

            {/* filters row */}
            <div style={{ padding: "24px 32px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <Select allowClear placeholder="Filter by Cashier" size="large" style={{ width: 220 }}
                  value={cashierFilter} onChange={setCashierFilter}>
                  {cashierNames.map(n => <Select.Option key={n} value={n}>{n}</Select.Option>)}
                </Select>

                <RangePicker size="large" style={{ width: 300 }} onChange={dates => setDateRange(dates)} />

                {(cashierFilter || dateRange) && (
                  <Button size="large" onClick={() => { setCashierFilter(null); setDateRange(null); }}>
                    Clear Filters
                  </Button>
                )}

                <span style={{ marginLeft: "auto", color: "#6b7280", fontSize: 14, fontWeight: 500 }}>
                  {filtered.length} invoice{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div style={{ padding: 32 }}>
              {loading
                ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spin size="large" /></div>
                : <Table dataSource={filtered} columns={columns} bordered rowKey="_id"
                    pagination={{ pageSize: 10 }} scroll={{ x: 1200 }} />
              }
            </div>
          </div>
        </div>
      </div>

      {/* View / Print modal */}
      <Modal title="Invoice Details" open={!!viewItem} onCancel={() => setViewItem(null)}
        footer={null} width={620} destroyOnClose>
        <InvoicePrint data={viewItem} />
      </Modal>
    </div>
  );
};

export default InvoicePage;
