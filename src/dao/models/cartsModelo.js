import mongoose from "mongoose";

const cartsCollection="carts"
const cartsEsquema=new mongoose.Schema(
    {
        products: Array
    },
    {
        timestamps:true
    }
)

export const cartsModelo=mongoose.model(
    cartsCollection,
    cartsEsquema
)

//cartsModelo.find()