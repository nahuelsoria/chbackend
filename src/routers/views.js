import { Router } from "express";
import ProductManager from "../data/ProductManager.js";
export const router=Router()

router.get('/', (req, res) =>{
  const p = new ProductManager();
  const product = p.getProducts();
  res.setHeader('Content-Type','text/html');
  res.status(200).render('home', {product});
})

router.get('/realtimeproducts', (req, res) =>{
    const p = new ProductManager();
    const product = p.getProducts();
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('realtimeproducts', {product})
  });

export default router;