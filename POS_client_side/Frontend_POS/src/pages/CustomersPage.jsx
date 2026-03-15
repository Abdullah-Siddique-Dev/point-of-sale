import Sidebar from "../components/sidebar/Sidebar";
import { Table, Button, Input, Space, Spin } from "antd";
import { useEffect, useState, useRef } from "react";
import Highlighter from "react-highlight-words";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";

const CustomersPage = () => {
  const [invoices, setInvoices] = useState();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const user = JSON.parse(localStorage.getItem("postUser"));

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
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div style={{ marginLeft: "220px", width: "calc(100% - 220px)" }}>
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">Customers</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <UserOutlined />
            <span className="text-sm font-medium">{user?.username || "Admin"}</span>
          </div>
        </div>
        <div className="p-5">
          {invoices ? (
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-semibold mb-4">All Customers</h2>
              <Table dataSource={invoices} columns={columns} bordered pagination={true} scroll={{ x: 900 }} rowKey="_id" />
            </div>
          ) : (
            <div className="flex justify-center items-center h-64"><Spin size="large" /></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
