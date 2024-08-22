const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

const corsConfig = {
  origin: ["https://assignment-10-2417c.web.app", "http://localhost:5173"],
  credentials: true,
  optionSuccessStatus: 200,
  // methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsConfig));
// app.options("", cors(corsConfig));

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
      const product = req.body;
      const updateDoc = {
        $set: {
          item_name: product.itemName,
          url: product.url,
          price: product.price,
          rating: product.rating,
          Customizability: product.Customizability,
          stockStatus: product.stockStatus,
        },
      };
      const result = await userData.updateOne(filter, updateDoc, option);
      console.log(result);

      res.send(result);
    });

    app.delete("/item-details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userData.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port);
