import { Router } from "express";
import { UserManagerMongo as UserManager } from "../dao/UserManagerMongo.js";
import { generaHash, validaPassword } from "../utils.js";
import { CartManagerMongo as CartManager } from "../dao/CartManagerMongo.js";
import passport from "passport";

export const router = Router();

const u = new UserManager();
const c = new CartManager();

router.get("/error", (req, res)=>{
  res.setHeader('Content-Type','application/json')
  return res.status(500).json(
    {
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
    }
  )
})

//Paso 3 de Passport.
router.post("/register", passport.authenticate("register", {failureRedirect: "/api/sessions/error"}) , async (req, res) => {
  /* let { first_name, last_name, email, password, age, rol } = req.body;
  if (!first_name || !last_name || !email || !password || !age) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Complete los datos solicitados.` });
  }

  let existe = await u.getBy({ email: email });
  if (existe) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `Ya existe una cuenta creada con el e-mail ${email}.` });
  }

  password = generaHash(password);

  try {
    let cart = await c.createCart();
    let nuevoUsuario = await u.create({
      first_name,
      last_name,
      email,
      password,
      age,
      rol: "usuario",
      cart,
    });
    res.setHeader("Content-Type", "application/json");
    return res
      .status(200)
      .json({ message: `Registro correcto!`, nuevoUsuario });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor. Intente mas tarde.`,
      detalle: `${error.message}`,
    });
  } */

    //Si sale todo OK Passport deja un req.user
    res.setHeader('Content-Type','application/json');
    return res.status(201).json({mensaje:"Registro OK", nuevoUsuario: req.user})
});

router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/error"}) , async (req, res) => {
  /* let { email, password } = req.body;
  if (!email || !password) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Complete los datos solicitados.` });
  } */

  /* if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    let user = {
      first_name: "admin",
      email: "adminCoder@coder.com",
      password: "adminCod3r123",
      rol: "admin",
    };
    
    user = { ...user };
    delete user.password;
    req.session.user = user;
    res.setHeader("Content-Type", "application/json");
    return res.redirect("/products");
  } */

  //let user = await u.getBy({ email, password: generaHash(password) });
  /* let user = await u.getBy({email});
  if (!user) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Credenciales incorrectas.` });
  }

  if(!validaPassword(password, user.password)){
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Credenciales incorrectas.` });
  } */

  let user = { ...req.user };
  delete user.password;
  req.session.user = user;
  res.setHeader("Content-Type", "application/json");
  res.redirect("/products");
  //return res.status(200).json({payload:`Login correcto!`, user})
});

router.get("/logout", (req, res) => {
  req.session.destroy((e) => {
    if (e) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  });

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ payload: `Logout exitoso!` });
});