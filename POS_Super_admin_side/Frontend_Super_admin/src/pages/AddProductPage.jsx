import Sidebar from "../components/Sidebar";
import { Form, Input, Button, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const AddProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(process.env.REACT_APP_SERVER_URL + "/api/categories/get-all")
      .then((r) => r.json()).then(setCategories).catch(console.log);
  }, []);

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => setImageBase64(e.target.result);
    reader.readAsDataURL(file);
    return false;
  };

  const onFinish = async (values) => {
    if (!imageBase64) { message.error("Please upload a product image!"); return; }
    setLoading(true);
    try {
      const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/products/add-product", {
        method: "POST",
        body: JSON.stringify({ title: values.title, img: imageBase64, price: values.price, category: values.category }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 200) { message.success("Product added!"); navigate("/products"); }
      else message.error("Failed to add product!");
    } catch (e) { message.error("Something went wrong!"); }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", background: "#f3f4f6", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, width: "calc(100% - 220px)" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 24px", position: "sticky", top: 0, zIndex: 10 }}>
          <h1 style={{ fontSize: 20, fontWeight: "bold", margin: 0 }}>Add Product</h1>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 8, padding: 24, maxWidth: 520, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item label="Product Name" name="title" rules={[{ required: true, message: "Required!" }]}>
                <Input placeholder="Enter product name" size="large" />
              </Form.Item>
              <Form.Item label="Category" name="category" rules={[{ required: true, message: "Required!" }]}>
                <Select placeholder="Select category" size="large">
                  {categories.map((c) => <Select.Option key={c._id} value={c.title}>{c.title}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item label="Price (Rs)" name="price" rules={[{ required: true, message: "Required!" }]}>
                <Input type="number" placeholder="Enter price" size="large" />
              </Form.Item>
              <Form.Item label="Product Image" required>
                <Upload beforeUpload={handleImageUpload} maxCount={1} listType="picture">
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </Form.Item>
              <div style={{ display: "flex", gap: 12 }}>
                <Button onClick={() => navigate("/products")} size="large">Cancel</Button>
                <Button type="primary" htmlType="submit" loading={loading} size="large">Add Product</Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
