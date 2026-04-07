import { Button, Popconfirm, message } from "antd";
import {
  ClearOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteProduct,
  increase,
  decrease,
  reset,
} from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const CartTotals = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const [activeTax, setActiveTax] = useState(null);

  // Fetch active tax on component mount
  useEffect(() => {
    fetchActiveTax();
  }, []);

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

  return (
    <div style={{
      height: '100%',
      maxHeight: 'calc(100vh - 140px)',
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      borderRadius: '16px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      overflow: 'hidden'
    }}>
      <h2 className="bg-blue-600 text-white p-4 font-bold tracking-wide" style={{ margin: 0, borderRadius: '16px 16px 0 0' }}>
        Cart Items
      </h2>
      <ul className="cart-items px-2 flex flex-col gap-y-3 pt-2 py-2" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {cart.cartItems.length > 0 ? (
          cart.cartItems
            .map((item) => (
              <li className="cart-item flex justify-between" key={item._id}>
                <div className="flex items-center">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-16 w-16 object-cover cursor-pointer"
                    onClick={() => dispatch(deleteProduct(item))}
                  />
                  <div className="flex flex-col pl-2">
                    <b>{item.title}</b>
                    <span>
                      Rs {item.price.toFixed(2)} x {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button
                    type="primary"
                    size="small"
                    className="w-full flex items-center justify-center !rounded-full"
                    icon={<PlusCircleOutlined />}
                    onClick={() => dispatch(increase(item))}
                  />
                  <span className="font-bold inline-block w-6 text-center">
                    {item.quantity}
                  </span>
                  <Button
                    type="primary"
                    size="small"
                    className="w-full flex items-center justify-center !rounded-full"
                    icon={<MinusCircleOutlined />}
                    onClick={() => {
                      if (item.quantity === 1) {
                        if (window.confirm("Delete Product?")) {
                          dispatch(decrease(item));
                          message.info("Product removed from cart.");
                        }
                      }
                      if (item.quantity > 1) {
                        dispatch(decrease(item));
                      }
                    }}
                  />
                </div>
              </li>
            ))
            .reverse()
        ) : (
          <div className="text-center mt-2 font-bold">No items in cart...</div>
        )}
      </ul>
      <div className="cart-totals mt-auto">
        <div className="border-b border-t">
          <div className="flex justify-between p-2">
            <b>Subtotal</b>
            <span>Rs {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between p-2">
            <b>{activeTax ? `${activeTax.taxName} (${taxPercentage}%)` : 'Tax (0%)'}</b>
            <span className="text-red-700">
              {taxAmount > 0 ? `+Rs ${taxAmount.toFixed(2)}` : 'Rs 0.00'}
            </span>
          </div>
        </div>
        <div className="border-b mt-4">
          <div className="flex justify-between p-2">
            <b className="text-xl text-green-500">Grand Total</b>
            <span className="text-xl">Rs {grandTotal.toFixed(2)}</span>
          </div>
        </div>
        <div className="py-4 px-2">
          <Button
            type="primary"
            size="large"
            className="w-full"
            disabled={cart.cartItems.length > 0 ? false : true}
            onClick={() => navigate("/cart")}
          >
            Create Order
          </Button>

          <Popconfirm
            title="Delete Product"
            description="Are you sure you want to delete this product?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => dispatch(reset())}
            className="w-full mt-2 flex items-center justify-center"
          >
            {cart.cartItems.length > 0 ? (
              <Button
                type="primary"
                size="large"
                className="w-full mt-2 flex items-center justify-center"
                icon={<ClearOutlined />}
                danger
                disabled={cart.cartItems.length > 0 ? false : true}
              >
                Delete
              </Button>
            ) : (
              ""
            )}
          </Popconfirm>
        </div>
      </div>
    </div>
  );
};

export default CartTotals;
