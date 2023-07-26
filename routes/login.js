const express = require("express");
const router = express.Router();
const jsonwebtoken = require("jsonwebtoken");
const request = require("request");
const User = require("../models/users");
require("dotenv").config();

router.use(function (req, res, next) {
  res.locals.email = "";
  next();
});

router.get("/", (req, res) => {
  // The render method takes the name of the HTML
  // page to be rendered as input.
  // This page should be in views folder in
  // the root directory.
  // We can pass multiple properties and values
  // as an object, here we are passing the only name
  res.render("home", { email: "" });
});
// secure verification route.
router.get("/super-secure-resource", (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Not Authorized" });
  }

  // Bearer <token>>
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  console.log("token", token);
  try {
    // Verify the token is valid
    const { email } = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      email: email,
      message: `Congrats ${email}! You can now accesss the super secret resource`,
    });
    // req.session with xpress session
  } catch (error) {
    return res.status(401).json({ error: "Token Verification Failed" });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(`${email} is trying to login ..`);

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      // Handle case where user is not found
      return res.status(404).send("User not found");
    }
    // Handle case where user is found
    // Check password
    if (user.password !== password) {
      // Incorrect password
      return res.status(401).send("Incorrect password");
    }
    // Login successful
    const token = jsonwebtoken.sign({ email: email }, process.env.JWT_SECRET);
    const options = {
      url: "http://localhost:4000/super-secure-resource",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    request.get(options, (err, response, body) => {
      if (err) {
        // Handle error
        return res.status(500).send("Internal server error 1");
      }
      // Render the protected page with the response data
      const data = JSON.parse(body);
      const { email } = data;
      res.render("home", { email: email });
    });
  } catch (error) {
    console.log("error", error);
    // Handle any errors that occur during the query
    return res.status(500).send(error);
  }
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  // Create a new user
  const newUser = new User({
    name: name,
    email: email,
    password: password,
  });

  try {
    const user = await newUser.save(); // Make sure to wrap this code in an async function
    console.log("User created successfully", user);
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
});

router.get("/logout", function (req, res) {
  res.redirect("/");
});

router.get("/admin-login", function (req, res) {
  res.render("adminLogin");
});

module.exports = router;
