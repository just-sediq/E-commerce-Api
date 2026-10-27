const express = require("express");
const productRouter = express.Router();

const {
  getAllProducts,
  creatNewProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require(`./productController`);

productRouter.route(`/`).get(getAllProducts).post(creatNewProduct);

productRouter
  .route(`/:id`)
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = productRouter;
