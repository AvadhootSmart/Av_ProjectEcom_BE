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
const { initializeGoogleAuth } = require("./Oauth");
const bodyParser = require("body-parser");
const app = express();

app.use(express.json());
app.use(cors());

initializePassport(passport);
initializeGoogleAuth(passport);

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

app.post("/login", passport.authenticate("local"), async (req, res) => {
  const User = req.user;
  const user = await UserModel.findOne({
    username: User.username,
  }).populate("cart.items.product");
  res.send({ user });
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

app.post("/add-to-cart", async (req, res) => {
  const { productId, userId } = req.body;

  try {
    const product = await ProductsModel.findById(productId);
    const user = await UserModel.findById(userId);

    if (!product || !user) {
      return res.status(404).json({ message: "Product or User not found" });
    }

    const cartItem = user.cart.items.find((item) => item.product == productId);

    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      user.cart.items.push({ product: productId });
    }

    // Update total price
    user.cart.totalPrice += product.discountPrice;

    await user.populate("cart.items.product");

    await user.save();

    res.json({
      message: "Added To cart",
      data: user.cart,
    });
  } catch (error) {
    console.error("Error adding to cart", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/cart/:id", async (req, res) => {
  const id = req.params.id;
  const User = await UserModel.findById(id);
  const cartDetails = User.cart;

  res.json({ cart: cartDetails });
});

//Google Auth
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/Login",
  }),
  (req, res) => {
    // Successful authentication, redirect to the home page
    res.redirect("http://localhost:5173/");
  }
);

app.listen(5000, () => {
  console.log("Server listening on http://localhost:5000");
  console.log("SignIn with Google on http://localhost:5000/auth/google");
});
