import { Button, Form, Input, Modal, Select, message, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const Add = ({
  isAddModalOpen,
  setIsAddModalOpen,
  products,
  setProducts,
  categories,
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [fileList, setFileList] = useState([]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleChange = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const base64 = await getBase64(newFileList[0].originFileObj);
      setImageUrl(base64);
    } else {
      setImageUrl("");
    }
  };

  const onFinish = (value) => {
    try {
      const productData = {
        ...value,
        img: imageUrl || "https://via.placeholder.com/150",
      };

      fetch(process.env.REACT_APP_SERVER_URL + "/api/products/add-product", {
        method: "POST",
        body: JSON.stringify(productData),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      message.success("Product added successfully.");
      setIsAddModalOpen(false);
      form.resetFields();
      setFileList([]);
      setImageUrl("");
      setProducts([
        ...products,
        {
          _id: Math.random(),
          title: value.title,
          img: imageUrl || "https://via.placeholder.com/150",
          price: Number(value.price),
          category: value.category,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal
      title="Add New Product"
      open={isAddModalOpen}
      onCancel={() => {
        setIsAddModalOpen(false);
        setFileList([]);
        setImageUrl("");
        form.resetFields();
      }}
      footer={false}
    >
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          label={"Product Name"}
          name="title"
          rules={[
            {
              required: true,
              message: "This field cannot be empty!",
            },
          ]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>
        <Form.Item label={"Product Image"}>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={() => false}
            maxCount={1}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item
          label={"Product Price"}
          name="price"
          rules={[
            {
              required: true,
              message: "This field cannot be empty!",
            },
          ]}
        >
          <Input placeholder="Enter product price" type="number" />
        </Form.Item>
        <Form.Item
          label={"Select Category"}
          name="category"
          rules={[
            {
              required: true,
              message: "This field cannot be empty!",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Type to select category"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.title ?? "").includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.title ?? "")
                .toLowerCase()
                .localeCompare((optionB?.title ?? "").toLowerCase())
            }
            options={categories.map((item, i) => {
              return { value: item.title, label: item.title };
            })}
          />
        </Form.Item>
        <Form.Item className="flex justify-end mb-0">
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Add;
