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
  projector: [], // No subcategories for now
  pos: [
    "Barcode Label Printer", "Barcode Label Sticker", "Barcode Scanner", 
    "Cash Drawer", "POS Printer", "POS Terminal", "Paper Roll", "Ribbon"
  ],
  other: [
    "CCTV", "HDD", "Headphones", "ID Card", "Power Strip", "Speaker", "Bag", "Web Cam", "Miscellaneous"
  ]
};

// ✅ Product Schema with category & subcategory validation
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      required: true, 
      enum: Object.keys(subcategories), // ✅ Ensures category matches allowed values
      set: value => value.trim().toLowerCase()  // ✅ Store lowercase values only
    },
    subcategory: { 
      type: String,
      validate: {
        validator: function(value) {
          if (!value) return true; // ✅ Allow empty subcategory
          return subcategories[this.category]?.includes(value);
        },
        message: props => `Invalid subcategory "${props.value}" for category "${props.instance.category}"`
      }
    },
    stock: { type: Number, default: 0 },
    image: { type: String }, // Store image URL
  },
  { timestamps: true }
);

// ✅ Export Model
module.exports = mongoose.model("Product", productSchema);
