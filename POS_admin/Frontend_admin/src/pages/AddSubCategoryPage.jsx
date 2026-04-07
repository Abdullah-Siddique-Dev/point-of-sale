import Sidebar from "../components/Sidebar";
import { Form, Input, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";

const AddSubCategoryPage = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(process.env.REACT_APP_SERVER_URL + "/api/categories/get-all")
      .then((r) => r.json())
      .then(setCategories)
      .catch(console.log);
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    const selected = categories.find((c) => c._id === values.categoryId);
    try {
      const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/subcategories/add-subcategory", {
        method: "POST",
        body: JSON.stringify({ title: values.title, categoryId: values.categoryId, categoryName: selected?.title || "" }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 200) { message.success("Sub category added successfully!"); navigate("/sub-categories"); }
      else message.error("Failed to add sub category!");
    } catch (e) { message.error("Something went wrong!"); }
    setLoading(false);
  };

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/sub-categories")}
              style={{
                background: 'transparent',
                border: '1px solid #e5e7eb',
                color: '#6b7280',
                height: 36,
                width: 36,
                padding: 0
              }}
            />
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#111827' }}>Add Sub Category</h1>
          </div>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 0 52px', fontWeight: 500 }}>
            Create a new sub category
          </p>
        </div>

        <div style={{ padding: 40 }}>
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 32,
            maxWidth: 600,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#111827' }}>Parent Category</span>}
                name="categoryId"
                rules={[{ required: true, message: "Please select a category!" }]}
              >
                <Select placeholder="Select parent category" size="large" style={{ height: 48 }}>
                  {categories.map((cat) => (
                    <Select.Option key={cat._id} value={cat._id}>{cat.title}</Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#111827' }}>Sub Category Name</span>}
                name="title"
                rules={[{ required: true, message: "Please enter sub category name!" }]}
              >
                <Input placeholder="Enter sub category name" size="large" style={{ height: 48 }} />
              </Form.Item>

              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <Button
                  onClick={() => navigate("/sub-categories")}
                  size="large"
                  style={{
                    height: 48,
                    fontWeight: 600,
                    background: 'transparent',
                    border: '1px solid #e5e7eb',
                    color: '#6b7280'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  style={{
                    height: 48,
                    fontWeight: 600,
                    background: '#4f46e5',
                    borderColor: '#4f46e5',
                    flex: 1
                  }}
                >
                  Add Sub Category
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubCategoryPage;
