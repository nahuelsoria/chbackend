import passport from "passport";
import local from "passport-local";

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
            res.setHeader("Content-Type", "application/json");
            return res
              .status(400)
              .json({ error: `Complete los datos solicitados.` });
          }

          let existe = await u.getBy({ email: email });
          if (existe) {
            res.setHeader("Content-Type", "application/json");
            return res
              .status(400)
              .json({
                error: `Ya existe una cuenta creada con el e-mail ${email}.`,
              });
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
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  //Paso 1) Solo si usamos sessions, configuro serializar/desserializar
};
