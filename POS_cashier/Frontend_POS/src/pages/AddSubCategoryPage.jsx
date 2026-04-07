import HorizontalNavbar from "../components/navbar/HorizontalNavbar";
import { Form, Input, Button, Select, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const AddSubCategoryPage = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("postUser"));

  useEffect(() => {
    fetch(process.env.REACT_APP_SERVER_URL + "/api/categories/get-all")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err));
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    const selected = categories.find((c) => c._id === values.categoryId);
    try {
      const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/subcategories/add-subcategory", {
        method: "POST",
        body: JSON.stringify({
          title: values.title,
          categoryId: values.categoryId,
          categoryName: selected?.title || "",
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 200) {
        message.success("Sub category added successfully!");
        navigate("/sub-categories");
      } else {
        message.error("Failed to add sub category!");
      }
    } catch (error) {
      message.error("Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <HorizontalNavbar />
      <div style={{ marginLeft: "220px", width: "calc(100% - 220px)" }}>
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">Add Sub Category</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <UserOutlined />
            <span className="text-sm font-medium">{user?.username || "Admin"}</span>
          </div>
        </div>
        <div className="p-5">
          <div className="bg-white rounded shadow p-6 max-w-lg">
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item label="Parent Category" name="categoryId" rules={[{ required: true, message: "Please select a category!" }]}>
                <Select placeholder="Select parent category" size="large">
                  {categories.map((cat) => (
                    <Select.Option key={cat._id} value={cat._id}>{cat.title}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Sub Category Name" name="title" rules={[{ required: true, message: "Please enter sub category name!" }]}>
                <Input placeholder="Enter sub category name" size="large" />
              </Form.Item>
              <div className="flex gap-3">
                <Button onClick={() => navigate("/sub-categories")} size="large">Cancel</Button>
                <Button type="primary" htmlType="submit" loading={loading} size="large">Add Sub Category</Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubCategoryPage;

