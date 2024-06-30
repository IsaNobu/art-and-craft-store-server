const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

const corsConfig = {
  origin: ["https://assignment-10-2417c.web.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsConfig));
app.options("", cors(corsConfig));

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

    app.get("/item-details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userData.findOne(query);
      res.send(result);
    });

    app.put("/item-details/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const update = req.body;
      const item = {
        $set: {
          itemName: update.itemName,
          url: update.url,
          price: update.price,
          rating: update.rating,
          Customizability: update.Customizability,
          stockStatus: update.stockStatus,
        },
      };
      const result = await userData.updateOne(filter, item, option);
      res.send(result);
    });

    app.delete("/item-details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userData.deleteOne(query);
      res.send(result);
    });

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
