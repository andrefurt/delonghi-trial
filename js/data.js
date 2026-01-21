// De'Longhi Product Data

const products = [
  {
    id: 1,
    name: "Rivelia",
    type: "automatic",
    features: [
      { icon: "magicWand", label: "Automatic" },
      { icon: "phone", label: "App" },
      { icon: "snowflake", label: "Cold brew" },
    ],
    rating: 4.1,
    reviewCount: "1.1k",
    price: 819.9,
    originalPrice: null,
    monthlyPrice: 273.3,
    colors: ["#D4C4B0", "#838877", "#082141", "#b4b4b4"],
    tags: ["new"],
    filters: ["auto-milk", "cold-drinks", "top-rated"],
    image: "assets/products/rivelia.png",
  },
  {
    id: 2,
    name: "La Specialista Arte Evo",
    type: "manual",
    features: [
      { icon: "hand", label: "Manual" },
      { icon: "target", label: "Precise grinder" },
      { icon: "coffee", label: "Top milk creations" },
    ],
    rating: 4.6,
    reviewCount: "892",
    price: 467,
    originalPrice: 599.99,
    monthlyPrice: 155.67,
    colors: ["#C4A77D", "#B22222", "#2C2C2C", "#C0C0C0", "#838877"],
    tags: ["best-seller", "-22%"],
    filters: ["on-sale"],
    image: "assets/products/la-specialista.png",
  },
  {
    id: 3,
    name: "Dedica Style",
    type: "manual",
    features: [
      { icon: "hand", label: "Manual" },
      { icon: "phone", label: "App" },
      { icon: "coffee", label: "Top milk creations" },
    ],
    rating: 4.6,
    reviewCount: "2.3k",
    price: 189,
    originalPrice: 209.9,
    monthlyPrice: 63,
    colors: ["#2C2C2C", "#C0C0C0", "#B22222", "#E8E8E8", "#838877"],
    tags: ["new", "-10%"],
    filters: ["on-sale", "compact"],
    image: "assets/products/dedica.png",
  },
  {
    id: 4,
    name: "Dinamica Plus",
    type: "automatic",
    features: [
      { icon: "magicWand", label: "Automatic" },
      { icon: "phone", label: "App" },
      { icon: "coffee", label: "LatteCrema©" },
    ],
    rating: 4.6,
    reviewCount: "562",
    price: 949.9,
    originalPrice: 649.9,
    monthlyPrice: 216.63,
    colors: ["#2C2C2C", "#838877", "#D4C4B0"],
    tags: ["best-seller"],
    filters: ["auto-milk"],
    image: "assets/products/dinamica-plus.png",
  },
  {
    id: 5,
    name: "Magnifica Plus",
    type: "automatic",
    features: [
      { icon: "magicWand", label: "Automatic" },
      { icon: "phone", label: "App" },
      { icon: "snowflake", label: "Cold brew" },
      { icon: "coffee", label: "LatteCrema©" },
    ],
    rating: 4.6,
    reviewCount: "1.4k",
    price: 769.9,
    originalPrice: null,
    monthlyPrice: 256.63,
    colors: ["#2C2C2C", "#838877", "#D4C4B0"],
    tags: ["welcome-pack"],
    filters: ["auto-milk", "cold-drinks"],
    image: "assets/products/magnifica.png",
  },
  {
    id: 6,
    name: "PrimaDonna Aromatic",
    type: "automatic",
    features: [
      { icon: "magicWand", label: "Automatic" },
      { icon: "phone", label: "App" },
      { icon: "snowflake", label: "Cold brew" },
      { icon: "coffee", label: "Crema©" },
    ],
    rating: 4.8,
    reviewCount: "89",
    price: 1799.9,
    originalPrice: null,
    monthlyPrice: 599.97,
    colors: ["#2C2C2C", "#C0C0C0"],
    tags: ["new"],
    filters: ["auto-milk", "cold-drinks", "top-rated"],
    image: "assets/products/primaDona.png",
  },
  {
    id: 7,
    name: "Gran lattissima",
    type: "pod",
    features: [
      { icon: "coffeePod", label: "Coffee pod" },
      { icon: "coffee", label: "Crema©" },
      { icon: "coffee", label: "5 drinks" },
    ],
    rating: 4.5,
    reviewCount: "342",
    price: 349,
    originalPrice: 379.9,
    monthlyPrice: 116.33,
    colors: ["#2C2C2C", "#E8E8E8"],
    tags: ["-8%", "nespresso"],
    filters: ["on-sale", "compact"],
    image: "assets/products/granLatissima.png",
  },
];

const filters = [
  { id: "all", label: "All", icon: null },
  { id: "on-sale", label: "On sale", icon: "percent" },
  { id: "auto-milk", label: "Auto milk", icon: "lightning" },
  { id: "cold-drinks", label: "Cold drinks", icon: "snowflake" },
  { id: "compact", label: "Compact size", icon: "ruler" },
  { id: "top-rated", label: "Top Rated", icon: "star" },
];

const orientationCards = [
  {
    id: "sale",
    type: "sale",
    label: "SALE",
    title: "20% off Rivelia family",
    color: "#39241e",
    action: "filter-sale",
  },
  {
    id: "quiz",
    type: "quiz",
    label: "WHICH ONE?",
    title: "Find the right one for you.",
    color: "#808080",
    action: "open-quiz",
  },
  {
    id: "welcome",
    type: "welcome",
    label: "WELCOME PACK",
    title: "90€ in value. Beans & care set.",
    color: "#6d4439",
    action: "open-modal",
  },
];

const uspCards = [
  {
    id: "worth",
    position: 3, // After 3rd product
    title: "Worth it.",
    theme: "worth",
    illustration: "assets/illustrations/ups-worth.png",
    items: [
      {
        icon: "fire",
        title: "Price match",
        desc: "We'll match any offer",
      },
      { icon: "gift", title: "€90 welcome kit", desc: "Beans, cups & care" },
    ],
  },
  {
    id: "chapter",
    position: 5, // After 5th product
    title: "New chapter.",
    theme: "chapter",
    illustration: "assets/illustrations/usp-newChapter.png",
    items: [
      {
        icon: "handHeart",
        title: "Trade in & save",
        desc: "We take your old one",
      },
      {
        icon: "delivery-usp",
        title: "Free delivery",
        desc: "Straight to your door",
      },
    ],
  },
  {
    id: "peace",
    position: 7, // After 7th product
    title: "Peace of mind.",
    theme: "peace",
    illustration: "assets/illustrations/usp-peaceOfMind.png",
    items: [
      {
        icon: "ShieldCheck",
        title: "3 year warranty",
        desc: "Extra year on us",
      },
      {
        icon: "delivery-usp",
        title: "30 Days to decide",
        desc: "Free, easy returns",
      },
    ],
  },
];

const uspBarItems = [
  {
    icon: "truck",
    title: "Light speed delivery",
    subtitle: "2-4 days average",
  },
  { icon: "box", title: "Free delivery", subtitle: "On orders over €36" },
  { icon: "klarna", title: "Pay in 3, with Klarna", subtitle: "Interest free" },
  {
    icon: "return",
    title: "30 day to return",
    subtitle: "Free home collection",
  },
];
