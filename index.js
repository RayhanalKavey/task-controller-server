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
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hufticd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
//-------------------------------
async function run() {
  try {
    //Collections
    //User Collection --1
    const userCollection = client.db("taskController").collection("users");
    //Task Collection --2
    const taskCollection = client.db("taskController").collection("tasks");
  } finally {
  }
}
//-------------------------------

app.get("/", (req, res) => {
  res.send("Welcome to the Task Controller server");
});

app.listen(port, () => {
  console.log(`Task Controller server is running on port: ${port}`);
});
