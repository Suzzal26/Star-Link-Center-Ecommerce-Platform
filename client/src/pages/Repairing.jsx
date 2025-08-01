import { Link } from "react-router-dom";
import { FaLaptop, FaPrint, FaHdd, FaMicrochip } from "react-icons/fa";
import "./Repairing.css";

const Repairing = () => {
  const services = [
    {
      icon: <FaLaptop />,
      title: "Laptop & Desktop Repair",
      description:
        "We fix all hardware and software issues for all major brands of laptops and desktops.",
      img: "/images/Laptop Repairing.jpg",
    },
    {
      icon: <FaPrint />,
      title: "Printer Repair",
      description:
        "Specialized repair services for inkjet, laser, and all-in-one printers.",
      img: "/images/Printer Repairing.jpg",
    },
    {
      icon: <FaHdd />,
      title: "Data Recovery",
      description:
        "Advanced data recovery solutions for failed hard drives and corrupted storage.",
      img: "/images/Data Recovery.jpg",
    },
    {
      icon: <FaMicrochip />,
      title: "Component Level Repair",
      description:
        "Expert motherboard and chipset repairs, including micro-soldering.",
      img: "/images/Component Level Repair.jpg",
    },
  ];

  return (
    <div className="repairing-page">
      {/* Hero Section */}
      <section className="repair-hero-section">
        <div className="container text-center text-white">
          <h1 className="repair-hero-title">Professional IT Repair Services</h1>
          <p className="repair-hero-subtitle">
            Expert technicians providing comprehensive repair and maintenance
            for all your IT equipment.
          </p>
          <Link to="/contact" className="btn btn-light btn-lg">
            Get a Free Quote
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="repair-services-grid">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Our Repair Expertise</h2>
            <p className="section-subtitle">
              We handle a wide variety of hardware issues with precision and
              care.
            </p>
          </div>
          <div className="row">
            {services.map((service, index) => (
              <div key={index} className="col-lg-6 mb-4">
                <div className="service-card">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="service-card-img"
                  />
                  <div className="service-card-body">
                    <div className="service-card-icon">{service.icon}</div>
                    <h5 className="service-card-title">{service.title}</h5>
                    <p className="service-card-text">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Our Simple Repair Process</h2>
          </div>
          <div className="row text-center">
            <div className="col-md-4">
              <div className="step-card">
                <div className="step-number">1</div>
                <h5 className="step-title">Submit a Request</h5>
                <p>Tell us about the issue and get an initial quote.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="step-card">
                <div className="step-number">2</div>
                <h5 className="step-title">We Diagnose</h5>
                <p>
                  Our technicians perform a detailed diagnosis of the problem.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="step-card">
                <div className="step-number">3</div>
                <h5 className="step-title">Get It Repaired</h5>
                <p>We repair your device and ensure it's working perfectly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Repairing;
