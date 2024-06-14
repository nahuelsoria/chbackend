import { Router } from "express";
import {UserManagerMongo as UserManager} from '../dao/UserManagerMongo.js'
import { generaHash } from "../utils.js";

export const router = Router()

const u = new UserManager()

router.post('/register', async (req, res) =>{
    let {name, email, password} = req.body
    if(!name || !email || !password){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error:`Complete los datos solicitados.`})
    }

    let existe = await u.getBy({email:email})
    if(existe){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error:`Ya existe una cuenta creada con el e-mail ${email}.`})
    }

    password=generaHash(password)

    try {
        let nuevoUsuario = await u.create({name, email, password})
    res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({message: `Registro correcto!`, nuevoUsuario })
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            error: `Error inesperado en el servidor. Intente mas tarde.`,
            detalle: `${error.message}`,
          })
    }
})

router.post('/login', async (req, res) =>{
    let {email, password} = req.body
    if(!email || !password){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error:`Complete los datos solicitados.`})
    }

    let user = await u.getBy({email, password: generaHash(password)})
    if(!user){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error:`No existe una cuenta creada con el e-mail ${email}.`})
    }

    user={...user}
    delete user.password
    req.session.user=user
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({payload:`Login correcto!`, user})

})

router.get('/logout', (req, res) =>{
    req.session.destroy(e=>{
        if(e){
            console.log(error)
            res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      })
        }
    })

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({payload: `Logout exitoso!` })
})