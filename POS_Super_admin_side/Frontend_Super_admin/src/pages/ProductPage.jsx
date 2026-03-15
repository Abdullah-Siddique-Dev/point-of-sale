import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Table, Button, Popconfirm, message, Modal, Form, Input, Select, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
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
    { title: "Image", dataIndex: "img", key: "img", render: (img) => img ? <img src={img} alt="" style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }} /> : "—" },
    { title: "Product Name", dataIndex: "title", key: "title" },
    { title: "Price", dataIndex: "price", key: "price", render: (p) => `Rs ${p}` },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Action", key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button size="small" type="primary" onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm title="Delete this product?" okText="Yes" cancelText="No" onConfirm={() => handleDelete(record._id)}>
            <Button size="small" danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", background: "#f3f4f6", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, width: "calc(100% - 220px)" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 24px", position: "sticky", top: 0, zIndex: 10 }}>
          <h1 style={{ fontSize: 20, fontWeight: "bold", margin: 0 }}>All Products</h1>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 8, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Products</h2>
              <Button type="primary" onClick={() => navigate("/products/add")}>+ Add Product</Button>
            </div>
            <Table dataSource={products} columns={columns} rowKey="_id" pagination={{ pageSize: 10 }} scroll={{ x: 800 }} />
          </div>
        </div>
      </div>

      <Modal title="Edit Product" open={!!editItem} onCancel={() => { setEditItem(null); setFileList([]); setImageUrl(""); }} footer={null}>
        <Form layout="vertical" form={form} onFinish={onEditFinish}>
          <Form.Item label="Product Name" name="title" rules={[{ required: true, message: "Required!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Product Image">
            <Upload listType="picture-card" fileList={fileList} onChange={handleChange} beforeUpload={() => false} maxCount={1}>
              {fileList.length >= 1 ? null : <div><PlusOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>}
            </Upload>
            {!imageUrl && editItem?.img && (
              <img src={editItem.img} alt="current" style={{ width: 80, height: 80, objectFit: "cover", marginTop: 8, borderRadius: 4 }} />
            )}
          </Form.Item>
          <Form.Item label="Price (Rs)" name="price" rules={[{ required: true, message: "Required!" }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Category" name="category" rules={[{ required: true, message: "Required!" }]}>
            <Select options={categories.map((c) => ({ value: c.title, label: c.title }))} />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="primary" htmlType="submit">Update</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductPage;
