const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const { Parser } = require("json2csv");
const { DH_CHECK_P_NOT_PRIME } = require("constants");

const moment = require("moment");

dotenv.config();

const url = process.env.TasneemDB;
const port = process.env.PORT || 3000;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

const formSchema = new mongoose.Schema(
  {
    data: Object,
  },
  { collection: `registered` }
);

const Form = mongoose.model("Form", formSchema);

const formData = (bodyData) => {
  const newBodyData = { created: new Date().toString(), ...bodyData };
  Form({ data: newBodyData }).save((err) => {
    if (err) {
      throw err;
    }
  });
};

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function (req, res) {
  // res.sendFile(__dirname + "/views/index.html");
  res.render("index");
});

app.get("/history", (req, res) => {
  //res.sendFile(__dirname + "/views/history.html");
  res.render("history");
});
app.get("/apply_ST", (req, res) => {
  res.render("student_form");
});
app.get("/apply_EB", (req, res) => {
  res.render("eb_form");
});
app.get("/gallery", (req, res) => {
  // res.sendFile(__dirname + "/views/gallery.html");
  res.render("gallery");
});
app.get("/secretariat", (req, res) => {
  // res.sendFile(__dirname + "/views/team.html");
  res.render("team");
});
app.get("/history", (req, res) => {
  // res.sendFile(__dirname + "/views/history.html");
  res.render("history");
});
app.post("/", urlencodedParser, (req, res) => {
  formData(req.body);
  res.render("success", { name: req.body.name });
});

// Route to create the excel sheet of all participants
app.get("/student-application-list", async (req, res) => {
  const ebs = await Form.find({ "data.category": "student" });
  if (!ebs.length) return res.redirect("/");
  const filteredEbs = ebs.map((eb) => {
    return { ...eb.data };
  });
  const json2csvParser = new Parser({});
  const csv = json2csvParser.parse(filteredEbs);
  fs.writeFileSync("students.csv", csv, function (err) {
    if (err) throw err;
  });
  res.redirect("/student-application-list-download");
});

// Route to download the excel sheet of all participants
app.get("/student-application-list-download", (req, res) => {
  res.download(__dirname + "/students.csv", "students.csv");
  // res.redirect("/");
});

// Route to create the excel sheet of all ebs
app.get("/eb-application-list", async (req, res) => {
  const ebs = await Form.find({ "data.category": "eb" });
  if (!ebs.length) return res.redirect("/");
  const filteredEbs = ebs.map((eb) => {
    return { ...eb.data };
  });
  const json2csvParser = new Parser({});
  const csv = json2csvParser.parse(filteredEbs);
  fs.writeFileSync("ebs.csv", csv, function (err) {
    if (err) throw err;
  });
  res.redirect("/eb-application-list-download");
});

// Route to download the excel sheet of all ebs
app.get("/eb-application-list-download", (req, res) => {
  res.download(__dirname + "/ebs.csv", "ebs.csv");
  // res.redirect("/");
});

app.get("/student-applicants-list", async (req, res) => {
  const applicants = await Form.find({ "data.category": "student" });
  const filteredData = applicants.map((doc) => doc.data);
  filteredData.forEach(data=>{
    const date = new Date(data.created);
    data.created = moment(date).utcOffset(330).format("Do MMM, h:mm:ss a");
  })
  res.render("student-applicants", {
    applicants: filteredData,
  });
});

app.get("/eb-applicants-list", async (req, res) => {
  const applicants = await Form.find({ "data.category": "eb" });
  const filteredData = applicants.map((doc) => doc.data);
  filteredData.forEach(data=>{
    const date = new Date(data.created);
    data.created = moment(date).utcOffset(330).format("Do MMM, h:mm:ss a");
  })
  res.render("eb-applicants", {
    applicants: filteredData,
  });
});

app.listen(port, () => {
  console.log("Server up and running on PORT ", port);
});

// Script to delete all the participants from the data
// const fun = async ()=>{
//     const participants = await Form.find();
//     participants.forEach(async (doc)=>{
//       await Form.findByIdAndDelete(doc._id);
//     })
//     console.log('Participants ', participants);
// }

// fun();
