import passport from 'passport'
import local from 'passport-local'

export const initPassport=()=>{

    passport.use(
        "register",
        new local.Strategy(
            {
                usernameField:"email",
                passReqToCallback: true
            },
            async(req, username, password, done)=>{
                try {
                    
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
    //Paso 1) Solo si usamos sessions, configuro serializar/desserializar

}