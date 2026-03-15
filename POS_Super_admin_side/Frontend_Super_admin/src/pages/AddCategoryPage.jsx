import Sidebar from "../components/Sidebar";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AddCategoryPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/categories/add-category", {
        method: "POST",
        body: JSON.stringify({ title: values.title }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 200) { message.success("Category added!"); navigate("/categories"); }
      else message.error("Failed to add category!");
    } catch (e) { message.error("Something went wrong!"); }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", background: "#f3f4f6", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, width: "calc(100% - 220px)" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 24px", position: "sticky", top: 0, zIndex: 10 }}>
          <h1 style={{ fontSize: 20, fontWeight: "bold", margin: 0 }}>Add Category</h1>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 8, padding: 24, maxWidth: 480, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item label="Category Name" name="title" rules={[{ required: true, message: "Please enter category name!" }]}>
                <Input placeholder="Enter category name" size="large" />
              </Form.Item>
              <div style={{ display: "flex", gap: 12 }}>
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
