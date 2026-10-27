const fsPromises = require("fs/promises");
// IMPORTED MODULES
const express = require("express");
const { products, cart, functionManager, response } = require(
  `./../utility/dataManager`,
);

//PRODUCTS REQUEST CONTROLLERS

exports.getAllProducts = (req, res) => {
  response.success(res, products);
};

exports.getProduct = (req, res) => {
  const productId = Number(req.params.id);
  const product = functionManager.findItem(products, productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      data: null,
    });
  }

  response.success(res, product);
};

exports.creatNewProduct = async (req, res) => {
  try {
    const createdAt = functionManager.currentTime();
    const lastProductId = Number(products[products.length - 1].id);
    const newId = lastProductId
      ? Number(products[products.length - 1].id) + 1
      : 1;

    const newProduct = {
      id: newId,
      ...req.body,
      createdAt,
    };

    products.push(newProduct);

    await fsPromises.writeFile(
      `${__dirname}/../data/products/products.json`,
      JSON.stringify(products, null, 2),
    );

    response.success(res, newProduct);
  } catch (err) {
    response.serverError(res);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const productIndex = functionManager.itemIndex(products, productId);
    const cartIndex = functionManager.itemIndex(cart, productId);
    const updatedAt = functionManager.currentTime();

    if (productIndex === -1) {
      return response.notFound(res);
    }

    products[productIndex] = {
      ...products[productIndex],
      ...req.body,
      id: productId,
      updatedAt,
    };

    if (cartIndex !== -1) {
      const updatedProduct = products[productIndex];
      cart[cartIndex] = {
        ...cart[cartIndex],
        name: updatedProduct.name,
        price: updatedProduct.price,
        subtotal: cart[cartIndex].quantity * updatedProduct.price,
        updatedAt,
      };
    }

    await fsPromises.writeFile(
      `${__dirname}/../data/products/products.json`,
      JSON.stringify(products, null, 2),
    );

    await fsPromises.writeFile(
      `${__dirname}/../data/cart/cart.json`,
      JSON.stringify(cart, null, 2),
    );

    const updatedProduct = products[productIndex];

    response.success(res, updatedProduct);
  } catch (err) {
    console.log(err);
    response.serverError(res);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const findProduct = functionManager.itemIndex(products, productId);
    const cartIndex = functionManager.itemIndex(cart, productId);

    console.log(findProduct);
    if (findProduct === -1) {
      return response.notFound(res);
    }

    products.splice(findProduct, 1);

    if (cartIndex !== -1) {
      console.log("Cart detected");
      cart.splice(cartIndex, 1);
    }

    await fsPromises.writeFile(
      `${__dirname}/../data/products/products.json`,
      JSON.stringify(products, null, 2),
    );

    await fsPromises.writeFile(
      `${__dirname}/../data/cart/cart.json`,
      JSON.stringify(cart, null, 2),
    );

    response.success(res);
  } catch (err) {
    console.log(err);
    response.serverError(res);
  }
};
