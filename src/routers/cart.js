import {Router} from 'express';
import CartManager from '../data/CartManager.js';

const router = Router();

router.post("/", (req, res) => {
    const {products} = req.body;
  
    try {
      const c = new CartManager();
      const newCart = c.addCart(
        products
      );
      return res.json({ newCart });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  });

router.get("/:cid", (req, res) => {
  const { cid } = req.params;
  const c = new CartManager();
  const cart = c.getCartsById(Number(cid));
  return res.json({ cart });
});

router.post("/:cid/product/:pid", (req, res) => {
    const {cid} = req.params;
    const {pid} = req.params;

    const c = new CartManager();
    const newCart = c.addToCart(Number(cid), Number(pid));

    return res.json({newCart})
  });

export default router;