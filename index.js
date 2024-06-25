const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.hvsdcgj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();

    const collection = client.db("Doodle_Nation");

    const items = collection.collection("Popular_Products");
    const userData = collection.collection("user submitted data");

    app.get("/items", async (req, res) => {
      const cursor = items.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await items.findOne(query);
      res.send(result);
    });

    app.post("/data", async (req, res) => {
      const data = req.body;
      const result = await userData.insertOne(data);
      res.send(result);
    });

    app.get("/data", async (req, res) => {
      const cursor = userData.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port);
