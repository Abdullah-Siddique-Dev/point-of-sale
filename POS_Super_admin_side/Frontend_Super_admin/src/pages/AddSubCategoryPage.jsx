import Sidebar from "../components/Sidebar";
import { Form, Input, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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
      if (res.status === 200) { message.success("Sub category added!"); navigate("/sub-categories"); }
      else message.error("Failed to add sub category!");
    } catch (e) { message.error("Something went wrong!"); }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", background: "#f3f4f6", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, width: "calc(100% - 220px)" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 24px", position: "sticky", top: 0, zIndex: 10 }}>
          <h1 style={{ fontSize: 20, fontWeight: "bold", margin: 0 }}>Add Sub Category</h1>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 8, padding: 24, maxWidth: 480, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
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
              <div style={{ display: "flex", gap: 12 }}>
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
