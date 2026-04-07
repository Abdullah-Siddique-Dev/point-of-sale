import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Table, Spin, Button, Popconfirm, message, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

const SubCategoryPage = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSubCategories = async () => {
    try {
      const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/subcategories/get-all");
      const data = await res.json();
      setSubCategories(data);
      setLoading(false);
    } catch (e) { setLoading(false); }
  };

  useEffect(() => { fetchSubCategories(); }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/subcategories/delete-subcategory", {
        method: "DELETE",
        body: JSON.stringify({ subCategoryId: id }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 200) { message.success("Sub category deleted!"); fetchSubCategories(); }
      else message.error("Delete failed!");
    } catch (e) { message.error("Something went wrong!"); }
  };

  const columns = [
    { title: "SL", key: "index", render: (_, __, i) => i + 1, width: 60 },
    { title: "Sub Category Name", dataIndex: "title", key: "title" },
    {
      title: "Parent Category", dataIndex: "categoryName", key: "categoryName",
      render: (t) => <Tag style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', fontWeight: 600 }}>{t}</Tag>
    },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt", render: (t) => t?.substring(0, 10) },
    {
      title: "Action", key: "action",
      render: (_, record) => (
        <Popconfirm title="Delete this sub category?" okText="Yes" cancelText="No" onConfirm={() => handleDelete(record._id)}>
          <Button type="primary" danger size="small">Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", background: "var(--bg-dark)", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>
        {/* Header */}
        <div style={{
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-dark)',
          padding: '24px 40px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
        }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: 'var(--text-light)' }}>Sub Categories</h1>
          <p style={{ fontSize: 15, color: 'var(--text-gray)', margin: '6px 0 0', fontWeight: 500 }}>
            Manage product sub categories
          </p>
        </div>

        <div style={{ padding: 40 }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 12,
            border: '1px solid var(--border-dark)',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid var(--border-dark)',
              background: 'var(--bg-hover)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--text-light)' }}>All Sub Categories</h3>
                <p style={{ fontSize: 14, color: 'var(--text-gray)', margin: '6px 0 0' }}>
                  {subCategories.length} sub categories total
                </p>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/sub-categories/add")}
                style={{
                  background: 'var(--primary)',
                  borderColor: 'var(--primary)',
                  height: 40,
                  fontWeight: 600,
                  fontSize: 14
                }}
              >
                Add Sub Category
              </Button>
            </div>

            <div style={{ padding: 32 }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
                  <Spin size="large" />
                </div>
              ) : (
                <Table
                  dataSource={subCategories}
                  columns={columns}
                  rowKey="_id"
                  pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} sub categories` }}
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

export default SubCategoryPage;
