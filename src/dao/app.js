import express from "express";
import cookieParser from "cookie-parser";
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
app.use(cookieParser())

app.get('/setcookies', (req, res) =>{
  let datos= {nombre: "Juan", rol:"user"}
  
  res.cookie("coockie1", "valor cookie 1", {})
  res.cookie("cookie2", datos, {maxAge: 1000*60})
  res.cookie("cookie3", datos, {expires: new Date(2024, 8, 10)})

  res.setHeader('Content-Type', 'text/plain')
  res.status(200).send('OK')
})

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