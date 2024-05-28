import {Router} from 'express';
import {CartManagerMongo as CartManager} from '../dao/CartManagerMongo.js';
import { isValidObjectId } from 'mongoose';

const router = Router();

const c = new CartManager();

router.post("/", async (req, res) => {
    const {id, products} = req.body;
    try {
      const newCart = await c.addCart(
        id,
        products
      );
      return res.json("El carrito ha sido creado.");
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  });

  router.get("/", async (req, res) => {
    try{
    const cart = await c.getCarts();
    return res.json(cart);
    }catch(error){
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `No se puede obtener los carritos.`,
        detalle: `${error.message}`,
      });
    }
  });

router.get("/:cid", async (req, res) => { //Traer carrito por _id (creado por MONGO).
  try{
  const { cid } = req.params;
  const cart = await c.getCartsById(cid);
  return res.json(cart);
  }catch(error){
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No se puede obtener el carrito indicado.`,
      detalle: `${error.message}`,
    });
  }
});

router.post("/:cid/product/:pid", (req, res) => {
  try{
    const {cid} = req.params;
    const {pid} = req.params;
    const newCart = c.addToCart(cid, Number(pid));

    return res.json({newCart})
  }catch(error){
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No se puede obtener los carritos.`,
      detalle: `${error.message}`,
    })
  }
  });

export default router;