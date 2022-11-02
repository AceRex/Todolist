const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let newtodos = [];


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  let today = new Date();
  
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }
  let day = today.toLocaleDateString("en-US", options);

  res.render("list", { day: day, newtodo: newtodos});
});

app.post("/", function (req, res){
  newtodo = req.body.newtodo;

  newtodos.push(newtodo)

  res.redirect("/");

})

app.listen("3000", function () {
  console.log("Server is running correctly");
});
