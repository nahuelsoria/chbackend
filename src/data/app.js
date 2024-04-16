import express from "express";
import {Server} from "socket.io"
import productsRouter from '../routers/products.js'
import cartRouter from '../routers/cart.js'
import { engine } from "express-handlebars";
import views from "../routers/views.js"

const app = express();
const PORT = 8080;
let serverSocket;

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("./public"))

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", '../views/')

app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartRouter);
app.use('/', views);

const serverHTTP=app.listen(PORT,() => {
    console.log(`Corriendo aplicacion en el puerto ${PORT}`)
})

//const io = new Server(serverHTTP);
serverSocket=new Server(serverHTTP);

serverSocket.on("connection", socket =>{
  console.log(`Se conecto un cliente con el id ${socket.id}`)
  socket.emit("saludo", "Bienvenido")

  socket.on("id", nombre =>{
    console.log(`El cliente con ID ${socket.id} se ha identificado como ${nombre}`)
  })
}) //Fin on connection