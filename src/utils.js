import { fileURLToPath } from "url";
import { dirname } from "path";
import crypto from "crypto"
import bcrypt from 'bcrypt'

// auyhqknlgzudwogs Contraseña de aplicación GMAIL.

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

export default _dirname;
const SECRET = "CoderCoder123"
//export const generaHash=password =>crypto.createHmac("sha256", SECRET).update(password).digest("hex")
export const generaHash=password =>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaPassword=(password, passwordHash) => bcrypt.compareSync(password, passwordHash)