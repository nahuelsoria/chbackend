const fs = require("fs")

class ProductManager {

  #products
  #path


  constructor() {
    this.#products = [];
    this.#path = "./data/products.json";
    this.#readProducts();
  }

  #readProducts() {
    try {
      if (fs.existsSync(this.#path)) {
        this.#products = JSON.parse(fs.readFileSync(this.#path, 'utf-8'));    
        return this.#products;
      }
      return [];
    } catch (error) {
      console.log("Error al leer el archivo.");
    }
  }

  #saveProducts() {
    try {
      fs.writeFileSync(this.#path, JSON.stringify(this.#products));
    } catch (error) {
      console.log("Error al grabar el archivo.");
    }
  }

  #assignId() {
    let id = 1;
        if(this.#products.length !==0)
        id = this.#products[this.#products.length - 1].id + 1;
    return id;
}

  addProduct(code, title, thumbnail, stock, price, description) {
    if (!code || !title || !thumbnail || !stock || !price || !description) {
      return "Falta rellenar al menos uno de los campos.";
    }

    if (this.#products.some((product) => product.code == code)) {
      console.log("Codigo repetido");
      return "El codigo se encuentra repetido.";
    }

    ProductManager.idProduct = ProductManager.idProduct +1
    const id = this.#assignId();
    const newProduct = {
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    };

    this.#products.push(newProduct)
    this.#saveProducts()

    return'Producto cargado correctamente.'
  }

  getProducts() {
    return this.#readProducts();
  }

  getProductById(id) {
    let encontrado = this.products.find((product) => product.id == id);
    if (!encontrado) {
      return "Not found";
    } else {
      return encontrado;
    }
  }

  deleteProduct(id) {
    this.#products = this.#products.filter((p) => p.id !== id);
    this.#saveProducts();
    console.log("Producto eliminado correctamente.");
    return "Producto eliminado correctamente.";
  }

  updateProducts(id, object) {
    const index = this.#products.findIndex((p) => p.id === id); //Busco el indice/posición del producto que quiero actualizar a traves de su ID.
    if (index !== -1) {
      const { id, ...rest } = object;
      this.#products[index] = { ...this.#products[index], ...rest };
      this.#saveProducts();
      console.log("Producto actualizado correctamente..");
      return "Producto actualizado correctamente.";
    }
  }
}

const producto = new ProductManager();