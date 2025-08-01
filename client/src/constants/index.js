export const BASE_URL = import.meta.env.VITE_API_URL;
export const API_URL = BASE_URL + "/api/v1";

export const APIs = {
  USERS: `${API_URL}/auth`, // ✅ Changed from "/users" to "/auth"
};

export const categories = {
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
