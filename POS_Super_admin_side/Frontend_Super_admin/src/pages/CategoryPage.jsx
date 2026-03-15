import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Table, Spin, Button, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";

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
    <div style={{ display: "flex", background: "#f3f4f6", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, width: "calc(100% - 220px)" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 24px", position: "sticky", top: 0, zIndex: 10 }}>
          <h1 style={{ fontSize: 20, fontWeight: "bold", margin: 0 }}>All Categories</h1>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 8, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Categories</h2>
              <Button type="primary" onClick={() => navigate("/categories/add")}>+ Add Category</Button>
            </div>
            {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spin size="large" /></div>
              : <Table dataSource={categories} columns={columns} rowKey="_id" pagination={{ pageSize: 10 }} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
