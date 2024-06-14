import mongoose from "mongoose";

const usersCollection = "users";
const usersEsquema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
  },
  {
    timestamps: true,
  }
);

export const usersModelo = mongoose.model(usersCollection, usersEsquema);
