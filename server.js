const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const url = process.env.TasneemDB;
//const port = 3000;
const port = process.env.PORT || 3000;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
  Form({ data: bodyData }).save((err) => {
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
  res.render('index');
});

app.get("/apply_ST", (req, res) => {
  res.render("student_form");
});
app.get("/apply_EB", (req, res) => {
  res.render("eb_form");
});
app.get("/gallery", (req, res) => {
  // res.sendFile(__dirname + "/views/gallery.html");
  res.render('gallery');
});
app.get("/secretariat", (req, res) => {
  // res.sendFile(__dirname + "/views/team.html");
  res.render('team');
});
app.get("/history", (req, res) => {
  // res.sendFile(__dirname + "/views/history.html");
  res.render('history');
});
app.post("/", urlencodedParser, (req, res) => {
  formData(req.body);
  res.render("success", { name: req.body.name });
});

app.listen(port, () => {
  console.log('Server up and running on PORT ', port);
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