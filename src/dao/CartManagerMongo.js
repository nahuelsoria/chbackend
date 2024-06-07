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

  async getCartsBy(filtro = {}) {
    return await cartsModelo.findOne(filtro).populate("products.product").lean()
};

  async getCartsById(cid) {
    return await cartsModelo.findOne({ _id: cid }).populate("products.product").lean();;
  }

  async updateCart(cid, products) {
    try {
        let cart = await cartsModelo.findByIdAndUpdate(
            cid,
            { $set: { products: products } },
            { returnDocument: "after" }
        );
        return (cart)
    } catch (error) {
        console.error(error.message);
        return ("Error al actualizar el carrito");
    }
};

async updateProductQ(cid, pid, quantity) {
  try {
      let cart = await cartsModelo.findOneAndUpdate(
          { _id: cid, "products.product": pid },
          { $set: { "products.$.quantity": quantity } },
          { new: true }
      ).populate("products.product");
      return cart;
  } catch (error) {
      console.error(error.message);
      return ("Error al actualizar la cantidad del producto");
  }
};

  async deleteProductFromCart(cid, pid) { 
    try {
        const cart = await cartsModelo.findByIdAndUpdate(
            cid,
            { $inc: { 'products.$[product].quantity': -1 } },
            { new: true, arrayFilters: [{ 'product.product': pid }] }
        );

        if (!cart) {
            return `Carrito con ID ${cid} no encontrado.`;
        }

        console.log(`El producto fue eliminado del carrito correctamente: ${cart}`);

        return cart;
    } catch (error) {
        console.log(`Error al eliminar intentar eliminar el producto del carrito: ${error}`);
        return `Error al eliminar intentar eliminar el producto del carrito: ${error}`;
    }
}

async deleteAllProductsFromCart(cid) {
  try {
      const cart = await cartsModelo.findByIdAndUpdate(
          cid,
          { $set: { products: [] } },
          { returnDocument: "after" }
      );

      if (!cart) {
          return `Carrito con id ${cid} no encontrado`;
      }

      cart.products = [];

      await cart.save();
      console.log(`Productos eliminados correctamente: ${cart}`);

      return cart;
  } catch (error) {
      return `Error al eliminar los productos del carrito: ${error}`;
  }
};
}