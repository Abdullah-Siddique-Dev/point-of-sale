import Sidebar from "../components/Sidebar";
import { Form, Input, Button, Upload, message } from "antd";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AddSupplierPage = () => {
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState("");
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  const BASE = process.env.REACT_APP_SERVER_URL;

  const getBase64 = (file) => new Promise((res, rej) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 300;
      const canvas = document.createElement("canvas");
      let w = img.width, h = img.height;
      if (w > h) { if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; } }
      else { if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; } }
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      res(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = rej;
    img.src = url;
  });

  const handleImgChange = async ({ fileList: fl }) => {
    setFileList(fl);
    if (fl.length > 0 && fl[0].originFileObj) {
      const b64 = await getBase64(fl[0].originFileObj);
      setImageBase64(b64);
    } else setImageBase64("");
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(BASE + "/api/suppliers/add-supplier", {
        method: "POST",
        body: JSON.stringify({ ...values, img: imageBase64, status: true }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 200) { message.success("Supplier added successfully!"); navigate("/suppliers"); }
      else message.error("Failed to add supplier!");
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
              onClick={() => navigate("/suppliers")}
              style={{
                background: 'transparent',
                border: '1px solid #e5e7eb',
                color: '#6b7280',
                height: 36,
                width: 36,
                padding: 0
              }}
            />
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#111827' }}>Add New Supplier</h1>
          </div>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 0 52px', fontWeight: 500 }}>
            Create a new supplier contact
          </p>
        </div>

        <div style={{ padding: 40 }}>
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 32,
            maxWidth: 700,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#111827" }}>Photo</span>}>
                <Upload listType="picture-card" fileList={fileList} onChange={handleImgChange} beforeUpload={() => false} maxCount={1}>
                  {fileList.length >= 1 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8, fontSize: 12, color: "#9ca3af" }}>Upload Photo</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#111827" }}>Full Name</span>}
                name="name"
                rules={[{ required: true, message: "Please enter name!" }]}
              >
                <Input size="large" placeholder="Enter full name" style={{ height: 48 }} />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#111827" }}>Company Name</span>}
                name="company"
              >
                <Input size="large" placeholder="Enter company name" style={{ height: 48 }} />
              </Form.Item>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Form.Item
                  label={<span style={{ fontWeight: 600, color: "#111827" }}>Phone Number</span>}
                  name="phone"
                  rules={[{ required: true, message: "Required!" }]}
                >
                  <Input size="large" placeholder="Enter phone number" style={{ height: 48 }} />
                </Form.Item>
                <Form.Item
                  label={<span style={{ fontWeight: 600, color: "#111827" }}>Email</span>}
                  name="email"
                  rules={[{ required: true, message: "Required!" }]}
                >
                  <Input size="large" placeholder="Enter email address" style={{ height: 48 }} />
                </Form.Item>
              </div>

              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#111827" }}>Address</span>}
                name="address"
              >
                <Input size="large" placeholder="Enter address" style={{ height: 48 }} />
              </Form.Item>

              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <Button
                  size="large"
                  onClick={() => navigate("/suppliers")}
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
                  Add Supplier
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSupplierPage;
