import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default function connectToDB() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to the database bro"))
    .catch((err) => {
      console.log(err);
    });
}
