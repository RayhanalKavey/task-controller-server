const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5005;

const tasks = require("./task.json");

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
    //Task Collection --3 //not used
    const commentCollection = client
      .db("taskController")
      .collection("comments");

    //--2 Post comment for completed tasks
    app.put("/tasks/comments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const comment = req.body;
      // console.log(comment.comment);
      const options = { upsert: true };
      const updatedDoc = { $set: { taskComment: comment.comment } };
      const result = await taskCollection.updateOne(query, updatedDoc, options);
      res.send(result);
    });
    //--2 remove comment for completed tasks
    app.put("/tasks/comments/remove-comment/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = { $set: { taskComment: "" } };
      const result = await taskCollection.updateOne(query, updatedDoc, options);
      res.send(result);
    });

    //--2 Get all task for adding tasks
    app.get(`/tasks`, async (req, res) => {
      const query = {};
      const tasks = await taskCollection.find(query).toArray();
      res.send(tasks);
    });

    //--2 Post task for adding tasks
    app.post("/tasks", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });
    app.put("/tasks-edit/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const task = req.body;
      const options = { upsert: true };
      const updatedDoc = {
        $set: { taskTitle: task?.taskTitle, taskDetails: task?.taskDetails },
      };
      const result = await taskCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    //--2 Update task
    app.put("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = { $set: { isComplete: true } };
      const result = await taskCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    //--2 Update task
    app.put("/tasks/not-complete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = { $set: { isComplete: false } };
      const result = await taskCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    // // //--4 deleting task
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);
//-------------------------------
// app.get("/tasks", (req, res) => {
//   res.send(tasks);
// });

app.get("/", (req, res) => {
  res.send("Welcome to the Task Controller server");
});

app.listen(port, () => {
  console.log(`Task Controller server is running on port: ${port}`);
});
