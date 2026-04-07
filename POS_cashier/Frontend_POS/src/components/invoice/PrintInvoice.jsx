import { Modal, Button } from "antd";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { PrinterOutlined } from "@ant-design/icons";

const PrintInvoice = ({ isModalOpen, setIsModalOpen, printData }) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({ content: () => componentRef.current });

  return (
    <Modal title="Invoice Details" open={isModalOpen} footer={null}
      onCancel={() => setIsModalOpen(false)} width={600}>
      <div ref={componentRef} style={{ padding: 24, fontFamily: "Arial, sans-serif", fontSize: 13 }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 22, fontWeight: "bold", margin: 0 }}>POS System</h2>
          <p style={{ color: "#6b7280", margin: "4px 0 0" }}>Sales Invoice</p>
        </div>
        <hr />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "12px 0" }}>
          <div><b>Order ID:</b> {printData?.orderId}</div>
          <div><b>Date:</b> {printData?.createdAt?.substring(0, 10)}</div>
          <div><b>Customer:</b> {printData?.customerName}</div>
          <div><b>Phone:</b> {printData?.customerPhoneNumber}</div>
          <div><b>Payment:</b> {printData?.paymentMode}</div>
          <div><b>Status:</b> {printData?.status || "Delivered"}</div>
        </div>
        <hr />
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb", color: "#374151" }}>
              <th style={{ textAlign: "left", padding: "6px 0" }}>Product</th>
              <th style={{ textAlign: "center" }}>Qty</th>
              <th style={{ textAlign: "right" }}>Unit Price</th>
              <th style={{ textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {printData?.cartItems?.map((item, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "6px 0" }}>{item.title}</td>
                <td style={{ textAlign: "center" }}>{item.quantity}</td>
                <td style={{ textAlign: "right" }}>Rs {item.price}</td>
                <td style={{ textAlign: "right" }}>Rs {(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr style={{ marginTop: 10 }} />
        <div style={{ textAlign: "right", marginTop: 8 }}>
          <p>Subtotal: Rs {printData?.subTotal}</p>
          <p style={{ color: "#ef4444" }}>VAT: +Rs {printData?.tax}</p>
          <p style={{ fontWeight: "bold", fontSize: 16 }}>Grand Total: Rs {printData?.totalAmount}</p>
        </div>
        <div style={{ textAlign: "center", marginTop: 20, color: "#9ca3af", fontSize: 11 }}>
          Thank you for your business!
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}
          style={{ background: "#ec4899", borderColor: "#ec4899" }}>Print Invoice</Button>
      </div>
    </Modal>
  );
};

export default PrintInvoice;
