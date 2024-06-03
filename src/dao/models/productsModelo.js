import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2"
const productsCollection="products"//Nombro la collection a la que quiero consultar/enviar data
const productsEsquema=new mongoose.Schema(
    {
        title: String,
        description: String,
        code: {type:String, required: true, unique: true},
        price: Number,
        status: Boolean,
        stock: Number,
        category: String,
        thumbnails: Array
    },
    {
        timestamps:true
    }
)

productsEsquema.plugin(paginate)

export const productsModelo=mongoose.model(
    productsCollection,
    productsEsquema
)

//productsModelo.find()