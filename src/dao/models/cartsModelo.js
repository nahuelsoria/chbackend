import mongoose, { mongo } from "mongoose";

const cartsCollection="carts"
const cartsEsquema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        },
        quantity: Number
    }]
},
    {
        timestamps: true
    }
)

export const cartsModelo=mongoose.model(
    cartsCollection,
    cartsEsquema
)

//cartsModelo.find()