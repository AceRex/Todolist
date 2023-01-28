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

const listSchema = {
  name: String,
  items: [ItemSchema],
};

const List = mongoose.model("List", listSchema);

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

app.get("/:customListName", function (req, res) {
  const customListName = req.params.customListName;

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defualtItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newtodo: foundList.items,
        });
      }
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newtodo;
  const listName = req.body.list;

  const newItem = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  console.log(listName)

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (!err) {
        console.log("Delete Successful");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.post("/work", function (req, res) {
  let newtodo = req.body.newtodo;
  workItems.push(newtodo);
  res.redirect("/work");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen("4000", function () {
  console.log("Server is running correctly");
});
