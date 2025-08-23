import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { API_URL } from "../../../constants";
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
        const { data } = await axios.get(`${API_URL}/products/${id}`);
        setProduct((prev) => ({
          ...prev,
          name: data.name,
          price: data.price,
          description: data.description || "",
          category: data.category || "",
          subcategory: data.subcategory || "",
          stock: data.stock || 0,
          existingImage: data.image || "",
        }));
      } catch (error) {
        console.error("❌ Error fetching product:", error);
      } finally {
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
    if (file) {
      setProduct({ ...product, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Unauthorized. Please login as admin.");

      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("description", product.description);
      if (product.category) formData.append("category", product.category);
      if (product.subcategory) formData.append("subcategory", product.subcategory);
      formData.append("stock", product.stock);
      if (product.image) formData.append("image", product.image);

      const response = await axios.put(`${API_URL}/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Product Updated Successfully!", response.data);
      navigate("/admin/products");
    } catch (error) {
      console.error("❌ Error updating product:", error.response?.data || error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Unauthorized. Please login as admin.");

      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Product Deleted Successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("❌ Error deleting product:", error.response?.data || error.message);
    }
  };

  const getSubcategories = (category) => {
    const subcategories = {
      computer: ["All-in-One PC", "Monitor", "CPU", "Refurbished", "Laptop", "Cooling Fan", "Graphic Card", "Processor", "Power Supply Unit", "RAM", "Motherboard", "Keyboards", "Mouse", "SSD"],
      printer: ["Dot-Matrix", "ID Card", "Inkjet", "Laser", "Photo", "Ink Cartridge", "Ribbon Cartridge", "Other Printer Components"],
      projector: [],
      pos: ["Barcode Label Printer", "Barcode Label Sticker", "Barcode Scanner", "Cash Drawer", "POS Printer", "POS Terminal", "Paper Roll", "Ribbon"],
      other: ["CCTV", "HDD", "Headphones", "ID Card", "Power Strip", "Speaker", "Bag", "Web Cam", "Miscellaneous"],
    };
    return subcategories[category?.toLowerCase()] || [];
  };

  if (loading) return <div className="container"><h2>Edit Product</h2><p>Loading...</p></div>;

  return (
    <div className="container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" className="form-control" value={product.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Price (Rs.)</label>
          <input type="number" name="price" className="form-control" value={product.price} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <ReactQuill theme="snow" value={product.description} onChange={handleDescriptionChange} modules={{ toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline", "strike"], [{ list: "ordered" }, { list: "bullet" }], ["link", "image"], ["clean"]] }} />
        </div>

        <div className="form-group">
          <label>Category (Optional)</label>
          <select name="category" className="form-control" value={product.category} onChange={handleChange}>
            <option value="">No Change</option>
            <option value="computer">Computer</option>
            <option value="printer">Printer</option>
            <option value="projector">Projector</option>
            <option value="pos">POS</option>
            <option value="other">Other</option>
          </select>
        </div>

        {product.category && getSubcategories(product.category).length > 0 && (
          <div className="form-group">
            <label>Subcategory</label>
            <select name="subcategory" className="form-control" value={product.subcategory} onChange={handleChange}>
              <option value="">No Change</option>
              {getSubcategories(product.category).map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Stock</label>
          <input type="number" name="stock" className="form-control" value={product.stock} onChange={handleChange} min="0" required />
        </div>

        <div className="form-group">
          <label>Product Image</label>
          <input type="file" name="image" className="form-control" accept="image/*" onChange={handleImageChange} />
        </div>

        {product.image && (
          <div className="form-group mt-3">
            <label>New Selected Image:</label>
            <br />
            <img src={URL.createObjectURL(product.image)} alt="New Preview" className="img-thumbnail current-product-image" />
          </div>
        )}

        {!product.image && product.existingImage && (
          <div className="form-group mt-3">
            <label>Current Image:</label>
            <br />
            <img src={product.existingImage} alt="Existing Product" className="img-thumbnail current-product-image" style={{ maxWidth: '200px', maxHeight: '200px' }} />
          </div>
        )}

        <br />
        <button type="submit" className="btn btn-primary">Update Product</button>
        <span className="button-spacer"></span>
        <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete Product</button>
      </form>
    </div>
  );
};

export default ProductEdit;