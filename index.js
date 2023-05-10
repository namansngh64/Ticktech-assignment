require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const userRoutes = require("./user.route");
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  const mongod = await MongoMemoryServer.create({
    instance: { port: 64952, dbName: "TickTech" }
  });
  // console.log(mongod.getConnectionString());
  mongoose.set("strictQuery", true);
  mongoose
    .connect(mongod.getUri(), { dbName: "TickTech" })
    .then(() => {
      console.log("DB Connected!");
    })
    .catch((err) => {
      console.log(`DB Error: ${err}`);
    });
})();

app.use("/api", userRoutes);
let server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use("*", (req, res) => {
  return res.status(404).json({ error: "Invalid URL" });
});
module.exports = server;
