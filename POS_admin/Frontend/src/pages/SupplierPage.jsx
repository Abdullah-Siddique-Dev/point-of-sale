import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Table, Button, Popconfirm, message, Modal, Form, Input, Upload, Switch, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const BASE = process.env.REACT_APP_SERVER_URL;

  const fetchSuppliers = () => {
    setLoading(true);
    fetch(BASE + "/api/suppliers/get-all")
      .then((r) => r.json())
      .then((data) => { setSuppliers(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(BASE + "/api/suppliers/delete-supplier", {
        method: "DELETE",
        body: JSON.stringify({ supplierId: id }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 200) { message.success("Supplier deleted!"); fetchSuppliers(); }
      else message.error("Delete failed!");
    } catch (e) { message.error("Something went wrong!"); }
  };

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
      setImageUrl(b64);
    } else setImageUrl("");
  };

  const openEdit = (record) => {
    setEditItem(record);
    setImageUrl("");
    setFileList([]);
    form.setFieldsValue({ name: record.name, company: record.company, phone: record.phone, email: record.email, address: record.address, status: record.status });
  };

  const onEditFinish = async (values) => {
    try {
      const res = await fetch(BASE + "/api/suppliers/update-supplier", {
        method: "PUT",
        body: JSON.stringify({ ...values, img: imageUrl || editItem.img, supplierId: editItem._id }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 200) { message.success("Supplier updated!"); setEditItem(null); fetchSuppliers(); }
      else message.error("Update failed!");
    } catch (e) { message.error("Something went wrong!"); }
  };

  const columns = [
    { title: "SL", key: "i", render: (_, __, i) => i + 1, width: 60 },
    {
      title: "Photo", dataIndex: "img", key: "img", width: 100,
      render: (img) => img
        ? <img src={img} alt="" style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", border: "2px solid #e5e7eb" }} />
        : <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, border: "2px solid #e5e7eb" }}>
            <UserOutlined style={{ color: "#4f46e5" }} />
          </div>
    },
    { title: "Name", dataIndex: "name", key: "name", render: (text) => <span style={{ fontWeight: 600, color: "#111827" }}>{text}</span> },
    { title: "Company", dataIndex: "company", key: "company" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (s) => (
        <Tag style={{
          background: s ? "#d1fae5" : "#fee2e2",
          color: s ? "#10b981" : "#ef4444",
          border: "none",
          fontWeight: 600,
          padding: "4px 12px",
          borderRadius: 6
        }}>
          {s ? "Active" : "Inactive"}
        </Tag>
      )
    },
    {
      title: "Action", key: "action", width: 150,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
            style={{ background: "#4f46e5", borderColor: "#4f46e5", color: "white" }}
          >
            Edit
          </Button>
          <Popconfirm title="Delete this supplier?" okText="Yes" cancelText="No" onConfirm={() => handleDelete(record._id)}>
            <Button size="small" danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

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
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#111827' }}>Suppliers</h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>
            Manage your supplier contacts
          </p>
        </div>

        <div style={{ padding: 40 }}>
          <div style={{
            background: 'white',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid #e5e7eb',
              background: '#f9fafb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#111827' }}>List of Suppliers</h3>
                <p style={{ fontSize: 14, color: '#6b7280', margin: '6px 0 0' }}>
                  {suppliers.length} suppliers total
                </p>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/suppliers/add")}
                style={{
                  background: '#4f46e5',
                  borderColor: '#4f46e5',
                  height: 40,
                  fontWeight: 600,
                  fontSize: 14
                }}
              >
                Add New Supplier
              </Button>
            </div>

            <div style={{ padding: 32 }}>
              <Table
                dataSource={suppliers}
                columns={columns}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} suppliers` }}
                scroll={{ x: 1000 }}
                style={{ fontSize: 14 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        title={<span style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Edit Supplier</span>}
        open={!!editItem}
        onCancel={() => { setEditItem(null); setFileList([]); setImageUrl(""); }}
        footer={null}
        width={600}
      >
        <Form layout="vertical" form={form} onFinish={onEditFinish}>
          <Form.Item label={<span style={{ fontWeight: 600, color: "#111827" }}>Photo</span>}>
            <Upload listType="picture-card" fileList={fileList} onChange={handleImgChange} beforeUpload={() => false} maxCount={1}>
              {fileList.length >= 1 ? null : <div><PlusOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>}
            </Upload>
            {!imageUrl && editItem?.img && (
              <img src={editItem.img} alt="" style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", marginTop: 8 }} />
            )}
          </Form.Item>

          <Form.Item label={<span style={{ fontWeight: 600, color: "#111827" }}>Full Name</span>} name="name" rules={[{ required: true, message: "Required!" }]}>
            <Input size="large" style={{ height: 48 }} />
          </Form.Item>

          <Form.Item label={<span style={{ fontWeight: 600, color: "#111827" }}>Company Name</span>} name="company">
            <Input size="large" style={{ height: 48 }} />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item label={<span style={{ fontWeight: 600, color: "#111827" }}>Phone Number</span>} name="phone" rules={[{ required: true, message: "Required!" }]}>
              <Input size="large" style={{ height: 48 }} />
            </Form.Item>
            <Form.Item label={<span style={{ fontWeight: 600, color: "#111827" }}>Email</span>} name="email" rules={[{ required: true, message: "Required!" }]}>
              <Input size="large" style={{ height: 48 }} />
            </Form.Item>
          </div>

          <Form.Item label={<span style={{ fontWeight: 600, color: "#111827" }}>Address</span>} name="address">
            <Input size="large" style={{ height: 48 }} />
          </Form.Item>

          <Form.Item label={<span style={{ fontWeight: 600, color: "#111827" }}>Status</span>} name="status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <Button onClick={() => { setEditItem(null); setFileList([]); setImageUrl(""); }} size="large" style={{ height: 48 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" size="large" style={{ height: 48, background: "#4f46e5", borderColor: "#4f46e5" }}>
              Update Supplier
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SupplierPage;
