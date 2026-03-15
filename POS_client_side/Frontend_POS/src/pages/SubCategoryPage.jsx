import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { Table, Spin, Tag, Button, Popconfirm, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const SubCategoryPage = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("postUser"));
  const navigate = useNavigate();

  const fetchSubCategories = async () => {
    try {
      const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/subcategories/get-all");
      const data = await res.json();
      setSubCategories(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubCategories(); }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/subcategories/delete-subcategory", {
        method: "DELETE",
        body: JSON.stringify({ subCategoryId: id }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 200) {
        message.success("Sub category deleted!");
        fetchSubCategories();
      }
    } catch (error) {
      message.error("Delete failed!");
    }
  };

  const columns = [
    { title: "SL", key: "index", render: (_, __, index) => index + 1, width: 60 },
    { title: "Sub Category Name", dataIndex: "title", key: "title" },
    { title: "Parent Category", dataIndex: "categoryName", key: "categoryName", render: (text) => <Tag color="blue">{text}</Tag> },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt", render: (text) => text?.substring(0, 10) },
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
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div style={{ marginLeft: "220px", width: "calc(100% - 220px)" }}>
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">All Sub Categories</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <UserOutlined />
            <span className="text-sm font-medium">{user?.username || "Admin"}</span>
          </div>
        </div>
        <div className="p-5">
          <div className="bg-white rounded shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Sub Categories</h2>
              <Button type="primary" onClick={() => navigate("/sub-categories/add")}>+ Add Sub Category</Button>
            </div>
            {loading ? (
              <div className="flex justify-center py-10"><Spin size="large" /></div>
            ) : (
              <Table dataSource={subCategories} columns={columns} rowKey="_id" pagination={{ pageSize: 10 }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryPage;
