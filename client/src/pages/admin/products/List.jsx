import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./List.css";

const ProductList = () => {
  const { category: urlCategory } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const allCategories = ["Printer", "Computer", "Projector", "POS", "Other"];
  const allSubcategories = {
    Printer: [
      "Dot-Matrix",
      "ID Card",
      "Inkjet",
      "Laser",
      "Photo",
      "Ink Cartridge",
      "Ribbon Cartridge",
      "Other Printer Components",
    ],
    Computer: [
      "All-in-One PC",
      "Monitor",
      "CPU",
      "Refurbished",
      "Laptop",
      "Cooling Fan",
      "Graphic Card",
      "Processor",
      "Power Supply Unit",
      "RAM",
      "Motherboard",
      "Keyboards",
      "Mouse",
      "SSD",
    ],
    Projector: [],
    POS: [
      "Barcode Label Printer",
      "Barcode Label Sticker",
      "Barcode Scanner",
      "Cash Drawer",
      "POS Printer",
      "POS Terminal",
      "Paper Roll",
      "Ribbon",
    ],
    Other: [
      "CCTV",
      "HDD",
      "Headphones",
      "ID Card",
      "Power Strip",
      "Speaker",
      "Bag",
      "Web Cam",
      "Miscellaneous",
    ],
  };

  const fetchProducts = useCallback(async () => {
    try {
      let url = "http://localhost:5000/api/v1/products";
      const params = [];

      if (selectedCategory) params.push(`category=${selectedCategory}`);
      if (selectedSubcategory)
        params.push(`subcategory=${selectedSubcategory}`);

      if (params.length > 0) {
        url += "?" + params.join("&");
      }

      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  }, [selectedCategory, selectedSubcategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="container">
      <h2>Product List {urlCategory ? `(${urlCategory})` : ""}</h2>
      <Link to="/admin/products/add" className="btn btn-primary">
        Add New Product
      </Link>
      <br />
      <br />

      {/* Filters */}
      <div className="row">
        <div className="col-md-6">
          <label>Filter by Category:</label>
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory(""); // Reset subcategory
            }}
          >
            <option value="">All</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label>Filter by Subcategory:</label>
          <select
            className="form-control"
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            disabled={!selectedCategory}
          >
            <option value="">All</option>
            {selectedCategory &&
              allSubcategories[selectedCategory]?.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Product Table */}
      <table className="table mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Price (Rs.)</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-list-image"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.subcategory || "N/A"}</td>
                <td>Rs. {product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <Link
                    to={`/admin/products/edit/${product._id}`}
                    className="btn btn-warning btn-sm"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
