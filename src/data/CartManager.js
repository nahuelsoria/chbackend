import fs from 'fs'
import ProductManager from "../data/ProductManager.js";

class CartManager {
  #carts;
  #path;

  constructor() {
    this.#carts = [];
    this.#path = "./src/data/carts.json";
    this.#readCarts();
  }

  #readCarts() {
    try {
      if (fs.existsSync(this.#path)) {
        this.#carts = JSON.parse(fs.readFileSync(this.#path, "utf-8"));
        return this.#carts;
      }
      return [];
    } catch (error) {
      console.log("Error al leer el archivo.");
    }
  }

  #saveCarts() {
    try {
      fs.writeFileSync(this.#path, JSON.stringify(this.#carts));
    } catch (error) {
      console.log("Error al grabar el archivo.");
    }
  }

  #assignId() {
    let id = 1;
    if (this.#carts.length !== 0)
      id = this.#carts[this.#carts.length - 1].id + 1;
    return id;
  }

  addCart(products = []) {
    if (!products) {
      return "Falta rellenar al menos uno de los campos obligatorios.";
    }

    CartManager.idCart = CartManager.idCart + 1;
    const id = this.#assignId();
    const newCart = {
      id,
      products: [],
    };

    this.#carts.push(newCart);
    this.#saveCarts();

    return "Carrito cargado correctamente.";
  }

  addToCart(cid, pid) {
    const index = this.#carts.findIndex((c) => c.id === cid); //Busco el indice/posición del producto que quiero actualizar a traves de su ID.
    if (index !== -1) {
      const indexProductCart = this.#carts[index].products.findIndex(
        (p) => p.id === pid
      );
      const p = new ProductManager();

      if (indexProductCart === -1) {
        this.#carts[index].products.push({ id: pid, quantity: 1 });
        this.#saveCarts();
        return "El producto no existia en el carrito. Se ha cargado el producto al carrito correctamente.";
      } else if (indexProductCart !== -1) {
        ++this.#carts[index].products[indexProductCart].quantity;
        this.#saveCarts();
        return "Se ha aumentado en 1 la cantidad del producto seleccionado.";
      }
    }
    return "El carrito al que intenta agregar productos no existe"
  }

  getCarts(limit = 0) {
    limit = Number(limit);
    if (limit > 0) {
      return this.#readCarts().slice(0, limit);
    }
    return this.#readCarts();
  }

  getCartsById(id) {
    let encontrado = this.#carts.find((cart) => cart.id == id);
    if (!encontrado) {
      return "Not found";
    } else {
      return encontrado;
    }
  }

  updateCart(id, newProduct) {
    const index = this.#carts.findIndex((c) => c.id === id); //Busco el indice/posición del producto que quiero actualizar a traves de su ID.
    if (index !== -1) {
      const { id, ...rest } = newProduct;
      this.#carts[index] = { ...this.#carts[index], ...rest };

      this.#saveCarts();
      console.log("Carrito actualizado correctamente..");
      return "Carrito actualizado correctamente.";
    }
  }
}
  
  const cart = new CartManager();

  export default CartManager;