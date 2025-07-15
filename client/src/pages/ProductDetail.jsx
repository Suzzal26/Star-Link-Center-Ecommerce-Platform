import { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../contexts/CartContext";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const imageRef = useRef(null);
  const zoomLensRef = useRef(null);
  const zoomPreviewRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/v1/products/${id}`
        );
        data.image = data.image?.startsWith("http")
          ? data.image
          : `http://localhost:5000/uploads/${data.image}`;
        setProduct(data);
      } catch (err) {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
    else {
      setError("Invalid product ID.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const moveLens = (e) => {
      if (!imageRef.current || !zoomLensRef.current || !zoomPreviewRef.current)
        return;

      const image = imageRef.current;
      const lens = zoomLensRef.current;
      const preview = zoomPreviewRef.current;

      const rect = image.getBoundingClientRect();
      const x = e.clientX - rect.left - lens.offsetWidth / 2;
      const y = e.clientY - rect.top - lens.offsetHeight / 2;

      const maxX = image.offsetWidth - lens.offsetWidth;
      const maxY = image.offsetHeight - lens.offsetHeight;

      const clampedX = Math.max(0, Math.min(x, maxX));
      const clampedY = Math.max(0, Math.min(y, maxY));

      lens.style.left = clampedX + "px";
      lens.style.top = clampedY + "px";

      const scale = 2;
      preview.style.backgroundPosition = `-${clampedX * scale}px -${
        clampedY * scale
      }px`;
    };

    const showZoom = () => {
      zoomLensRef.current.style.display = "block";
      zoomPreviewRef.current.style.display = "block";
    };

    const hideZoom = () => {
      zoomLensRef.current.style.display = "none";
      zoomPreviewRef.current.style.display = "none";
    };

    const image = imageRef.current;
    const preview = zoomPreviewRef.current;

    if (image && preview && product?.image) {
      preview.style.backgroundImage = `url(${product.image})`;
      image.addEventListener("mousemove", moveLens);
      image.addEventListener("mouseenter", showZoom);
      image.addEventListener("mouseleave", hideZoom);
    }

    return () => {
      if (image) {
        image.removeEventListener("mousemove", moveLens);
        image.removeEventListener("mouseenter", showZoom);
        image.removeEventListener("mouseleave", hideZoom);
      }
    };
  }, [product]);

  if (loading) return <h2 className="loading">Loading...</h2>;
  if (error) return <h2 className="error-message">{error}</h2>;
  if (!product)
    return <h2 className="error-message">No product details available.</h2>;

  return (
    <div className="product-detail-page">
      <div className="product-container">
        <div className="product-card">
          <div className="zoom-container">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
              ref={imageRef}
              onError={(e) => (e.target.src = "/placeholder.jpg")}
            />
            <div className="zoom-lens" ref={zoomLensRef}></div>
            <div className="zoom-preview" ref={zoomPreviewRef}></div>
          </div>
        </div>

        <div className="product-detail">
          <h2>{product.name}</h2>
          <h4 className="product-price">Rs. {product.price}</h4>

          <button className="add-to-cart" onClick={() => addToCart(product)}>
            Add to Cart
          </button>

          <div
            className="product-description"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
