import { Router } from "express";
import {ProductManagerMongo as ProductManager} from "../dao/ProductManagerMongo.js";

const router = Router();
const p = new ProductManager();

router.get("/", async (req, res) => {
  try{
    const productos = await p.getProducts(); //Consulto la base de datos de productos
    return res.json({productos});
  }catch (error){
    console.log(error)
    res.setHeader('Content-type','application/json');
    return res.status(500).json(
      {
        error: `Error inesperado en el servidor - Intente mas tarde`,
        detalle: `${error.message}`
      }
    )
  }
});

router.get("/:pid", async (req, res) => { //Para traer un producto utilizo el _id.
  try{
  const { pid } = req.params;
  const producto = await p.getProductById(pid);
  return res.json(producto);
  }catch (error){
    console.log(error)
    res.setHeader('Content-type','application/json');
    return res.status(500).json(
      {
        error: `Error inesperado en el servidor - Intente mas tarde`,
        detalle: `${error.message}`
      }
    )
  }
});


router.post("/", async (req, res) => {
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
  if (!title ||
    !description ||
    !code ||
    !price ||
    !status ||
    !stock ||
    !category ||
    !thumbnails
  ) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({
      error: `Falta completar información del producto.`,
    });
  }
  //Verifico que no se duplique el ID o Code en la base de datos.
  /*
  let existeId;
  try {
    existeId = await p.getProductById(id);
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: `${error.message}`,
    });
  }
  
  if (existeId) {
    res.setHeader("Content-Type", "application/json");
    return res
    .status(400)
    .json({ error: `El producto con ID ${id} ya existe en la base de datos.` });
  }
  */
 
 let existeCode;
  try {
    existeCode = await p.getProductByCode(code);
    //console.log(existe)
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: `${error.message}`,
    });
  }

  if (existeCode) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `El producto con Code ${code} ya existe en la base de datos.` });
  }

  try {
    let newProduct = await p.addProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });
    res.setHeader("Content-Type", "application/json");
    return res.status(201).json(newProduct);
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administradora`,
      detalle: `${error.message}`,
    });
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    let aModificar = req.body
    let productoModificado = await p.updateProduct(pid, aModificar);
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(productoModificado);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const producto = await p.deleteProduct(pid);
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(`El producto con ID ${pid} ha sido eliminado de la base de datos.`);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

export default router;