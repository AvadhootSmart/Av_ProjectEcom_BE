const express = require("express");
const UserModel = require("./models/User");
const HeroProductsModel = require("./models/HeroProducts");
const ProductsModel = require("./models/Products");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { initializePassport } = require("./LocalAuth");
const { isAuthenticated } = require("./middlewares/isAuthenticated");
require("./Oauth");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());

initializePassport(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "jai Shree Ram",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//Local Authentication:

app.post("/register", async (req, res) => {
  const user = await UserModel.findOne({ username: req.body.username });

  if (user) return res.json({ user });

  const newUser = await UserModel.create(req.body);

  res.json({ newUser });
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.send({ user: req.user });
});

app.get("/user", isAuthenticated, (req, res) => {
  res.json({ message: "Welcome to the protected route!", user: req.user });
});

app.get("/HeroProducts", async (req, res) => {
  const HProducts = await HeroProductsModel.find();
  res.json(HProducts);
});

app.get("/Products", async (req, res) => {
  const Products = await ProductsModel.find();
  res.json(Products);
});

app.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  const Product = await ProductsModel.findById(id);
  res.json(Product);
});

app.post("/cart/product/:id", async (req, res) => {
  const id = req.params.id;
  const Product = await ProductsModel.findById(id);
  res.json({ message: "Added to cart!" });
});

app.listen(5000, () => {
  console.log("Server listening on http://localhost:5000");
  console.log("SignIn with Google on http://localhost:5000/auth/google");
});
