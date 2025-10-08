import express from "express";
import { readFileSync } from "fs";
import cors from "cors";
const app = express();
const port = 5000;

// Middleware to parse JSON requests
app.use(cors());
app.use(express.json());

// Sample products data (replace with your own or use a database)
let products;
try {
    products = JSON.parse(readFileSync("./products.json", "utf8"));
} catch (error) {
    console.error("Error loading products.json:", error);
    products = []; // Fallback to empty array
}

// Endpoint to get all products
app.get("/products", (req, res) => {
    res.json(products);
});

// Endpoint to get a single product by ID
app.get("/products/:id", (req, res) => {
    const product = products.find((p) => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
