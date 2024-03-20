const fs = require("fs")

class ProductManager {
  static counter = 0;
  
  constructor() {
    this.products = this.readProducts();
    this.path = "./data/products.json";
  }

  readProducts() {
    try {
      if (fs.existsSync('./data/products.json')) {
        const productosLeidos = JSON.parse(fs.readFileSync('./data/products.json', "utf-8"));
        return productosLeidos;
      }
      return [];
    } catch (error) {
      console.log("Error al leer el archivo.");
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products));
    } catch (error) {
      console.log("Error al grabar el archivo.");
    }
  }

  addProduct(code, title, thumbnail, stock, price, description) {
    if (!code || !title || !thumbnail || !stock || !price || !description) {
      return "Falta rellenar al menos uno de los campos.";
    }

    if (this.products.some((product) => product.code == code)) {
      console.log("Codigo repetido");
      return "El codigo se encuentra repetido.";
    }

    this.products.push({
      code,
      title,
      thumbnail,
      stock,
      price,
      description,
      id: ProductManager.counter++,
    });
    this.saveProducts();
    console.log("Producto cargado correctamente.");
    return "Producto cargado correctamente.";
  }

  getProducts() {
    return this.products;
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
    //const index = this.products.findIndex((p) => p.id === id);
    this.products = this.products.filter((p) => p.id !== id);
    this.saveProducts();
    console.log("Producto eliminado correctamente.");
    return "Producto eliminado correctamente.";
  }

  updateProducts(id, object) {
    const index = this.products.findIndex((p) => p.id === id); //Busco el indice/posición del producto que quiero actualizar a traves de su ID.
    if (index !== -1) {
      const { id, ...rest } = object;
      this.products[index] = { ...this.products[index], ...rest };
      this.saveProducts();
      console.log("Producto actualizado correctamente..");
      return "Producto actualizado correctamente.";
    }
  }
}

const producto = new ProductManager();


console.log(producto.getProducts());
producto.addProduct("abc1234",'producto prueba', 'sin imagen','25','200', 'Este es un producto prueba'); //2) Agrega producto al arreglo si no existe. El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
console.log(producto.getProducts());
producto.addProduct("123546213123",'producto prueba', 'sin imagen','25','200', 'Este es un producto prueba'); //2) Agrega producto al arreglo si no existe. El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
console.log("Producto por ID:", producto.getProductById(2));
//producto.deleteProduct(1)
//console.log(producto.getProducts());

// Agregar productos OK
// getProducts ok
// getgetProductById ok
// UpdateProducts
// DeleteProducts