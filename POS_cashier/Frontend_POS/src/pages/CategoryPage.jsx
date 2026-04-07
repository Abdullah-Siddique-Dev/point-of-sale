import React, { useEffect, useState } from "react";
import HorizontalNavbar from "../components/navbar/HorizontalNavbar";
import { Table, Spin, Switch, Button, Tag } from "antd";
import { PlusOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/categories/get-all");
        const data = await res.json();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getCategories();
  }, []);

  const columns = [
    {
      title: "SL",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Thumbnail",
      dataIndex: "img",
      key: "img",
      width: 100,
      render: () => (
        <div style={{
          width: 48,
          height: 48,
          background: '#eef2ff',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e5e7eb'
        }}>
          <AppstoreOutlined style={{ fontSize: 20, color: '#4f46e5' }} />
        </div>
      ),
    },
    {
      title: "Category Name",
      dataIndex: "title",
      key: "title",
      render: (text) => <span style={{ fontWeight: 600, color: '#111827' }}>{text}</span>
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: () => (
        <Tag style={{ background: '#d1fae5', color: '#10b981', border: 'none', fontWeight: 600 }}>
          Active
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#f5f7ff", minHeight: "100vh" }}>
      <HorizontalNavbar />
      <div style={{ marginTop: 100, width: "100%" }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid #E5E7EB',
          padding: '24px 40px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#111827' }}>Categories</h1>
          <p style={{ fontSize: 15, color: '#6B7280', margin: '6px 0 0', fontWeight: 500 }}>
            Manage product categories
          </p>
        </div>

        <div style={{ padding: 40 }}>
          <div style={{
            background: 'white',
            borderRadius: 12,
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid #E5E7EB',
              background: '#F9FAFB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#111827' }}>All Categories</h3>
                <p style={{ fontSize: 14, color: '#6B7280', margin: '6px 0 0' }}>
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

