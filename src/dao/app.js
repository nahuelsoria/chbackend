import express from "express";
import {Server} from "socket.io"
import productsRouter from '../routers/products.js'
import cartRouter from '../routers/cart.js'
import { engine } from "express-handlebars";
import views from "../routers/views.js"
import mongoose from "mongoose";
import path from "path";
import __dirname from "../utils.js";
import { messagesModelo } from "./models/messagesModelo.js";

const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, '/public')));

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set('views', path.join(__dirname, '/views'));

app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartRouter);
app.use('/', views);

let usuarios = [];
//let mensajes = [];

const serverHTTP=app.listen(PORT,() => { //Server HTTP
    console.log(`Corriendo aplicacion en el puerto ${PORT}`)
})

let io = new Server(serverHTTP); //Server WebSocket
io.on("connection", socket =>{
  console.log(`Se conecto un cliente con el id ${socket.id}`)

  socket.on("id", async (email) =>{
    usuarios.push({id:socket.id, email})
    let messages=await messagesModelo.find().lean()
    messages=messages.map(m=>{
      return {email: m.email, message: m.message}
    })
    socket.emit("mensajesPrevios", messages)
    socket.broadcast.emit("nuevoUsuario", email)
  })

  socket.on("mensaje", async (email, message) => {
    //mensajes.push({nombre, mensaje})
    await messagesModelo.create({email: email, message})
    io.emit("nuevoMensaje", email, message)
  })

  socket.on("disconnect", () =>{
    let usuario=usuarios.find(u=>u.id===socket.id)
    if(usuario){
      io.emit("saleUsuario", usuario.email)
    }
  })
}) //Fin on connection

const connDB=async() =>{
  try{
    await mongoose.connect("mongodb+srv://nahuelsoria:1512111011a@cluster0.7hppgll.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=ecommerce")
    console.log("DB Online!")
  }catch(error){
    console.log("Error al conectar a DB", error.message)
  }
}

connDB()