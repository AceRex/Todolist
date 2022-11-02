const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let newtodos = [];
let workItems = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  let day = today.toLocaleDateString("en-US", options);

  res.render("list", { listTitle: day, newtodo: newtodos });
});

app.post("/", function (req, res) {

  newtodo = req.body.newtodo;

  if (req.body.list === "Work") {
    workItems.push(newtodo);
    res.redirect("/work");
  } else {
    newtodos.push(newtodo);

    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newtodo: workItems });
});

app.post("/work", function (req, res) {
  let newtodo = req.body.newtodo;
  workItems.push(newtodo);
  res.redirect("/work");
});

app.listen("3000", function () {
  console.log("Server is running correctly");
});
