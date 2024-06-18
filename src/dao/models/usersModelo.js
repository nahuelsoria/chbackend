import mongoose from "mongoose";

const usersCollection = "users";
const usersEsquema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    password: String,
    age: Number,
    rol: {
      type: String,
      default: "usuario",
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cart",
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const usersModelo = mongoose.model(usersCollection, usersEsquema);
