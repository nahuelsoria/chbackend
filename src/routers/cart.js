import {Router} from 'express';
import {CartManagerMongo as CartManager} from '../dao/CartManagerMongo.js';
import { ProductManagerMongo as ProductManager } from '../dao/ProductManagerMongo.js';
import {isValidObjectId} from 'mongoose';

const router = Router();

const c = new CartManager();
const p = new ProductManager()

router.post("/", async (req, res) => {
    const {products} = req.body;
    try {
      const newCart = await c.createCart(
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
    const {cid, pid} = req.params;
    const newCart = c.addToCart(cid, pid);
    return res.json(`Se añadió correctamente el producto al carrito.`)
  }catch(error){
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No se puede obtener los carritos.`,
      detalle: `${error.message}`,
    })
  }
  });

  router.delete('/:cid/products/:pid', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    const { cid, pid } = req.params;

    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        return res.status(400).json({
            error: `Ingrese un ID de MongoDB valido`,
        });
    }

    let productExists = await p.getProductsBy({ _id: pid });
    console.log({productExists})
    if (!productExists) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No existe un producto con el ID: ${pid}` })
    }

    let cartExists = await c.getCartsBy({ _id: cid })
    console.log({cartExists})
    if (!cartExists) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json({ error: `No existe un carrito con el ID: ${cid}` })
    }

    try {
        const cart = await c.deleteProductFromCart(cid, pid);
        //console.log({cart})
        if (cart) {
            res.status(200).json({ message: 'Producto eliminado del carrito', cart });
        } else {
            res.status(404).json({ message: 'Producto o Carrito no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al intentar eliminar el producto del carrito.', error });
    }
  })

  router.put("/:cid", async (req, res) => {
    let cid = req.params.cid ;
    let products = req.body;
    if (!isValidObjectId(cid)) {
      return res.status(400).json({
        error: `Ingrese un ID de MongoDB válido`,
      });
    }

    let cartExists = await c.getCartsBy({ _id: cid });
    if (!cartExists) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(404)
        .json({ error: `No existe un carrito con el ID: ${cid}`});
    }

    try {
      const newCart = await c.updateCart(cid, products);
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json(newCart);
    } catch (error) {
      res
        .status(500)
        .json({
          error: `Error inesperado en el servidor`,
          detalle: `${error.message}`,
        });
    }
  });

  router.put('/:cid/products/:pid', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    const { cid, pid } = req.params;
    let { quantity } = req.body;

    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        return res.status(400).json({
            error: `Ingrese un ID de MongoDB válido`,
        });
    }

    let productExists = await p.getProductsBy({ _id: pid });
    if (!productExists) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No existe un producto con el ID: ${pid}` })
    }


    let cartExists = await c.getCartsBy({ _id: cid })
    if (!cartExists) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json({ error: `No existe un carrito con el ID: ${cid}` })
    }

    try {
        const result = await c.updateProductQ(cid, pid, quantity);
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: `Error inesperado en el servidor`, detalle: `${error.message}` })

    }
})

  router.delete('/:cid', async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const cid = req.params.cid

  if (!isValidObjectId(cid)) {
      return res.status(400).json({
          error: `Ingrese un ID de MongoDB válido`,
      });
  }

  let cartExists = await c.getCartsBy({ _id: cid })
  if (!cartExists) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(404).json({ error: `No existe un carrito con el ID: ${cid}` })
  }

  try {
      let carritoEliminado = await c.deleteAllProductsFromCart(cid)
      if (carritoEliminado) {
          res.status(200).json({ message: 'Todos los productos fueron eliminados del carrito.', carritoEliminado });
      } else {
          res.status(404).json({ message: 'Carrito no encontrado.' });
      }
  } catch (error) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json(
          {
              error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
              detalle: `${error.message}`
          }
      )
  }
})

export default router;