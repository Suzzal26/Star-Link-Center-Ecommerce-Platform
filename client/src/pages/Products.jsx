import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // ✅ Get category & subcategory from URL
import axios from "axios";
import { Link } from "react-router-dom";
import "./Products.css"; // Import the scoped CSS

const Products = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation(); // ✅ Get current URL
  const params = new URLSearchParams(location.search);
  const category = params.get("category"); // ✅ Extract category
  const subcategory = params.get("subcategory"); // ✅ Extract subcategory

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "http://localhost:5000/api/v1/products";

        if (category && subcategory) {
          url += `?category=${category}&subcategory=${subcategory}`;
        } else if (category) {
          url += `?category=${category}`;
        }

        console.log("🔍 Fetching from URL:", url); // ✅ Debugging
        const response = await axios.get(url);
        console.log("✅ API Response:", response.data); // ✅ Check if data is retrieved
        setProducts(response.data);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [category, subcategory]); // ✅ Runs when category/subcategory changes
  // ✅ Refetch when category/subcategory changes

  return (
    <div className="products-page">
      {" "}
      {/* Add a unique wrapper class */}
      <h2>Our Products</h2>
      {/* ✅ Display Category & Subcategory Titles */}
      {category && (
        <h3 className="category-title">
          Category: <span className="category-value">{category}</span>
        </h3>
      )}
      {subcategory && (
        <h4 className="subcategory-title">
          Subcategory: <span className="subcategory-value">{subcategory}</span>
        </h4>
      )}
      <div className="product-container">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="card">
                <img
                  className="product-image"
                  src={product.image}
                  alt={product.name}
                />
                <div className="card-body">
                  <span className="category-badge">{product.category}</span>
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">Rs. {product.price}</p>
                  <Link to={`/products/${product._id}`} className="btn">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;
