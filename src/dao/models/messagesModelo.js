import mongoose from "mongoose";

const messagesCollection="messages"
const messagesEsquema=new mongoose.Schema(
    {
        email: String,
        message: String
    },
    {
        timestamps:true
    }
)

export const messagesModelo=mongoose.model(
    messagesCollection,
    messagesEsquema
)

//cartsModelo.find()