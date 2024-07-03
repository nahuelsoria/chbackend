import jwt from "jsonwebtoken";
import { SECRET } from "../utils.js";

export const auth = (req, res, next) => {
  //console.log(req.headers)
  /* if (!req.session.user) { Cuando habia sessions instalado.
    res.setHeader("Content-Type", "application/json");
    return res.status(401).json({ error: `No existen usuarios autenticados.` });
  } */
    console.log(req.cookies)
    if(!req.cookies["codercookie"]){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Usuario no autenticado`})
    }

    let token=req.cookies["codercookie"]
    console.log({token})
    try {
        let user=jwt.verify(token, SECRET)
        req.user=user
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`${error}`})
    }

  next();
};