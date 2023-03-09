import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
// const express = require("express");
import express from "express";
import { MongoClient } from "mongodb";
const app = express();

const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL;
const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");

app.use(express.json());

app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 Assigned mentor to student🎊✨🤩");
});


// student
app.get("/student",async function (request, response) {
    const result = await client.db("b42wd2").collection("student").find({}).toArray();
    response.send(result);
})

// mentor
app.get("/mentor",async function (request, response) {
    const result = await client.db("b42wd2").collection("mentor").find({}).toArray();
    response.send(result);
})

// insert student

app.post("/student", async function (request, response) {
    const data = request.body;
    const result = await client.db("b42wd2").collection("student").insertMany(data);
    response.send(result);
})

// insert mentor
app.post("/mentor", async function (request, response) {
    const data = request.body;
    const result = await client.db("b42wd2").collection("mentor").insertMany(data);
    response.send(result);
})

app.get("/student-details",async function (request, response) {
    const data = await client.db("b42wd2").collection("student").aggregate([{ $lookup: { from: "mentor", localField: "mentor_name", foreignField: "name", as: "assign mentor" } }]).toArray();
    response.send(data);
})

app.get("/mentor-student", async  function (request, response) {
    const data = await client.db("b42wd2").collection("mentor").aggregate([{ $lookup: { from: "student", localField: "name", foreignField: "mentor_name", as: "assinged_student" } },
    { $project: { _id: 0, name: 1, "assinged_student.name": 1 } }]).toArray();
  response.send(data);
});

app.put("/student/:id", async function (request, response) {
  const { id } = request.params;
  const data = request.body;
  const result = await client.db("b42wd2").collection("student").updateOne({ id: id }, { $set: data });
  response.send(result);
})

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
