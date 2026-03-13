import app from "./app.js";
import connectToDB from "./src/db/db.js";
import commodityRoutes from "./src/routes/commodities.routes.js";

const PORT = 5050;
app.use("/api", commodityRoutes);

connectToDB();

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

app.get("/ping", (req, res) => {
  res.send("Server working");
});
