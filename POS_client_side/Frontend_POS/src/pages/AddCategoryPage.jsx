import Sidebar from "../components/sidebar/Sidebar";
import { Form, Input, Button, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AddCategoryPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("postUser"));

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/categories/add-category", {
        method: "POST",
        body: JSON.stringify({ title: values.title }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 200) {
        message.success("Category added successfully!");
        navigate("/categories");
      } else {
        message.error("Failed to add category!");
      }
    } catch (error) {
      message.error("Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div style={{ marginLeft: "220px", width: "calc(100% - 220px)" }}>
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">Add Category</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <UserOutlined />
            <span className="text-sm font-medium">{user?.username || "Admin"}</span>
          </div>
        </div>
        <div className="p-5">
          <div className="bg-white rounded shadow p-6 max-w-lg">
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item label="Category Name" name="title" rules={[{ required: true, message: "Please enter category name!" }]}>
                <Input placeholder="Enter category name" size="large" />
              </Form.Item>
              <div className="flex gap-3">
                <Button onClick={() => navigate("/categories")} size="large">Cancel</Button>
                <Button type="primary" htmlType="submit" loading={loading} size="large">Add Category</Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryPage;
