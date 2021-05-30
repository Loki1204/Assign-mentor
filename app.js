const express = require("express");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = process.env.URI;
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

// List of Mentors and Students assigned to them
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

// List of Students and their Mentor
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

// List of Students assigned to the particular Mentor
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

// Updating the Mentor for a particular Student
app.put("/students/:name", async (req, res) => {
  try {
    let client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let data = await client
      .db("Mentor-StudentDB")
      .collection("students")
      .find({ Name: req.params.name })
      .toArray();
    if (!data[0].MentorAssigned) {
      await client
        .db("Mentor-StudentDB")
        .collection("students")
        .updateOne({ Name: req.params.name }, { $set: req.body });
      res.status(200).json({ message: "Mentor updated" });
    } else {
      res.status(406).json({ message: "Mentor already assigned" });
    }
    client.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Updating the Students for a paarticular Mentor
app.put("/mentors/:name", async (req, res) => {
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
    if (data[0].StudentsAssigned.length === 4) {
      res
        .status(406)
        .json({ message: "Maximum number of Students assigned to the Mentor" });
    } else if (data[0].StudentsAssigned.length < 4) {
      await client
        .db("Mentor-StudentDB")
        .collection("mentors")
        .updateOne(
          { Name: req.params.name },
          {
            $addToSet: {
              StudentsAssigned: { $each: req.body.StudentsAssigned },
            },
          }
        );
      res.status(200).json({ message: "Student added to Mentor" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`App runs in port : ${PORT}`));
