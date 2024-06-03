import { cartsModelo } from './models/cartsModelo.js';
import { productsModelo } from './models/productsModelo.js';

export class CartManagerMongo {
  async createCart() {
    let cart = await cartsModelo.create({ products: [] });
    return cart.toJSON();
  }

  async addToCart(cid, pid) {
    try {
      const cart = await cartsModelo.findOne({ _id: cid });
      if (!cart) {
        return `Carrito con ID ${cid} no encontrado`;
      }

      const existingProductIndex = cart.products.findIndex(
        (p) => p.product == pid
      );
      console.log({existingProductIndex})
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity++;
      } else {
        const product = await productsModelo.findOne({_id:pid})
        
        if (!product || product === "Not found") {
          console.log(`Producto con ID ${pid} no encontrado`);
          return `Producto con ID ${pid} no encontrado`;
        }

        const newProduct = {
          product: pid,
          quantity: 1,
        };

        cart.products.push(newProduct);
        console.log(`Nuevo producto agregado al carrito: ${product.title}`);
      }
      await cart.save();
      console.log(`Carrito guardado correctamente: ${cart}`);
      return await cartsModelo.findByIdAndUpdate({_id:cid}, cart)
    } catch (error) {
      console.log(`Error al añadir producto: ${error}`);
      return `Error al añadir producto: ${error}`;
    }
  }

  async getCarts(limit = 0) {
    return await cartsModelo.find().populate("products.product").lean();
  }
  //db.carts.find(ObjectId("664bae4aa449b611ac3b0e2e"))

  async getCartsById(cid) {
    return await cartsModelo.findOne({ _id: cid }).populate("products.product").lean();;
  }

  updateCart(id, newProduct) {}
}
  
  const cart = new CartManagerMongo();