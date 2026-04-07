import { useEffect } from "react";
import ProductItem from "./ProductItem";

const Products = ({
  products,
  setProducts,
  filtered,
  searched,
}) => {
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(
          process.env.REACT_APP_SERVER_URL + "/api/products/get-all"
        );
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, []);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '20px',
      width: '100%'
    }}>
      {filtered
        .filter((product) => product.title.toLowerCase().includes(searched))
        .map((item, i) => (
          <ProductItem item={item} key={i} />
        ))}
    </div>
  );
};

export default Products;
