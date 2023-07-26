const express = require("express");
const app = express();
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
require("./config/database").connect();
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const login = require("./routes/login");
// Set EJS as templating engine
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.engine("ejs", ejs.renderFile);
app.use(cookieParser());
app.use("/", login);

app.get("/home", async (req, res) => {
  console.log("Got a GET request for the homepage");

  // Create a new user
  // const newUser = new User({
  //   name: "admin",
  //   email: "admin@example.com",
  //   password: "admin",
  // });

  // try {
  //   const user = await newUser.save(); // Make sure to wrap this code in an async function
  //   console.log("User created successfully", user);
  //   res.send("Hello GET", user);
  // } catch (err) {
  //   console.log(err);
  // }
});

const server = app.listen(4000, function () {
  console.log("listening to port 4000 on http://localhost:4000/");
});
