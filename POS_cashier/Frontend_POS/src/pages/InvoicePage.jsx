import HorizontalNavbar from "../components/navbar/HorizontalNavbar";
import { Table, Button, Input, Space, Spin, Tag, DatePicker } from "antd";
import { useEffect, useState, useRef } from "react";
import PrintInvoice from "../components/invoice/PrintInvoice";
import { SearchOutlined, CalendarOutlined, EyeOutlined, PrinterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const InvoicePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [printData, setPrintData] = useState({});
  const [dateRange, setDateRange] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchInput = useRef(null);

  const fetchInvoices = () => {
    setLoading(true);
    fetch(process.env.REACT_APP_SERVER_URL + "/api/invoices/get-all")
      .then((r) => r.json())
      .then((data) => {
        const mapped = data.map((i) => ({ ...i, key: i._id }));
        setInvoices(mapped);
        setFiltered(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchInvoices(); }, []);

  useEffect(() => {
    if (!dateRange || !dateRange[0]) { setFiltered(invoices); return; }
    const [start, end] = dateRange;
    setFiltered(invoices.filter(inv => {
      const d = dayjs(inv.createdAt);
      return d.isAfter(start.startOf("day").subtract(1, "ms")) && d.isBefore(end.endOf("day").add(1, "ms"));
    }));
  }, [dateRange, invoices]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters) => { clearFilters(); };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input ref={searchInput} placeholder={`Search ${dataIndex}`} value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }} />
        <Space>
          <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />} size="small" style={{ width: 90 }}>Search</Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>Reset</Button>
          <Button type="link" size="small" onClick={() => close()}>close</Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#4f46e5" : undefined }} />,
    onFilter: (value, record) => record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => { if (visible) setTimeout(() => searchInput.current?.select(), 100); },
  });

  const columns = [
    { title: "#", key: "i", render: (_, __, i) => i + 1, width: 50 },
    { title: "Order ID", dataIndex: "orderId", key: "orderId", width: 160 },
    { title: "Customer", dataIndex: "customerName", key: "customerName", ...getColumnSearchProps("customerName") },
    { title: "Phone", dataIndex: "customerPhoneNumber", key: "customerPhoneNumber" },
    {
      title: "Payment", dataIndex: "paymentMode", key: "paymentMode",
      render: (mode) => <Tag className="badge-success">{mode}</Tag>
    },
    {
      title: "Total", dataIndex: "totalAmount", key: "totalAmount",
      render: (t) => <span style={{ fontWeight: 700, color: '#10b981' }}>Rs {t}</span>,
      sorter: (a, b) => a.totalAmount - b.totalAmount
    },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (s) => (
        <Tag className={s === "Refunded" ? "badge-refund" : "badge-success"}>
          {s || "Delivered"}
        </Tag>
      )
    },
    { title: "Date", dataIndex: "createdAt", key: "createdAt", render: (t) => t?.substring(0, 10) },
    {
      title: "Action", key: "action", width: 150,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 6 }}>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => { setPrintData(record); setIsModalOpen(true); }}
            style={{ background: '#4f46e5', borderColor: '#4f46e5', color: 'white' }}
          >
            View
          </Button>
          <Button
            size="small"
            icon={<PrinterOutlined />}
            type="primary"
            onClick={() => { setPrintData(record); setIsModalOpen(true); }}
          >
            Print
          </Button>
        </div>
      ),
    },
  ];

  const totalRevenue = filtered.reduce((s, i) => i.status !== "Refunded" ? s + Number(i.totalAmount) : s, 0);
  const refundedCount = filtered.filter(i => i.status === "Refunded").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#f5f5f7", minHeight: "100vh" }}>
      <HorizontalNavbar />
      <div style={{ marginTop: 100, width: "100%" }}>
        <div style={{ padding: 40 }}>
          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 28 }}>
            {[
              { label: "Total Invoices", value: filtered.length, color: "#4f46e5" },
              { label: "Total Revenue", value: `Rs ${totalRevenue.toLocaleString()}`, color: "#10b981" },
              { label: "Refunded", value: refundedCount, color: "#06b6d4" },
            ].map((c, i) => (
              <div key={i} style={{
                background: 'white',
                borderRadius: 12,
                padding: '20px 24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                borderLeft: `4px solid ${c.color}`,
                border: '1px solid #e5e7eb'
              }}>
                <p style={{ color: "#6b7280", fontSize: 13, margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</p>
                <p style={{ fontSize: 28, fontWeight: 700, margin: "8px 0 0", color: c.color }}>{c.value}</p>
              </div>
            ))}
          </div>

          {/* Table Card */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '28px 36px', borderBottom: '1px solid #e5e7eb', background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <CalendarOutlined style={{ color: "#6b7280", fontSize: 16 }} />
                <RangePicker onChange={(dates) => setDateRange(dates)} style={{ width: 300 }} />
                {dateRange && (
                  <Button size="small" onClick={() => setDateRange(null)}>Clear Filter</Button>
                )}
                <span style={{ marginLeft: "auto", color: "#6b7280", fontSize: 14, fontWeight: 500 }}>
                  {filtered.length} invoice{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div style={{ padding: 36 }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
                  <Spin size="large" />
                </div>
              ) : (
                <Table
                  dataSource={filtered}
                  columns={columns}
                  bordered={false}
                  pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} invoices` }}
                  scroll={{ x: 1100 }}
                  rowKey="_id"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <PrintInvoice isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} printData={printData} />
    </div>
  );
};

export default InvoicePage;
