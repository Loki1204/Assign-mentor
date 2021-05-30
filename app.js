const express = require("express");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = process.env.URI;
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get("/mentors", async (req, res) => {
  try {
    let client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let data = await client
      .db("Mentor-StudentDB")
      .collection("mentors")
      .find()
      .toArray();
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "No data found" });
    }
    client.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/students", async (req, res) => {
  try {
    let client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let data = await client
      .db("Mentor-StudentDB")
      .collection("students")
      .find()
      .toArray();
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "No data found" });
    }
    client.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/mentors/:name", async (req, res) => {
  try {
    let client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let data = await client
      .db("Mentor-StudentDB")
      .collection("mentors")
      .find({ Name: req.params.name })
      .toArray();
    if (data) {
      res.status(200).json(data[0].StudentsAssigned);
    } else {
      res.status(404).json({ message: "No data found" });
    }
    client.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => console.log(`App runs in port : ${port}`));
