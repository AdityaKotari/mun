const express = require("express");
const app = express();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

const url = process.env.TasneemDB;
//const port = 3000;
const port = process.env.PORT


mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

app.get("/apply_ST", (req, res) => {
  res.render("student_form");
});
app.get("/apply_EB", (req, res) => {
  res.render("eb_form");
});
app.get("/gallery", (req, res) => {
  res.sendFile(__dirname + '/views/gallery.html');
});
app.get("/secretariat", (req, res) => {
  res.sendFile(__dirname + '/views/team.html');
});
app.get("/history", (req, res) => {
  res.sendFile(__dirname + '/views/history.html');
});
app.post("/", urlencodedParser, (req, res) => {
  formData(req.body);
  res.render("success", { name: req.body.name });
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


server.listen(port);
console.log("Server listening at "+port+"...");