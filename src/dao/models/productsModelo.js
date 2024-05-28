import mongoose from "mongoose";

const productsCollection="products"//Nombro la collection a la que quiero consultar/enviar data
const productsEsquema=new mongoose.Schema(
    {
        id: {type:Number, required: true},
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

export const productsModelo=mongoose.model(
    productsCollection,
    productsEsquema
)

//productsModelo.find()