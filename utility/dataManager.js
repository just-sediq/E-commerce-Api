const fs = require("fs");
const fsPromises = require("fs/promises");

exports.products = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/products/products.json`, "utf8"),
);

exports.cart = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/cart/cart.json`),
);

exports.functionManager = new (class {
  itemIndex(item, referenceId) {
    return item.findIndex((el) => el.id === referenceId); // FUNDS THE EXACT POSTION OF OBJECT IN THE ARRAY VIA ID
  }
  findItem(item, referenceId) {
    return item.find((el) => el.id === referenceId); //// FUNDS THE  OBJECT IN THE ARRAY VIA ID
  }
  someItem(item, referenceId) {
    return item.some((el) => el.id === referenceId); // RETURNS A BOLEAN IF AN ONJECT EXISTS
  }
  createCartItems(products, productIndex) {
    return {
      itemId: products[productIndex].itemId,
      productId: products[productIndex].productId,
      name: products[productIndex].name,
      sku: products[productIndex].sku, /// TEMPLATE OF NEW CART
      price: products[productIndex].price,
      quantity: 1,
      image: products[productIndex].img,
      subtotal: products[productIndex].price,
    };
  }
  currentTime() {
    return new Date().toISOString();
  }
})();

exports.response = new (class {
  success(res, data) {
    res.status(200).json({
      success: true,
      data,
    });
  }
  serverError(res) {
    res.status(500).json({
      success: false,
      data: null,
    });
  }
  notFound(res) {
    res.status(404).json({
      success: false,
      data: null,
    });
  }
  badRequest() {}
})();
