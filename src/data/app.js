import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
const PORT = 8080;

app.get('/products',(req, res)=>{
    const {limit} = req.query;
    
    const p = new ProductManager();
    //const productos = p.getProducts();
    return res.json({products:p.getProducts(limit)})
})

app.get('/products/:pid', (req,res) =>{
    const {pid} = req.params;
    const p = new ProductManager();
    const producto = p.getProductById(Number(pid));
    return res.json({producto})
})

app.listen(PORT,() => {
    console.log(`Corriendo aplicacion en el puerto ${PORT}`)
})