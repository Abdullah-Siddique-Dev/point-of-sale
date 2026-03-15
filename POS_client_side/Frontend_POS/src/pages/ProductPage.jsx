import Sidebar from "../components/sidebar/Sidebar";
import Edit from "../components/products/Edit";
import { UserOutlined } from "@ant-design/icons";

const ProductPage = () => {
  const user = JSON.parse(localStorage.getItem("postUser"));

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div style={{ marginLeft: "220px", width: "calc(100% - 220px)" }}>
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">All Products</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <UserOutlined />
            <span className="text-sm font-medium">{user?.username || "Admin"}</span>
          </div>
        </div>
        <div className="p-5">
          <Edit />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
