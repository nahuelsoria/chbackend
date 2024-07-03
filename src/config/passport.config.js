import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { UserManagerMongo as UserManager } from "../dao/UserManagerMongo.js";
import { CartManagerMongo as CartManager } from "../dao/CartManagerMongo.js";
import { generaHash, validaPassword } from "../utils.js";
import passportJWT from "passport-jwt"
import {SECRET} from "../utils.js"

const u = new UserManager();
const c = new CartManager();

const buscaToken=(req)=>{
  let token = null

  if(req.cookies["codercookie"]){
    token=req.cookies["codercookie"]
  }

  return token
}

export const initPassport = () => {
 

  passport.use(
    "jwt",
    new passportJWT.Strategy(
      {
        secretOrKey: SECRET,
        jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([buscaToken])
      },
      async (contentToken ,done)=>{ //Usuario (El token suele tener datos del usuario)
        try {
          return done(null, contentToken)
        } catch (error) {
          return done(error)
        }
      }
    )
  )

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
          if(username=="adminCoder@coder.com" && password=="adminCod3r123"){
                        
            let user={
                _id: "idAdmin", first_name: "admin", email: username, 
                cart: "6674b594b7a3908ed1fd64cf", rol: "admin"
            }
            //console.log(user)
            return done(null, user)
        }
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
          delete user.password
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: "Iv23liNbEfsUOaxQTbfT",
        clientSecret: "d033c87e82dcf7ef9d5bdcc83d14213eb4f53ac5",
        callbackURL: "http://localhost:8080/api/sessions/callbackGithub"
      },
      async (tokenAcceso, tokenRefresh, profile, done) => {
        try {
          //console.log(profile)
          let email = profile._json.email;
          let name = profile._json.name;
          let user = await u.getBy({ email });
          if (!user) {
            user = await u.create({ name, email, profile });
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
    let user
    if(id==="idAdmin"){
        user={
            _id: "idAdmin", first_name: "admin", email: "adminCoder@coder.com", 
            cart: "6674b594b7a3908ed1fd64cf", rol: "admin"
        }
    }
    else{
    user = await u.getBy({ _id: id });
  }
  return done(null, user);
  });
};
