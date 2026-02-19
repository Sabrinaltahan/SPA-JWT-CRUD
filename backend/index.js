const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;
const JWT_SECRET = "super_secret_key_change_me";

// ----- Fake DB (in-memory) -----
let products = [
  { id: 1, name: "Apple", price: 5, stock: 20 },
  { id: 2, name: "Milk", price: 10, stock: 12 },
];

const user = {
  email: "admin@test.com",
  // password: admin123
  passwordHash: bcrypt.hashSync("admin123", 10),
};

// ----- Auth middleware -----
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing Authorization header" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ----- Routes -----
// Health
app.get("/", (req, res) => res.json({ ok: true }));

// Login
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== user.email) return res.status(401).json({ message: "Wrong credentials" });

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Wrong credentials" });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ token });
});

// Public: list + details
app.get("/products", (req, res) => res.json(products));
app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = products.find((p) => p.id === id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

// Protected CRUD
app.post("/products", auth, (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || price == null || stock == null) {
    return res.status(400).json({ message: "name, price, stock are required" });
  }
  const newItem = {
    id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    name,
    price: Number(price),
    stock: Number(stock),
  };
  products.push(newItem);
  res.status(201).json(newItem);
});

app.put("/products/:id", auth, (req, res) => {
  const id = Number(req.params.id);
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });

  const { name, price, stock } = req.body;
  const updated = {
    ...products[idx],
    name: name ?? products[idx].name,
    price: price == null ? products[idx].price : Number(price),
    stock: stock == null ? products[idx].stock : Number(stock),
  };
  products[idx] = updated;
  res.json(updated);
});

app.delete("/products/:id", auth, (req, res) => {
  const id = Number(req.params.id);
  const exists = products.some((p) => p.id === id);
  if (!exists) return res.status(404).json({ message: "Not found" });

  products = products.filter((p) => p.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));