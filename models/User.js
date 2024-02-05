const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Ecom");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  pfp: String,
  googleID: String,
  googleName: String,
  address: {
    street: String,
    city: String,
    state: String,
    pinCode: String,
    country: String,
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Users", UserSchema);
