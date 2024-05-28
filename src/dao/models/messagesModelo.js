import mongoose from "mongoose";

const messagesCollection="messages"
const messagesEsquema=new mongoose.Schema(
    {
        user: String,
        message: String
    },
    {
        timestamps:true
    }
)

export const cartsModelo=mongoose.model(
    messagesCollection,
    messagesEsquema
)

//cartsModelo.find()