import { Form, Modal, Input, Select, Card, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const CreateInvoice = ({ isModalOpen, setIsModalOpen }) => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
            subTotal: cart?.total?.toFixed(2),
            tax: ((cart.total * cart.tax) / 100).toFixed(2),
            totalAmount: (cart.total + (cart.total * cart.tax) / 100).toFixed(2),
            cartItems: cart.cartItems,
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
            <span>
              Rs {cart.total.toFixed(2) > 0 ? cart.total.toFixed(2) : 0}
            </span>
          </div>
          <div className="flex justify-between my-2">
            <span>VAT %{cart.tax}</span>
            <span className="text-red-600">
              {(cart.total * cart.tax) / 100 > 0
                ? `+Rs ${((cart.total * cart.tax) / 100).toFixed(2)}`
                : 0}
            </span>
          </div>
          <div className="flex justify-between">
            <b>Total</b>
            <b>
              {" "}
              Rs {(cart.total + (cart.total * cart.tax) / 100).toFixed(2) > 0
                ? (cart.total + (cart.total * cart.tax) / 100).toFixed(2)
                : 0}
            </b>
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
