// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose"; // Importamos mongoose
// import * as dotenv from "dotenv"; // Importamos dotenv
// dotenv.config(); // Carga las variables de entorno desde .env

// const app = express();
// const port = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // --- 🎯 Conexión a MongoDB ---
// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("MongoDB Connected Successfully");
//     } catch (error) {
//         console.error("MongoDB connection failed:", error.message);
//         // Exit process with failure
//         process.exit(1);
//     }
// };

// // --- 🎯 Definición del Esquema y Modelo ---
// // Define la estructura de tus productos
// const ProductSchema = new mongoose.Schema({
//     id: { type: Number, required: true, unique: true },
//     title: { type: String, required: true },
//     price: { type: Number, required: true },
//     description: { type: String },
//     category: { type: String },
//     image: { type: mongoose.Schema.Types.Mixed }, // Para aceptar strings o arrays
// });

// // El nombre 'Product' se convierte a 'products' en la colección
// const Product = mongoose.model("Product", ProductSchema);


// // --- 🎯 Endpoints con MongoDB ---

// // Endpoint para obtener todos los productos
// app.get("/products", async (req, res) => {
//     try {
//         // Usa el modelo para buscar todos los documentos
//         const products = await Product.find({}).lean();
//         console.log("Productos devueltos por la DB:", products.length, "documentos.");
//         res.json(products);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: "Server Error", details: error.message });
//     }
// });

// // Endpoint para obtener un solo producto por ID
// app.get("/products/:id", async (req, res) => {
//     try {
//         // Busca el producto por el campo 'id'
//         const product = await Product.findOne({ id: parseInt(req.params.id) });
//         if (!product) {
//             return res.status(404).json({ message: "Product not found" });
//         }
//         res.json(product);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: "Server Error" });
//     }
// });

// // Start the server
// connectDB().then(() => {
//     app.listen(port, () => {
//         console.log(`Server running at http://localhost:${port}`);
//     });
// });


import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

// --- 1. Initialize Express App ---
const app = express();
const port = 5000; // Keep port defined for local dev reference, but it won't be used by Vercel

// Middleware
app.use(cors());
app.use(express.json());

// --- 2. Database Connection Logic (Modified) ---

// Use a flag to ensure connection is only established once in a serverless environment
let isConnected = false;

const connectDB = async () => {
    // Check if we are already connected (important for serverless functions)
    if (isConnected) {
        console.log("Using existing MongoDB connection.");
        return;
    }

    try {
        // We use mongoose.connect and pass an object to track the connection state
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true; // Set flag on successful connection
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        // In a serverless environment, we log the error but don't call process.exit(1) 
        // as Vercel handles the process lifecycle.
        throw error;
    }
};

// --- 3. Definition of Schema and Model ---
// Define la estructura de tus productos
const ProductSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },
    image: { type: mongoose.Schema.Types.Mixed },
});

// Create model. Note: Model definition must happen BEFORE endpoints that use it.
const Product = mongoose.model("Product", ProductSchema);


// --- 4. Endpoints with Connection Check (Crucial for Serverless) ---

// Middleware to ensure DB connection is active before processing the route
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(503).json({ 
            message: "Database connection unavailable.", 
            details: error.message 
        });
    }
});


// Endpoint for all products
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find({}).lean();
        console.log("Productos devueltos por la DB:", products.length, "documentos.");
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error", details: error.message });
    }
});

// Endpoint for a single product by ID
app.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findOne({ id: parseInt(req.params.id) });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// --- 5. Export for Vercel Serverless Function ---
// Vercel will import this 'app' instance and wrap it in its own server.
export default app; 

/*
// --- 6. REMOVED BLOCK ---
// Removed the following block:
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
});
*/