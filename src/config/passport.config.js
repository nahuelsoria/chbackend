import passport from "passport";
import local from "passport-local";
import { UserManagerMongo as UserManager } from "../dao/UserManagerMongo.js";
import { CartManagerMongo as CartManager } from "../dao/CartManagerMongo.js";
import { generaHash, validaPassword } from "../utils.js";

const u = new UserManager();
const c = new CartManager();

export const initPassport = () => {
  passport.use(
    "register",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          let { first_name, last_name, age, rol } = req.body;
          if (!first_name || !last_name || !age) {
            /*res.setHeader("Content-Type", "application/json");
            return res
              .status(400)
              .json({ error: `Complete los datos solicitados.` }); */
            return done(null, false);
          }
          let existe = await u.getBy({ email: username });
          if (existe) {
            /* res.setHeader("Content-Type", "application/json");
            return res
              .status(400)
              .json({
                error: `Ya existe una cuenta creada con el e-mail ${email}.`,
              }); */
            return done(null, false);
          }

          password = generaHash(password);

          let cart = await c.createCart();
          let nuevoUsuario = await u.create({
            first_name,
            last_name,
            email: username,
            password,
            age,
            rol: "usuario",
            cart,
          });
          /* res.setHeader("Content-Type", "application/json");
            return res
              .status(200)
              .json({ message: `Registro correcto!`, nuevoUsuario }); */
          return done(null, nuevoUsuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new local.Strategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          let user = await u.getBy({ email: username });
          if (!user) {
            /*             res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `Credenciales incorrectas.` }); */
            return done(null, false);
          }

          if (!validaPassword(password, user.password)) {
            /* res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `Credenciales incorrectas.` }); */
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Paso 1) Solo si usamos sessions, configuro serializar/desserializar
  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await u.getBy({ _id: id });
    return done(null, user);
  });
};
