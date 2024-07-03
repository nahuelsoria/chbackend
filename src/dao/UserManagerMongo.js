import { usersModelo } from "./models/usersModelo.js";

export class UserManagerMongo {
  async create(usuario) {
    let nuevoUsuario = await usersModelo.create(usuario);
    return nuevoUsuario.toJSON();
  }

  async getUsers(){
    return await usersModelo.find()
  }

  async getBy(filtro = {}) {
    return await usersModelo.findOne(filtro).lean();
  }

  async getByPopulate(filtro = {}) {
    return await usersModelo.findOne(filtro).populate("cart").lean();
  }
}