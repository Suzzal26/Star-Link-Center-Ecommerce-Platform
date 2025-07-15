import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaAward, FaTools, FaHeadset } from "react-icons/fa";
import {
  FaArrowRight,
  FaComputer,
  FaPrint,
  FaVideo,
  FaCashRegister,
} from "react-icons/fa6";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [printerProducts, setPrinterProducts] = useState([]);
  const [miscProducts, setMiscProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carouselSlides = [
    {
      img: "/images/A.jpg",
      title: "Powerful Computing Hardware",
      subtitle: "Explore our wide range of laptops, desktops, and components.",
    },
    {
      img: "/images/B.jpg",
      title: "Professional Repair Services",
      subtitle: "Expert technicians for all your IT equipment.",
    },
    {
      img: "/images/C.jpg",
      title: "Top-Tier IT Solutions",
      subtitle: "Reliable and efficient solutions for your business.",
    },
  ];

  const brandLogos = [
    "acer.png",
    "brother.png",
    "dell.png",
    "entrust.png",
    "epson.png",
    "hp.png",
    "lenovo.png",
    "microsoft.png",
    "msi.png",
  ];

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const { data } = await axios.get("/api/v1/products");
        // Limit featured products to 8
        setFeaturedProducts(data.sort(() => 0.5 - Math.random()).slice(0, 8));
        // Get printers
        setPrinterProducts(
          data.filter((p) => p.category.toLowerCase() === "printer")
        );
        // Get Miscellaneous items
        setMiscProducts(
          data.filter((p) => p.category.toLowerCase() === "miscellaneous")
        );
      } catch (error) {
        console.error("❌ Error fetching products:", error);
        setError("Could not load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const categoryIcons = {
    Computers: <FaComputer />,
    Printers: <FaPrint />,
    Projectors: <FaVideo />,
    "POS Systems": <FaCashRegister />,
  };

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="hero-swiper"
      >
        {carouselSlides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="hero-slide"
            style={{ "--hero-bg-image": `url(${slide.img})` }}
          >
            <div className="hero-content text-white text-center">
              <h1 className="hero-title-main">{slide.title}</h1>
              <p className="hero-subtitle-main">{slide.subtitle}</p>
              <Link to="/products" className="btn btn-primary btn-lg hero-btn">
                Shop Now <FaArrowRight className="ms-2" />
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Why Choose Us Section */}
      <section className="why-choose-us-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Why Choose Us?</h2>
            <p className="section-subtitle">
              Your reliable partner in IT solutions.
            </p>
          </div>
          <div className="row">
            <div className="col-md-4 text-center mb-4">
              <div className="choose-us-card">
                <FaAward className="choose-us-icon" />
                <h5 className="choose-us-title">Quality Products</h5>
                <p>
                  We provide only the best and genuine products from top brands.
                </p>
              </div>
            </div>
            <div className="col-md-4 text-center mb-4">
              <div className="choose-us-card">
                <FaTools className="choose-us-icon" />
                <h5 className="choose-us-title">Expert Repair</h5>
                <p>
                  Our certified technicians ensure your devices are in good
                  hands.
                </p>
              </div>
            </div>
            <div className="col-md-4 text-center mb-4">
              <div className="choose-us-card">
                <FaHeadset className="choose-us-icon" />
                <h5 className="choose-us-title">Dedicated Support</h5>
                <p>
                  We are here to help you with any IT-related issues you may
                  face.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="featured-products-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">
              Discover our top-quality IT products and equipment.
            </p>
          </div>
          {loading ? (
            <div className="text-center">Loading products...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={4}
              navigation
              loop={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                320: { slidesPerView: 1 },
                576: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                992: { slidesPerView: 4 },
              }}
              className="products-swiper"
            >
              {featuredProducts.map((product) => (
                <SwiperSlide key={product._id}>
                  <div className="product-card-main">
                    <Link to={`/products/${product._id}`}>
                      <img
                        src={
                          product.image ||
                          `https://picsum.photos/seed/${product._id}/400/300`
                        }
                        alt={product.name}
                        className="product-image-main"
                      />
                    </Link>
                    <div className="product-info-main">
                      <h5 className="product-name-main">{product.name}</h5>
                      <p className="product-price-main">Rs. {product.price}</p>
                      <Link
                        to={`/products/${product._id}`}
                        className="btn btn-outline-primary w-100"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="product-categories-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Product Categories</h2>
            <p className="section-subtitle">
              Explore our wide range of IT products and solutions.
            </p>
          </div>
          <div className="row">
            {Object.entries(categoryIcons).map(([category, icon]) => (
              <div key={category} className="col-lg-3 col-md-6 mb-4">
                <Link
                  to={`/products?category=${category}`}
                  className="category-card-main text-decoration-none"
                >
                  <div className="category-icon-main">{icon}</div>
                  <h5 className="category-title-main">{category}</h5>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Printers Section */}
      {printerProducts.length > 0 && (
        <section className="printers-section">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="section-title">Our Printers</h2>
              <p className="section-subtitle">
                High-quality printing solutions for home and office.
              </p>
            </div>
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={4}
              navigation
              loop={true}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              breakpoints={{
                320: { slidesPerView: 1 },
                576: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                992: { slidesPerView: 4 },
              }}
              className="products-swiper"
            >
              {printerProducts.map((product) => (
                <SwiperSlide key={product._id}>
                  <div className="product-card-main">
                    <Link to={`/products/${product._id}`}>
                      <img
                        src={
                          product.image ||
                          `https://picsum.photos/seed/${product._id}/400/300`
                        }
                        alt={product.name}
                        className="product-image-main"
                      />
                    </Link>
                    <div className="product-info-main">
                      <h5 className="product-name-main">{product.name}</h5>
                      <p className="product-price-main">Rs. {product.price}</p>
                      <Link
                        to={`/products/${product._id}`}
                        className="btn btn-outline-primary w-100"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* Miscellaneous Products Section */}
      {miscProducts.length > 0 && (
        <section className="misc-section">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="section-title">Miscellaneous Items</h2>
              <p className="section-subtitle">
                Other essential IT products and accessories.
              </p>
            </div>
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={4}
              navigation
              loop={true}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                320: { slidesPerView: 1 },
                576: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                992: { slidesPerView: 4 },
              }}
              className="products-swiper"
            >
              {miscProducts.map((product) => (
                <SwiperSlide key={product._id}>
                  <div className="product-card-main">
                    <Link to={`/products/${product._id}`}>
                      <img
                        src={
                          product.image ||
                          `https://picsum.photos/seed/${product._id}/400/300`
                        }
                        alt={product.name}
                        className="product-image-main"
                      />
                    </Link>
                    <div className="product-info-main">
                      <h5 className="product-name-main">{product.name}</h5>
                      <p className="product-price-main">Rs. {product.price}</p>
                      <Link
                        to={`/products/${product._id}`}
                        className="btn btn-outline-primary w-100"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* Brands Slider Section */}
      <section className="brands-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Our Brands</h2>
            <p className="section-subtitle">
              We partner with the leading brands in the industry.
            </p>
          </div>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={50}
            slidesPerView={6}
            loop={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            breakpoints={{
              320: { slidesPerView: 2 },
              576: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              992: { slidesPerView: 6 },
            }}
            className="brands-swiper"
          >
            {brandLogos.map((logo, index) => (
              <SwiperSlide key={index} className="brand-slide">
                <img
                  src={`/images/brands/${logo}`}
                  alt={`brand-logo-${index}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
};

export default Home;
