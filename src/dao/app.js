import express from "express";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import productsRouter from "../routers/products.js";
import cartRouter from "../routers/cart.js";
import { engine } from "express-handlebars";
import views from "../routers/views.js";
import mongoose from "mongoose";
import path from "path";
import __dirname from "../utils.js";
import { messagesModelo } from "./models/messagesModelo.js";
import sessions from "express-session";
import { auth } from "../middleware/auth.js";
import { router as sessionsRouter } from "../routers/sessions.js";
import MongoStore from "connect-mongo";
import passport from "passport";
import { initPassport } from "../config/passport.config.js";
//import FileStore from 'session-file-store'

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(
  sessions({
    secret: "CoderCoder123",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      ttl: 3600,
      mongoUrl: "mongodb+srv://nahuelsoria:1512111011a@cluster0.7hppgll.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=sessionsstorage"
    })
  })
);

//Paso 2 de Passport

initPassport()
app.use(passport.initialize())
app.use(passport.session()); //Solo si uso sessions.

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", views);
app.use(cookieParser("CoderCoder123"));

app.get("/", (req, res) => {
     /* if(req.session.contador){
    req.session.contador++
  }else{
    req.session.contador=1
  } */
 
  res.setHeader("Content-Type", "text/plain");
  res.redirect("/login");
});

app.get("/datos", auth, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ datos: "DATOS...!!!", session: req.session });
});

app.get("/login", (req, res) => {
  let { user, password } = req.query;
  if (!user || !password) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Complete user y password.` });
  }

  if (user != "juan" && password != "CoderCoder123") {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Credenciales incorrectas.` });
  }

  req.session.user = user;

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ message: `Login correcto.`, user });
});

app.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor. Intente mas tarde.`,
        detalle: `${error.message}`,
      });
    }
  });

  res.setHeader("Content-Type", "application/json");
  res.redirect("/login");
});

app.get("/setcookies", (req, res) => {
  let datos = { nombre: "Juan", rol: "user" };

  res.cookie("cookie1", "valor cookie 1", {});
  res.cookie("cookie2", datos, { maxAge: 1000 * 60 });
  res.cookie("cookie3", datos, { expires: new Date(2024, 8, 10) });
  res.cookie("cookie3Firmada", datos, {
    signed: true,
    expires: new Date(2024, 8, 10),
  });

  res.setHeader("Content-Type", "text/plain");
  res.status(200).send("OK");
});

app.get("/getcookies", (req, res) => {
  let cookies = req.cookies;
  let cookiesFirmadas = req.signedCookies;

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ cookies });
});

app.get("/delcookies", (req, res) => {
  //res.clearCookie("cookie2") Elimina una cookie determinada.

  Object.keys(req.cookies).forEach((c) => res.clearCookie(c));
  Object.keys(req.signedCookies).forEach((c) => res.clearCookie(c));

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ msg: "Cookies eliminadas." });
});

let usuarios = [];
//let mensajes = [];

const serverHTTP = app.listen(PORT, () => {
  //Server HTTP
  console.log(`Corriendo aplicacion en el puerto ${PORT}`);
});

let io = new Server(serverHTTP); //Server WebSocket
io.on("connection", (socket) => {
  console.log(`Se conecto un cliente con el id ${socket.id}`);

  socket.on("id", async (email) => {
    usuarios.push({ id: socket.id, email });
    let messages = await messagesModelo.find().lean();
    messages = messages.map((m) => {
      return { email: m.email, message: m.message };
    });
    socket.emit("mensajesPrevios", messages);
    socket.broadcast.emit("nuevoUsuario", email);
  });

  socket.on("mensaje", async (email, message) => {
    //mensajes.push({nombre, mensaje})
    await messagesModelo.create({ email: email, message });
    io.emit("nuevoMensaje", email, message);
  });

  socket.on("disconnect", () => {
    let usuario = usuarios.find((u) => u.id === socket.id);
    if (usuario) {
      io.emit("saleUsuario", usuario.email);
    }
  });
}); //Fin on connection

const connDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://nahuelsoria:1512111011a@cluster0.7hppgll.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=ecommerce"
    );
    console.log("DB Online!");
  } catch (error) {
    console.log("Error al conectar a DB", error.message);
  }
};

connDB();