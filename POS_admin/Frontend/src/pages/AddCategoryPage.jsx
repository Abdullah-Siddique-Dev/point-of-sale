import Sidebar from "../components/Sidebar";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";

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
      if (res.status === 200) { message.success("Category added successfully!"); navigate("/categories"); }
      else message.error("Failed to add category!");
    } catch (e) { message.error("Something went wrong!"); }
    setLoading(false);
  };

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/categories")}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-dark)',
                color: 'var(--text-gray)',
                height: 36,
                width: 36,
                padding: 0
              }}
            />
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: 'var(--text-light)' }}>Add Category</h1>
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-gray)', margin: '0 0 0 52px', fontWeight: 500 }}>
            Create a new product category
          </p>
        </div>

        <div style={{ padding: 40 }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 12,
            padding: 32,
            maxWidth: 600,
            border: '1px solid var(--border-dark)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
          }}>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label={<span style={{ color: 'var(--text-light)', fontWeight: 600 }}>Category Name</span>}
                name="title"
                rules={[{ required: true, message: "Please enter category name!" }]}
              >
                <Input
                  placeholder="Enter category name"
                  size="large"
                  style={{
                    background: 'var(--bg-hover)',
                    border: '1px solid var(--border-dark)',
                    color: 'var(--text-light)',
                    height: 48,
                    fontSize: 15
                  }}
                />
              </Form.Item>

              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <Button
                  onClick={() => navigate("/categories")}
                  size="large"
                  style={{
                    height: 48,
                    fontWeight: 600,
                    background: 'transparent',
                    border: '1px solid var(--border-dark)',
                    color: 'var(--text-gray)'
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
                    background: 'var(--primary)',
                    borderColor: 'var(--primary)',
                    flex: 1
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-hover)'}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.background = 'var(--primary)')}
                >
                  Add Category
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryPage;
