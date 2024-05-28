import { productsModelo } from './models/productsModelo.js';


export class ProductManagerMongo {
  async getProducts() {
    return await productsModelo.find() //Consulto la base de datos de productos
  }

  async getProductById(id){
    return await productsModelo.findOne({id})
  }

  async getProductByCode(code){
    return await productsModelo.findOne({code})
  }

  async addProduct(producto){
    return await productsModelo.create(producto)
  }

  async updateProduct(id, producto){
    return await productsModelo.updateOne({id:id}, producto)
    //return await productsModelo.findByIdAndUpdate(id, producto, {runValidators:true} )
  }

  async deleteProduct(id){
    return await productsModelo.deleteOne({id})
  }
}

//const producto = new ProductManagerMongo();