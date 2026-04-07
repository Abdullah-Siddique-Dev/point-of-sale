import Sidebar from "../components/Sidebar";
import { Table, Button, Input, Space, Spin } from "antd";
import { useEffect, useState, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";

const CustomersPage = () => {
  const [invoices, setInvoices] = useState(null);
  const [searchText, setSearchText] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    fetch(process.env.REACT_APP_SERVER_URL + "/api/invoices/get-all")
      .then((r) => r.json())
      .then((data) => setInvoices(data.map((i) => ({ ...i, key: i._id }))))
      .catch(console.log);
  }, []);

  const handleSearch = (keys, confirm, col) => { confirm(); setSearchText(keys[0]); };
  const handleReset = (clear) => { clear(); setSearchText(""); };

  const getSearchProps = (col) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input ref={searchInput} placeholder={`Search ${col}`} value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, col)}
          style={{ marginBottom: 8, display: "block" }} />
        <Space>
          <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, col)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>Search</Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>Reset</Button>
          <Button type="link" size="small" onClick={() => close()}>close</Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) => record[col]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => { if (visible) setTimeout(() => searchInput.current?.select(), 100); },
    render: (text) => text,
  });

  const columns = [
    { title: "Customer Name", dataIndex: "customerName", key: "customerName", ...getSearchProps("customerName") },
    { title: "Phone Number", dataIndex: "customerPhoneNumber", key: "customerPhoneNumber", ...getSearchProps("customerPhoneNumber") },
    { title: "Transaction Date", dataIndex: "createdAt", key: "createdAt", render: (t) => t?.substring(0, 10) },
    { title: "Payment Method", dataIndex: "paymentMode", key: "paymentMode" },
    { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount", render: (t) => `Rs ${t}`, sorter: (a, b) => a.totalAmount - b.totalAmount },
  ];

  return (
    <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>
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
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#111827' }}>Customers</h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>
            View all customer transactions and details
          </p>
        </div>

        <div style={{ padding: 40 }}>
          {invoices ? (
            <div style={{ 
              background: 'white', 
              borderRadius: 12, 
              border: '1px solid #e5e7eb', 
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              <div style={{ padding: '24px 32px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#111827' }}>All Customers</h3>
                <p style={{ fontSize: 14, color: '#6b7280', margin: '6px 0 0' }}>Complete list of customer transactions</p>
              </div>
              <div style={{ padding: 32 }}>
                <Table 
                  dataSource={invoices} 
                  columns={columns} 
                  bordered={false}
                  pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} customers` }} 
                  scroll={{ x: 900 }} 
                  rowKey="_id"
                  style={{ fontSize: 14 }}
                />
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
              <Spin size="large" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
