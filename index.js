const express = require('express');
const cors = require('cors');
const app = express();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fhhp5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

  try {
    await client.connect()
    const vegetableCollection = client.db("groceryShop").collection("vegetable");



    // Data Post
    app.post("/vegetable", async (req, res) => {
      const veg = req.body;
      const result = await vegetableCollection.insertOne(veg);
      res.json(result);

    })

    
    // Data Received
    app.get("/vegetable", async (req, res) => {
      const query = {}
      const cursor = vegetableCollection.find(query)
      const vegetables = await cursor.toArray()
      res.send(vegetables)
    })

    // Single package Received
    app.get("/vegetable/:id", async (req, res) => {
      const id = req.params;
      console.log("getting specific place", id);
      const query = { _id: ObjectId(id) };
      const vegetable = await vegetableCollection.findOne(query);
      res.send(vegetable);
    });

    
    // Update Quantity
    app.put("/vegetable/:id", async (req, res) => {
      const id = req.params.id;
      const updatedStock = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDocument = {
        $set: updatedStock
      };
      const result = await vegetableCollection.updateOne(
        filter,
        updateDocument,
        options
      );
      console.log("updating", id);
      res.send(result);
    });


    
    // Delete From Inventory
    app.delete("/vegetable/:id", async (req, res) => {
      const id = req.params;
      const query = { _id: ObjectId(id) };
      const result = await vegetableCollection.deleteOne(query);
      res.send(result);
    });

  }
  finally {
    // await client.close()
  }


}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send("Grocery Manager Running")
})

app.listen(port, () => {
  console.log("Listening on port", port);
})
