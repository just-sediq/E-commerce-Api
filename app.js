const express = require("express");
const app = express();
const morgan = require("morgan");

const productRouter = require(`./products/productRoute`);

const cartRouter = require(`./cart/cartRoute`);
const PORT = 2400;

//MIDDLEWARE
app.use(express.json());
app.use(morgan("dev"));

// CART REQUESTS CONTROLLERS

app.use(`/api/v1/products`, productRouter);
app.use(`/api/v1/cart`, cartRouter);

app.listen(PORT, () => {
  console.log(`PORT ${PORT} is online`);
});
