import express from "express";
import app from "./app.js";
import connectToDB from "./src/db/db.js";

app.use(express.json());

connectToDB();

app.listen(5000, () => {
  console.log("Server is running on port: 5000");
});
