// Data mock, disalin dari menu cetak Kaika Space.
// Harga di menu cetak ditulis "35 IDR" artinya Rp35.000.
// Nanti diganti dengan response Laravel: GET /api/menus

const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const ASK = "please ask our barista for the coffee line up";

// [nama, harga (ribuan), deskripsi]
const raw = {
  "Coffee Base": [
    ["Espresso", 20, "single shot espresso"],
    ["On the Rock", 25, "single shot espresso with ice"],
    ["Iced Black", 28, "pouring water over two espresso shots with ice"],
    ["Hot Black", 26, "pouring hot water over two espresso shot"],
    ["Piccolo", 25, "single shot espresso and fresh milk"],
    ["Flat White", 30, "espresso blended with silky steamed milk"],
    ["Cappucino", 28, "espresso and foam with bold steamed milk"],
    ["Magic", 30, "bold ristretto with creamy milk"],
    ["Iced White", 30, "creamy iced milk coffee"],
    ["Dirty Latte", 30, "creamy and bold cold milk with hot espresso"],
    ["Split Shot", 35, "espresso & picollo"],
    ["Kopi Susu Panas", 25, "warm classic milk coffee"],
  ],
  "Manual Brew": [
    ["Filter Lokal", 35, ASK],
    ["Filter Inter", 55, ASK],
    ["Exotic", 90, ASK],
  ],
  "Creamy Coffee": [
    ["Kaisen", 28, "espresso with milk and brown sugar"],
    ["Caramel", 28, "espresso with milk, caramel and brown sugar"],
    ["Butter SeaSalt", 30, "single shot espresso, butter seasalt and fresh milk"],
    ["Roasted Almond", 30, "single shot espresso, roasted almond and fresh milk"],
  ],
  "Signature Coffee": [
    ["Montblanc", 38, "a smooth balance of cold brew and thick cream."],
    ["Orange Cacao", 38, "bright citrus notes balanced with rich cacao and smooth coffee"],
    ["Apple Coffee", 30, "crisp apple sweetness blended with a smooth bold coffee finish"],
    ["Natso Mango", 32, "tropical mango flavor combined with a refreshing coffee character"],
    ["Piniplum Brew", 32, "juicy pineapple and plum notes with a vibrant coffee twist"],
    ["Pitch Wave", 32, "sweet peach aroma layered with a light refreshing coffee taste"],
  ],
  "Tea Base": [
    ["Lychee Tea", 28, "tisane with sweet lychee notes"],
    ["Crimson Berry", 30, "raspberry & rosella tisane with a refreshing finish"],
    ["Ringgoberry", 30, "strawberry, apple & floral blue fusion"],
  ],
  "Matcha Base": [
    ["Hot Matcha Latte", 30, "smooth earthy matcha with creamy milk"],
    ["Iced Matcha Latte", 32, "refreshing creamy matcha over ice"],
    ["Strawberry Matcha", 35, "iced matcha latte topped with creamy strawberry foam"],
    ["Coconut Matcha", 30, "iced coconut drink topped with creamy matcha foam"],
    ["Yuzu Matcha", 35, "refreshing yuzu drink topped with smooth matcha foam"],
  ],
  "Non Coffee": [
    ["Chocopinko", 32, "rich chocolate topped with creamy strawberry foam"],
    ["Vanilla Biscuit", 28, "vanilla fresh milk with crowned with golden biscuit crumble"],
    ["Hot Chocolate", 28, "rich warm chocolate"],
    ["Iced Chocolate", 30, "smooth refreshing chocolate"],
    ["Hot Taro", 28, "warm creamy taro drink"],
    ["Iced Taro", 30, "smooth refreshing taro"],
    ["Hot Thai Tea", 28, "warm creamy thai tea drink"],
    ["Iced Thai Tea", 30, "smooth refreshing thai tea"],
    ["Hot Red Velvet", 28, "warm creamy red velvet drink"],
    ["Iced Red Velvet", 30, "smooth refreshing red velvet"],
  ],
};

// EXTRA & ADDITIONAL di menu cetak
export const ADDONS = [
  { id: "shot", name: "Shot Espresso", price: 8000 },
  { id: "oat", name: "Oat Milk", price: 10000 },
  { id: "coconut", name: "Coconut Milk", price: 10000 },
  { id: "mineral", name: "Mineral", price: 7000 },
];

export const ICE = [
  { v: "Normal Ice", label: "Normal" },
  { v: "Less Ice", label: "Less Ice" },
];

export const SUGAR = [
  { v: "Normal Sugar", label: "Normal" },
  { v: "Less Sugar", label: "Less Sugar" },
  { v: "No Sugar", label: "No Sugar" },
];

const COFFEE_CATS = ["Coffee Base", "Creamy Coffee", "Signature Coffee"];
const PLAIN = /^(Espresso|On the Rock|Iced Black|Hot Black)$/;

// Opsi racikan apa saja yang muncul untuk tiap menu
function optionsFor(category, name, description) {
  const manual = category === "Manual Brew";
  const plain = PLAIN.test(name);
  const cold =
    category === "Signature Coffee" ||
    /\b(iced|ice|cold)\b|on the rock/i.test(`${name} ${description}`);
  const addons = ["mineral"];
  if (COFFEE_CATS.includes(category) && !manual) addons.unshift("shot");
  if (!manual && !plain && category !== "Tea Base") addons.splice(addons.length - 1, 0, "oat", "coconut");
  return { ice: cold, sugar: !manual && !plain, addons };
}

export const categories = Object.keys(raw);

export const menus = Object.entries(raw).flatMap(([category, items]) =>
  items.map(([name, k, description]) => ({
    id: slug(`${category}-${name}`),
    category,
    name,
    description,
    price: k * 1000,
    image: null, // isi dengan "/images/xxx.jpg" kalau foto sudah ada
    options: optionsFor(category, name, description),
  }))
);
