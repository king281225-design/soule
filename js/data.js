// PLACEHOLDER MENU — the logo/interior photos you shared are in and drive
// the branding below, but you haven't sent an actual menu yet, so these
// items are generic café placeholders (coffee, pastries, brunch) chosen to
// roughly match the vibe — swap for the real menu whenever it's ready.
// No build step needed: just edit this file and refresh the page.

const RESTAURANT = {
  name: "Soulé",
  tagline: "Coffee, crafted with soul",
  address: "REPLACE WITH ADDRESS",
  gmapsUrl: "https://maps.google.com/?q=Soul%C3%A9",
  phone: "REPLACE WITH PHONE",
  hours: "REPLACE WITH HOURS",
  heroImage: "assets/soule-interior.jpg",
};

const CATEGORIES = [
  { id: "coffee", name: "Coffee & Espresso" },
  { id: "brunch", name: "All-Day Brunch" },
  { id: "pastries", name: "Pastries & Bakes" },
  { id: "cold-brew", name: "Cold Beverages" },
  { id: "desserts", name: "Desserts" },
];

const MENU_ITEMS = [
  {
    id: "flat-white",
    category: "coffee",
    name: "Flat White",
    description: "Double espresso, steamed milk, velvety microfoam.",
    price: 220,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: true,
    available: true,
  },
  {
    id: "pour-over",
    category: "coffee",
    name: "Single-Origin Pour Over",
    description: "Rotating single-origin beans, brewed fresh to order.",
    price: 280,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop",
    veg: true,
    chefSpecial: true,
    available: true,
  },
  {
    id: "avocado-toast",
    category: "brunch",
    name: "Avocado Toast",
    description: "Sourdough, smashed avocado, chili flakes, poached egg.",
    price: 380,
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=800&auto=format&fit=crop",
    veg: false,
    bestseller: true,
    available: true,
  },
  {
    id: "shakshuka",
    category: "brunch",
    name: "Shakshuka",
    description: "Eggs poached in spiced tomato sauce, served with bread.",
    price: 350,
    image: "https://images.unsplash.com/photo-1590412200988-a436970781fa?q=80&w=800&auto=format&fit=crop",
    veg: false,
    available: true,
  },
  {
    id: "croissant",
    category: "pastries",
    name: "Butter Croissant",
    description: "Laminated, baked fresh every morning.",
    price: 140,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop",
    veg: true,
    available: true,
  },
  {
    id: "banana-bread",
    category: "pastries",
    name: "Banana Bread",
    description: "Moist loaf with walnuts, served warm.",
    price: 160,
    image: "https://images.unsplash.com/photo-1606101273945-e9c96e7fd4c9?q=80&w=800&auto=format&fit=crop",
    veg: true,
    available: false,
  },
  {
    id: "cold-brew",
    category: "cold-brew",
    name: "Cold Brew",
    description: "Slow-steeped 18 hours, smooth and low-acid.",
    price: 240,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: true,
    available: true,
  },
  {
    id: "tiramisu",
    category: "desserts",
    name: "Tiramisu",
    description: "Espresso-soaked ladyfingers, mascarpone, cocoa.",
    price: 320,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800&auto=format&fit=crop",
    veg: true,
    chefSpecial: true,
    available: true,
  },
];
