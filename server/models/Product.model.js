const mongoose = require("mongoose");

// ✅ Define allowed subcategories based on category
const subcategories = {
  computer: [
    "All-in-One PC", "Monitor", "CPU", "Refurbished", "Laptop", "Cooling Fan", 
    "Graphic Card", "Processor", "Power Supply Unit", "RAM", "Motherboard", 
    "Keyboards", "Mouse", "SSD"
  ],
  printer: [
    "Dot-Matrix", "ID Card", "Inkjet", "Laser", "Photo", "Ink Cartridge", 
    "Ribbon Cartridge", "Other Printer Components"
  ],
  projector: [],
  pos: [
    "Barcode Label Printer", "Barcode Label Sticker", "Barcode Scanner", 
    "Cash Drawer", "POS Printer", "POS Terminal", "Paper Roll", "Ribbon"
  ],
  other: [
    "CCTV", "HDD", "Headphones", "ID Card", "Power Strip", "Speaker", 
    "Bag", "Web Cam", "Miscellaneous"
  ]
};

// ✅ Product Schema for Cloudinary setup
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      required: true, 
      enum: Object.keys(subcategories),
      set: value => value.trim().toLowerCase()
    },
    subcategory: { 
      type: String,
      validate: {
        validator: function(value) {
          if (!value) return true;
          return subcategories[this.category]?.includes(value);
        },
        message: props => `Invalid subcategory "${props.value}" for category "${props.instance.category}"`
      }
    },
    stock: { type: Number, default: 0 },

    // ✅ Replaces GridFS logic
    image: { type: String }, // This will store Cloudinary URL directly
  },
  { timestamps: true }
);

// ✅ Export model
module.exports = mongoose.model("Product", productSchema);
