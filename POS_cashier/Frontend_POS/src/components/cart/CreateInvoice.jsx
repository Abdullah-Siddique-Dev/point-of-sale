import { Form, Modal, Input, Select, Card, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const CreateInvoice = ({ isModalOpen, setIsModalOpen }) => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("postUser"));
  const [activeTax, setActiveTax] = useState(null);

  // Fetch active tax when modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchActiveTax();
    }
  }, [isModalOpen]);

  const fetchActiveTax = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL + "/api/tax/active");
      const data = await response.json();
      setActiveTax(data);
    } catch (error) {
      console.error("Error fetching active tax:", error);
      setActiveTax(null);
    }
  };

  // Calculate tax amounts
  const subtotal = cart?.total || 0;
  const taxPercentage = activeTax?.taxPercentage || 0;
  const taxAmount = (subtotal * taxPercentage) / 100;
  const grandTotal = subtotal + taxAmount;

  const onFinish = async (values) => {
    try {
      const orderId = "ORD-" + Date.now();
      var res = await fetch(
        process.env.REACT_APP_SERVER_URL + "/api/invoices/add-invoice",
        {
          method: "POST",
          body: JSON.stringify({
            ...values,
            orderId,
            cashierName: user?.username || "Cashier",
            subTotal: subtotal.toFixed(2),
            tax: taxAmount.toFixed(2),
            totalAmount: grandTotal.toFixed(2),
            cartItems: cart.cartItems,
            // NEW: Tax details
            taxName: activeTax?.taxName || null,
            taxPercentage: taxPercentage,
            taxAmount: taxAmount.toFixed(2),
          }),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        }
      );

      if (res.status === 200) {
        message.success("Invoice created successfully.");
        setIsModalOpen(false);
        dispatch(reset());
        navigate("/invoices");
      }
    } catch (error) {
      message.error("Transaction Failed.");
      console.log(error);
    }
  };

  return (
    <Modal
      title="Create Invoice"
      open={isModalOpen}
      footer={false}
      onCancel={() => setIsModalOpen(false)}
    >
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name={"customerName"}
          label="Customer Name"
          rules={[{ required: true, message: "Please enter a name!" }]}
        >
          <Input placeholder="Enter customer name..." />
        </Form.Item>
        <Form.Item
          name={"customerPhoneNumber"}
          label="Phone Number"
          rules={[
            { required: true, message: "Please enter a phone number!" },
          ]}
        >
          <Input
            placeholder="Enter phone number..."
            maxLength={11}
            type="number"
          />
        </Form.Item>
        <Form.Item
          name={"paymentMode"}
          label="Payment Method"
          rules={[
            { required: true, message: "Please select a payment method!" },
          ]}
        >
          <Select placeholder="Select payment method...">
            <Select.Option value="Cash">Cash</Select.Option>
            <Select.Option value="Credit Card">Credit Card</Select.Option>
          </Select>
        </Form.Item>
        <Card className="w-full">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between my-2">
            <span>{activeTax ? `${activeTax.taxName} (${taxPercentage}%)` : 'Tax (0%)'}</span>
            <span className="text-red-600">
              {taxAmount > 0 ? `+Rs ${taxAmount.toFixed(2)}` : 'Rs 0.00'}
            </span>
          </div>
          <div className="flex justify-between">
            <b>Grand Total</b>
            <b>Rs {grandTotal.toFixed(2)}</b>
          </div>
          <div className="flex justify-end">
            <Button
              size="medium"
              type="primary"
              className="mt-4"
              onClick={() => setIsModalOpen(true)}
              htmlType="submit"
            >
              Create Order
            </Button>
          </div>
        </Card>
      </Form>
    </Modal>
  );
};

export default CreateInvoice;
