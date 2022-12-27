const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5005;

//Middle ware
app.use(cors());
app.use(express.json());

//DB connection
const uri =
  "mongodb+srv://<username>:<password>@cluster0.hufticd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

app.get("/", (req, res) => {
  res.send("Welcome to the Task Controller server");
});

app.listen(port, () => {
  console.log(`Task Controller server is running on port: ${port}`);
});
