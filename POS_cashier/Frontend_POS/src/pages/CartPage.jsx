import HorizontalNavbar from "../components/navbar/HorizontalNavbar";
import { Table, Card, Button, message, Popconfirm, Input, Space } from "antd";
import { useRef, useState } from "react";
import CreateInvoice from "../components/cart/CreateInvoice";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircleOutlined, MinusCircleOutlined, ClearOutlined, UserOutlined } from "@ant-design/icons";
import { increase, decrease, deleteProduct, reset } from "../redux/cartSlice";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const CartPage = () => {
  const cart = useSelector((state) => state.cart);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch(increase);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const user = JSON.parse(localStorage.getItem("postUser"));

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
    { title: "Product Image", dataIndex: "img", key: "img", width: "100px", render: (text) => <img src={text} alt="" className="w-16 h-16 object-cover rounded" /> },
    { title: "Product Name", dataIndex: "title", key: "title", ...getColumnSearchProps("title") },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Product Price", dataIndex: "price", key: "price", render: (text) => <span>Rs {text.toFixed(2)}</span>, sorter: (a, b) => a.price - b.price },
    {
      title: "Quantity", dataIndex: "quantity", key: "quantity",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Button type="primary" size="small" shape="circle" icon={<PlusCircleOutlined />} onClick={() => dispatch(increase(record))} />
          <span className="font-bold w-6 text-center">{record.quantity}</span>
          <Button type="primary" size="small" shape="circle" icon={<MinusCircleOutlined />}
            onClick={() => {
              if (record.quantity === 1) { if (window.confirm("Delete Product?")) { dispatch(decrease(record)); message.info("Product removed from cart."); } }
              else { dispatch(decrease(record)); }
            }} />
        </div>
      ),
    },
    { title: "Total Price", dataIndex: "generalPrice", key: "generalPrice", render: (text, record) => <span>Rs {(record.quantity * record.price).toFixed(2)}</span> },
    {
      title: "Action", dataIndex: "action", key: "action", width: "100px",
      render: (text, record) => (
        <Popconfirm title="Delete Product" description="Are you sure?" okText="Yes" cancelText="No" onConfirm={() => dispatch(deleteProduct(record))}>
          <Button type="primary" danger size="small">Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <HorizontalNavbar />
      <div style={{ marginLeft: "220px", width: "calc(100% - 220px)" }}>
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">Cart</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <UserOutlined />
            <span className="text-sm font-medium">{user?.username || "Admin"}</span>
          </div>
        </div>
        <div className="p-5">
          <div className="bg-white rounded shadow p-4">
            <Table dataSource={cart.cartItems} columns={columns} bordered pagination={false} scroll={{ x: 1000, y: 400 }} />
          </div>
          <div className="flex justify-end mt-4">
            <Card className="w-80 shadow">
              <div className="flex justify-between mb-2"><span>Subtotal</span><span>Rs {cart.total.toFixed(2)}</span></div>
              <div className="flex justify-between mb-2"><span>VAT %{cart.tax}</span><span className="text-red-600">+Rs {((cart.total * cart.tax) / 100).toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>Rs {(cart.total + (cart.total * cart.tax) / 100).toFixed(2)}</span></div>
              <Button size="large" type="primary" className="mt-4 w-full" onClick={() => setIsModalOpen(true)} disabled={cart.cartItems.length === 0}>Create Order</Button>
              {cart.cartItems.length > 0 && (
                <Popconfirm title="Delete all products?" okText="Yes" cancelText="No" onConfirm={() => dispatch(reset())}>
                  <Button type="primary" size="large" className="w-full mt-2" icon={<ClearOutlined />} danger>Delete All</Button>
                </Popconfirm>
              )}
            </Card>
          </div>
        </div>
      </div>
      <CreateInvoice isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
};

export default CartPage;

