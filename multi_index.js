require("dotenv").config();
const express = require("express");
const app = express();
const cluster = require("cluster");
const axios = require("axios");
const numCPUs = require("os").cpus().length;
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const userRoutes = require("./user.route");

const port = process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (cluster.isMaster) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  (async () => {
    const mongod = await MongoMemoryServer.create({
      instance: { port: 64952, dbName: "TickTech" }
    });
    //Creating workers
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork({ PORT: parseInt(port) + i + 1, URI: mongod.getUri() });
    }
  })();

  const serverMain = "http://localhost:";
  let current = 0;
  const handler = async (req, res) => {
    const { method, url, body } = req;

    // Select the current server to forward the request
    //! LOAD BALANCER (ROUND-ROBIN)
    const server = serverMain + (parseInt(port) + (current + 1)) + "/api";
    current = (current + 1) % numCPUs;
    try {
      const response = await axios({
        url: `${server}${url}`,
        method: method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          withCredentials: true
        },
        data: body
      });
      console.log(`${server}${url}`);
      res.status(response.status).send(response.data);
    } catch (err) {
      res.status(err.response.status).send(err.response.data);
    }
  };
  app.use("/api", (req, res) => {
    handler(req, res);
  });
  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Invalid URL" });
  });
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  app.use("/api", userRoutes);
  app.listen(port, () => {
    console.log(`Worker running on port ${port}`);
  });
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.URI, { dbName: "TickTech" })
    .then(() => {
      console.log(`DB Connected for worker with port ${port}`);
    })
    .catch((err) => {
      console.log(`DB Error: ${err}`);
    });
  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Invalid URL" });
  });
}
