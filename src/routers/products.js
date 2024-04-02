import { Router } from "express";
import ProductManager from "../data/ProductManager.js";

const router = Router();

router.get("/", (req, res) => {
  const { limit } = req.query;
  const p = new ProductManager();
  //const productos = p.getProducts();
  return res.json({ products: p.getProducts(limit) });
});

router.get("/:pid", (req, res) => {
  const { pid } = req.params;
  const p = new ProductManager();
  const producto = p.getProductById(Number(pid));
  return res.json({ producto });
});

router.post("/", (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  try {
    const p = new ProductManager();
    const newProduct = p.addProduct(
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    );
    return res.json({ newProduct });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: `${error.message}`,
    });
  }
});

router.put("/:pid", (req, res) => {
  const { pid } = req.params;
  try {
    const p = new ProductManager();
    const producto = p.updateProducts(Number(pid), req.body);
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ producto });
  } catch (error) {
    return res.json({ error: "Error desconocido." });
  }
});

router.delete("/:pid", (req, res) => {
  const { pid } = req.params;
  try {
    const p = new ProductManager();
    const producto = p.deleteProduct(Number(pid));
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ producto });
  } catch (error) {
    return res.json({ error: "Error desconocido." });
  }
});

export default router;