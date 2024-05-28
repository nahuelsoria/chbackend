import express from "express";
import {Server} from "socket.io"
import productsRouter from '../routers/products.js'
import cartRouter from '../routers/cart.js'
import { engine } from "express-handlebars";
import views from "../routers/views.js"
import mongoose from "mongoose";

const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", '../views/')

app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartRouter);
app.use('/', views);

const serverHTTP=app.listen(PORT,() => { //Server HTTP
    console.log(`Corriendo aplicacion en el puerto ${PORT}`)
})

let io = new Server(serverHTTP); //Server WebSocket
io.on("connection", socket =>{
  console.log(`Se conecto un cliente con el id ${socket.id}`)
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