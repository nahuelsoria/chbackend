import passport from "passport";
import local from "passport-local";
import { UserManagerMongo as UserManager } from "../dao/UserManagerMongo.js";
import { generaHash } from "../utils.js";

const u = new UserManager()

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
              return done(null, false)
          }
          let existe = await u.getBy({email:username});
          if (existe) {
            /* res.setHeader("Content-Type", "application/json");
            return res
              .status(400)
              .json({
                error: `Ya existe una cuenta creada con el e-mail ${email}.`,
              }); */
              return done(null,false)
          }

          password = generaHash(password);

            let cart = await c.createCart();
            let nuevoUsuario = await u.create({
              first_name,
              last_name,
              email:username,
              password,
              age,
              rol: "usuario",
              cart,
            });
            /* res.setHeader("Content-Type", "application/json");
            return res
              .status(200)
              .json({ message: `Registro correcto!`, nuevoUsuario }); */
              return done(null, nuevoUsuario)
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  //Paso 1) Solo si usamos sessions, configuro serializar/desserializar
};
