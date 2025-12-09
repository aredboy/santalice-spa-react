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

// --- 1. Initialize Express App & Router ---
const app = express();
const apiRouter = express.Router(); // We create the router here

// --- 2. Middleware ---
app.use(cors());
app.use(express.json()); // Standard JSON parsing

// --- 3. Database Connection Logic ---
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing MongoDB connection.");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

// --- 4. Global Middleware: Ensure DB Connection ---
// This runs for EVERY request to ensure the DB is ready
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

// --- 5. Schema and Model ---
const ProductSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },
    image: { type: mongoose.Schema.Types.Mixed },
});

// Prevent model overwrite error if the file re-executes
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

// --- 6. API Routes (Using Router) ---

// Define routes on 'apiRouter' (NOT 'app')
// Note: We use "/" and "/:id" here because the router will be mounted at "/api" later.

// GET /api/products
apiRouter.get("/products", async (req, res) => {
    try {
        const products = await Product.find({}).lean();
        console.log("Productos devueltos por la DB:", products.length, "documentos.");
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error", details: error.message });
    }
});

// GET /api/products/:id
apiRouter.get("/products/:id", async (req, res) => {
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

// --- 7. Mount the Router ---
// This tells Express: "Any request starting with /api goes to apiRouter"
app.use("/api", apiRouter);

// --- 8. Export for Vercel ---
export default app;