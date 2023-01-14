const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

app.set("view engine", "ejs");

const ItemSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", ItemSchema);

const item1 = new Item({
  name: "Pray",
});
const item2 = new Item({
  name: "Eat",
});
const item3 = new Item({
  name: "Sleep",
});

const defualtItems = [item1, item2, item3];

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defualtItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("insert in to many successfully");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newtodo: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newtodo;

  const newItem = new Item({
    name: itemName
  })

  newItem.save()

  res.redirect("/")
 
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newtodo: workItems });
});

app.post("/work", function (req, res) {
  let newtodo = req.body.newtodo;
  workItems.push(newtodo);
  res.redirect("/work");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen("3000", function () {
  console.log("Server is running correctly");
});
