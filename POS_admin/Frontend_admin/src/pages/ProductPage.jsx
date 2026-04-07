import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Table, Button, Popconfirm, message, Modal, Form, Input, Select, Upload, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchProducts = () =>
    fetch(process.env.REACT_APP_SERVER_URL + "/api/products/get-all")
      .then((r) => r.json()).then(setProducts).catch(console.log);

  useEffect(() => {
    fetchProducts();
    fetch(process.env.REACT_APP_SERVER_URL + "/api/categories/get-all")
      .then((r) => r.json()).then(setCategories).catch(console.log);
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/products/delete-product", {
        method: "DELETE",
        body: JSON.stringify({ productId: id }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 200) { message.success("Product deleted!"); fetchProducts(); }
      else message.error("Delete failed!");
    } catch (e) { message.error("Something went wrong!"); }
  };

  const getBase64 = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
  });

  const handleChange = async ({ fileList: fl }) => {
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
    form.setFieldsValue({ title: record.title, price: record.price, category: record.category });
  };

  const onEditFinish = async (values) => {
    try {
      const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/products/update-product", {
        method: "PUT",
        body: JSON.stringify({ ...values, img: imageUrl || editItem.img, productId: editItem._id }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 200) { message.success("Product updated!"); setEditItem(null); fetchProducts(); }
      else message.error("Update failed!");
    } catch (e) { message.error("Something went wrong!"); }
  };

  const columns = [
    { title: "SL", key: "i", render: (_, __, i) => i + 1, width: 60 },
    {
      title: "Image", dataIndex: "img", key: "img", width: 80,
      render: (img) => img ? (
        <img src={img} alt="" style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8, border: '1px solid var(--border-dark)' }} />
      ) : <div style={{ width: 50, height: 50, background: 'var(--bg-hover)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-gray)' }}>—</div>
    },
    { title: "Product Name", dataIndex: "title", key: "title" },
    { title: "Price", dataIndex: "price", key: "price", render: (p) => <span style={{ fontWeight: 600, color: 'var(--success)' }}>Rs {p}</span> },
    {
      title: "Category", dataIndex: "category", key: "category",
      render: (cat) => <Tag style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', fontWeight: 600 }}>{cat}</Tag>
    },
    {
      title: "Action", key: "action", width: 150,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
            style={{ background: 'var(--primary)', borderColor: 'var(--primary)', color: 'white' }}
          >
            Edit
          </Button>
          <Popconfirm title="Delete this product?" okText="Yes" cancelText="No" onConfirm={() => handleDelete(record._id)}>
            <Button size="small" danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

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
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: 'var(--text-light)' }}>Products</h1>
          <p style={{ fontSize: 15, color: 'var(--text-gray)', margin: '6px 0 0', fontWeight: 500 }}>
            Manage your product inventory
          </p>
        </div>

        <div style={{ padding: 40 }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 12,
            border: '1px solid var(--border-dark)',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid var(--border-dark)',
              background: 'var(--bg-hover)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--text-light)' }}>All Products</h3>
                <p style={{ fontSize: 14, color: 'var(--text-gray)', margin: '6px 0 0' }}>
                  {products.length} products total
                </p>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/products/add")}
                style={{
                  background: 'var(--primary)',
                  borderColor: 'var(--primary)',
                  height: 40,
                  fontWeight: 600,
                  fontSize: 14
                }}
              >
                Add Product
              </Button>
            </div>

            <div style={{ padding: 32 }}>
              <Table
                dataSource={products}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} products` }}
                scroll={{ x: 900 }}
                style={{ fontSize: 14 }}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={<span style={{ color: 'var(--text-light)', fontSize: 20, fontWeight: 700 }}>Edit Product</span>}
        open={!!editItem}
        onCancel={() => { setEditItem(null); setFileList([]); setImageUrl(""); }}
        footer={null}
        width={600}
      >
        <Form layout="vertical" form={form} onFinish={onEditFinish}>
          <Form.Item
            label={<span style={{ color: 'var(--text-light)', fontWeight: 600 }}>Product Name</span>}
            name="title"
            rules={[{ required: true, message: "Required!" }]}
          >
            <Input size="large" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-dark)', color: 'var(--text-light)' }} />
          </Form.Item>

          <Form.Item label={<span style={{ color: 'var(--text-light)', fontWeight: 600 }}>Product Image</span>}>
            <Upload listType="picture-card" fileList={fileList} onChange={handleChange} beforeUpload={() => false} maxCount={1}>
              {fileList.length >= 1 ? null : <div><PlusOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>}
            </Upload>
            {!imageUrl && editItem?.img && (
              <img src={editItem.img} alt="current" style={{ width: 80, height: 80, objectFit: "cover", marginTop: 8, borderRadius: 8 }} />
            )}
          </Form.Item>

          <Form.Item
            label={<span style={{ color: 'var(--text-light)', fontWeight: 600 }}>Price (Rs)</span>}
            name="price"
            rules={[{ required: true, message: "Required!" }]}
          >
            <Input type="number" size="large" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-dark)', color: 'var(--text-light)' }} />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: 'var(--text-light)', fontWeight: 600 }}>Category</span>}
            name="category"
            rules={[{ required: true, message: "Required!" }]}
          >
            <Select size="large" options={categories.map((c) => ({ value: c.title, label: c.title }))} />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <Button onClick={() => { setEditItem(null); setFileList([]); setImageUrl(""); }} size="large">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" size="large" style={{ background: 'var(--primary)', borderColor: 'var(--primary)' }}>
              Update Product
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductPage;
