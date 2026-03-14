import { useEffect, useState } from "react";
import "./style.css";

const Categories = ({ categories, setCategories, products, setFiltered }) => {
  const [categoryTitle, setCategoryTitle] = useState("All");

  useEffect(() => {
    if (categoryTitle === "All") {
      setFiltered(products);
    } else {
      setFiltered(
        products.filter((product) => product.category === categoryTitle)
      );
    }
  }, [products, setFiltered, categoryTitle]);

  return (
    <ul className="flex gap-4 md:flex-col flex-row text-lg overflow-x-auto">
      {categories.map((item) => (
        <li
          className={`category-item ${
            item.title === categoryTitle && "!bg-pink-700"
          }`}
          key={item._id}
          onClick={() => setCategoryTitle(item.title)}
        >
          <span>{item.title}</span>
        </li>
      ))}
    </ul>
  );
};

export default Categories;
