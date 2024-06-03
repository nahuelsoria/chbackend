import { productsModelo } from './models/productsModelo.js';


export class ProductManagerMongo {
  async getProducts() {
    return await productsModelo.find().lean() //Consulto la base de datos de productos
  }

  async getProductsPaginate(page){
    return await productsModelo.paginate({}, {limit:5, page, lean:true})
  }

  async getProductById(_id){
    return await productsModelo.findOne({_id})
  }

  async getProductByCode(code){
    return await productsModelo.findOne({code})
  }

  async addProduct(producto){
    return await productsModelo.create(producto)
  }

  async updateProduct(id, producto){
    return await productsModelo.updateOne({_id:id}, producto)
    //return await productsModelo.findByIdAndUpdate(id, producto, {runValidators:true} )
  }

  async deleteProduct(_id){
    return await productsModelo.deleteOne({_id})
  }
}

//const producto = new ProductManagerMongo();