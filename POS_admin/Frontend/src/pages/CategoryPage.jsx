import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Table, Spin, Button, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/categories/get-all");
      const data = await res.json();
      setCategories(data);
      setLoading(false);
    } catch (e) { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/categories/delete-category", {
        method: "DELETE",
        body: JSON.stringify({ categoryId: id }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 200) { message.success("Category deleted!"); fetchCategories(); }
      else message.error("Delete failed!");
    } catch (e) { message.error("Something went wrong!"); }
  };

  const columns = [
    { title: "SL", key: "index", render: (_, __, i) => i + 1, width: 60 },
    { title: "Category Name", dataIndex: "title", key: "title" },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt", render: (t) => t?.substring(0, 10) },
    {
      title: "Action", key: "action",
      render: (_, record) => (
        <Popconfirm title="Delete this category?" okText="Yes" cancelText="No" onConfirm={() => handleDelete(record._id)}>
          <Button type="primary" danger size="small">Delete</Button>
        </Popconfirm>
      ),
    },
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
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#111827' }}>Categories</h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>
            Manage product categories
          </p>
        </div>

        <div style={{ padding: 40 }}>
          <div style={{
            background: 'white',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid #e5e7eb',
              background: '#f9fafb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#111827' }}>All Categories</h3>
                <p style={{ fontSize: 14, color: '#6b7280', margin: '6px 0 0' }}>
                  {categories.length} categories total
                </p>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/categories/add")}
                style={{
                  background: '#4f46e5',
                  borderColor: '#4f46e5',
                  height: 40,
                  fontWeight: 600,
                  fontSize: 14
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#4338ca'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#4f46e5'}
              >
                Add Category
              </Button>
            </div>

            <div style={{ padding: 32 }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
                  <Spin size="large" />
                </div>
              ) : (
                <Table
                  dataSource={categories}
                  columns={columns}
                  rowKey="_id"
                  pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} categories` }}
                  style={{ fontSize: 14 }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
