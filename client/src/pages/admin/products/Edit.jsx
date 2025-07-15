import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Edit.css";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    subcategory: "",
    stock: "",
    image: null,
    existingImage: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/v1/products/${id}`
        );
        setProduct((prev) => ({
          ...prev,
          name: data.name,
          price: data.price,
          description: data.description || "",
          category: data.category || prev.category,
          subcategory: data.subcategory || prev.subcategory,
          stock: data.stock,
          existingImage: data.image
            ? `http://localhost:5000/uploads/${data.image}`
            : prev.existingImage,
        }));
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching product:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (content) => {
    setProduct({ ...product, description: content });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProduct({ ...product, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found. Please log in as admin.");
        return;
      }

      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("description", product.description);
      if (product.category) formData.append("category", product.category);
      if (product.subcategory)
        formData.append("subcategory", product.subcategory);
      formData.append("stock", product.stock);
      if (product.image) formData.append("image", product.image);

      await axios.put(`http://localhost:5000/api/v1/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Product Updated Successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error(
        "❌ Error updating product:",
        error.response?.data || error.message
      );
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found. Please log in as admin.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/v1/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Product Deleted Successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error(
        "❌ Error deleting product:",
        error.response?.data || error.message
      );
    }
  };

  const getSubcategories = (category) => {
    const subcategories = {
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
    return subcategories[category] || [];
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Edit Product</h2>
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price (Rs.)</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <ReactQuill
            theme="snow"
            value={product.description}
            onChange={handleDescriptionChange}
          />
        </div>

        <div className="form-group">
          <label>Category (Optional)</label>
          <select
            name="category"
            className="form-control"
            value={product.category}
            onChange={handleChange}
          >
            <option value="">No Change</option>
            <option value="Computer">Computer</option>
            <option value="Printer">Printer</option>
            <option value="Projector">Projector</option>
            <option value="POS">POS</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {product.category && getSubcategories(product.category).length > 0 && (
          <div className="form-group">
            <label>Subcategory</label>
            <select
              name="subcategory"
              className="form-control"
              value={product.subcategory}
              onChange={handleChange}
            >
              <option value="">No Change</option>
              {getSubcategories(product.category).map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            className="form-control"
            value={product.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Product Image</label>
          <input
            type="file"
            name="image"
            className="form-control"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleImageChange}
          />
        </div>

        {product.existingImage && (
          <div className="form-group mt-3">
            <label>Current Image:</label>
            <br />
            <img
              src={product.existingImage}
              alt="Product"
              className="img-thumbnail current-product-image"
            />
          </div>
        )}

        <br />
        <button type="submit" className="btn btn-primary">
          Update Product
        </button>
        <span className="button-spacer"></span>
        <button type="button" className="btn btn-danger" onClick={handleDelete}>
          Delete Product
        </button>
      </form>
    </div>
  );
};

export default ProductEdit;
