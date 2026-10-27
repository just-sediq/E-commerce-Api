const express = require("express");
const cartRouter = express.Router();
const {
  getAllCart,
  getCart,
  addToCart,
  deleteCart,
} = require("./cartController");

cartRouter.route(`/`).get(getAllCart);

cartRouter.route(`/:id`).get(getCart).post(addToCart).delete(deleteCart);

module.exports = cartRouter;
