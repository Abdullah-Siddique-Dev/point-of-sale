import Sidebar from "../components/Sidebar";
import { Form, Input, Button, Select, Upload, message } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
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
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 400;
      const canvas = document.createElement("canvas");
      let w = img.width, h = img.height;
      if (w > h) { if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; } }
      else { if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; } }
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      setImageBase64(canvas.toDataURL("image/jpeg", 0.75));
    };
    img.src = url;
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
      if (res.status === 200) { message.success("Product added successfully!"); navigate("/products"); }
      else message.error("Failed to add product!");
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
              onClick={() => navigate("/products")}
              style={{
                background: 'transparent',
                border: '1px solid #e5e7eb',
                color: '#6b7280',
                height: 36,
                width: 36,
                padding: 0
              }}
            />
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#111827' }}>Add Product</h1>
          </div>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 0 52px', fontWeight: 500 }}>
            Create a new product
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
                label={<span style={{ fontWeight: 600, color: '#111827' }}>Product Name</span>}
                name="title"
                rules={[{ required: true, message: "Please enter product name!" }]}
              >
                <Input placeholder="Enter product name" size="large" style={{ height: 48 }} />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#111827' }}>Category</span>}
                name="category"
                rules={[{ required: true, message: "Please select a category!" }]}
              >
                <Select placeholder="Select category" size="large" style={{ height: 48 }}>
                  {categories.map((c) => <Select.Option key={c._id} value={c.title}>{c.title}</Select.Option>)}
                </Select>
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#111827' }}>Price (Rs)</span>}
                name="price"
                rules={[{ required: true, message: "Please enter price!" }]}
              >
                <Input type="number" placeholder="Enter price" size="large" style={{ height: 48 }} />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#111827' }}>Product Image</span>}
                required
              >
                <Upload beforeUpload={handleImageUpload} maxCount={1} listType="picture">
                  <Button icon={<UploadOutlined />} size="large">Upload Image</Button>
                </Upload>
                {imageBase64 && (
                  <img src={imageBase64} alt="preview" style={{ width: 120, height: 120, objectFit: 'cover', marginTop: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                )}
              </Form.Item>

              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <Button
                  onClick={() => navigate("/products")}
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
                  Add Product
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
