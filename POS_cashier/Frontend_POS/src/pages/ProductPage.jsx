import HorizontalNavbar from "../components/navbar/HorizontalNavbar";
import Edit from "../components/products/Edit";

const ProductPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#f5f7ff", minHeight: "100vh" }}>
      <HorizontalNavbar />
      <div style={{ marginTop: 100, width: "100%" }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid #E5E7EB',
          padding: '24px 40px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#111827' }}>Products</h1>
          <p style={{ fontSize: 15, color: '#6B7280', margin: '6px 0 0', fontWeight: 500 }}>
            Manage your product inventory
          </p>
        </div>

        <div style={{ padding: 40 }}>
          <Edit />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

