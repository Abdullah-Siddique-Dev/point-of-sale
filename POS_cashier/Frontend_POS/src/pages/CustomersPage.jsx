import HorizontalNavbar from "../components/navbar/HorizontalNavbar";
import { Table, Button, Input, Space, Spin } from "antd";
import { useEffect, useState, useRef } from "react";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

const CustomersPage = () => {
  const [invoices, setInvoices] = useState();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    const getInvoices = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/invoices/get-all");
        const data = await res.json();
        setInvoices(data.map((item) => ({ ...item, key: item._id })));
      } catch (error) { console.log(error); }
    };
    getInvoices();
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => { confirm(); setSearchText(selectedKeys[0]); setSearchedColumn(dataIndex); };
  const handleReset = (clearFilters) => { clearFilters(); setSearchText(""); };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input ref={searchInput} placeholder={`Search ${dataIndex}`} value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }} />
        <Space>
          <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>Search</Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>Reset</Button>
          <Button type="link" size="small" onClick={() => close()}>close</Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => { if (visible) { setTimeout(() => searchInput.current?.select(), 100); } },
    render: (text) => searchedColumn === dataIndex ? (
      <Highlighter highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }} searchWords={[searchText]} autoEscape textToHighlight={text ? text.toString() : ""} />
    ) : (text),
  });

  const columns = [
    { title: "Customer Name", dataIndex: "customerName", key: "customerName", ...getColumnSearchProps("customerName") },
    { title: "Phone Number", dataIndex: "customerPhoneNumber", key: "customerPhoneNumber" },
    { title: "Transaction Date", dataIndex: "createdAt", key: "createdAt", render: (text) => <span>{text?.substring(0, 10)}</span> },
    { title: "Payment Method", dataIndex: "paymentMode", key: "paymentMode" },
    { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount", render: (text) => <span>Rs {text}</span> },
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
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#111827' }}>Customers</h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>
            View all customer transactions and details
          </p>
        </div>

        <div style={{ padding: 40 }}>
          {invoices ? (
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ padding: '28px 36px', borderBottom: '1px solid #e5e7eb', background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#111827', letterSpacing: '-0.01em' }}>All Customers</h3>
                <p style={{ fontSize: 14, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>Complete list of customer transactions</p>
              </div>
              <div style={{ padding: 36 }}>
                <Table 
                  dataSource={invoices} 
                  columns={columns} 
                  bordered={false}
                  pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} customers` }} 
                  scroll={{ x: 900 }} 
                  rowKey="_id"
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

