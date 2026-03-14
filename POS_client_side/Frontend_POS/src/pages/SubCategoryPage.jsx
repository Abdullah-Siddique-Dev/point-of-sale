import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { Table, Spin, Switch, Tag } from "antd";

const SubCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(
          process.env.REACT_APP_SERVER_URL + "/api/categories/get-all"
        );
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
      render: (text, record, index) => index + 1,
    },
    {
      title: "Thumbnail",
      dataIndex: "img",
      key: "img",
      render: () => (
        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-gray-500 text-xs">No Image</span>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "title",
      key: "category",
      render: (title) => <Tag color="blue">{title}</Tag>,
    },
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: () => <Switch checked disabled />,
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="main-content" style={{ marginLeft: "250px", width: "calc(100% - 250px)" }}>
        <div className="top-bar bg-white border-b p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Sub Categories</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Admin</span>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Sub Categories</h2>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-medium mb-4">Sub Categories</h3>
            {loading ? (
              <div className="flex justify-center py-10">
                <Spin size="large" />
              </div>
            ) : (
              <Table
                dataSource={categories}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryPage;
