import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ProductAdd = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    subcategory: "",
    stock: "",
    image: null,
    imagePreview: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name}:`, value); // Debugging log
    if (name === "stock") {
      setProduct({ ...product, stock: Number(value) || 0 });
    } else if (name === "category") {
      setProduct({ ...product, category: value, subcategory: "" });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleDescriptionChange = (content) => {
    setProduct({ ...product, description: content });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProduct({
      ...product,
      image: file,
      imagePreview: file ? URL.createObjectURL(file) : null,
    });
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
      formData.append("category", product.category);
      formData.append("subcategory", product.subcategory || "None"); // ✅ Ensuring it's never undefined
      formData.append("stock", product.stock);

      if (product.image) {
        formData.append("image", product.image);
      }

      // Debugging: Log FormData before sending
      for (let pair of formData.entries()) {
        console.log(`📦 ${pair[0]}:`, pair[1]);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post("http://localhost:5000/api/v1/products", formData, config);
      console.log("✅ Product Added Successfully!", response.data);

      navigate("/admin/products");
    } catch (error) {
      console.error("❌ Error adding product:", error.response?.data?.message || error.message);
    }
  };

  const getSubcategories = (category) => {
    const subcategories = {
      Printer: ["Dot-Matrix", "ID Card", "Inkjet", "Laser", "Photo", "Ink Cartridge", "Ribbon Cartridge", "Other Printer Components"],
      Computer: ["All-in-One PC", "Monitor", "CPU", "Refurbished", "Laptop", "Cooling Fan", "Graphic Card", "Processor", "Power Supply Unit", "RAM", "Motherboard", "Keyboards", "Mouse", "SSD"],
      Projector: [],
      POS: ["Barcode Label Printer", "Barcode Label Sticker", "Barcode Scanner", "Cash Drawer", "POS Printer", "POS Terminal", "Paper Roll", "Ribbon"],
      Other: ["CCTV", "HDD", "Headphones", "ID Card", "Power Strip", "Speaker", "Bag", "Web Cam", "Miscellaneous"],
    };
    return subcategories[category] || [];
  };

  return (
    <div className="container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
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
          <label>Description (Supports formatting)</label>
          <ReactQuill theme="snow" value={product.description} onChange={handleDescriptionChange} />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            className="form-control"
            value={product.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
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
              required
            >
              <option value="">Select Subcategory</option>
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
          {product.imagePreview && (
            <div className="mt-2">
              <img src={product.imagePreview} alt="Preview" width="100" height="100" />
            </div>
          )}
        </div>

        <br />
        <button type="submit" className="btn btn-success">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ProductAdd;
