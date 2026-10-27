const fsPromises = require("fs/promises");
//FUNCTIONS NEEDED FROM DATAM-MANAGER.JS
const { products, cart, functionManager, response } = require(
  `./../utility/dataManager`,
);

//ROUTE CONTROLLERS

exports.getAllCart = (req, res) => {
  res.status(200).json({
    success: true,
    itemCount: cart.length,
    data: {
      cart,
    },
  });
};

exports.getCart = (req, res) => {
  const cartId = Number(req.params.id);
  const findCart = functionManager.findItem(cart, cartId);

  if (!findCart) {
    return response.notFound(res);
  }

  response.success(res, findCart);
};

exports.addToCart = async (req, res) => {
  try {
    const cartId = Number(req.params.id);
    const checkIfCartExistsInProducts = functionManager.someItem(
      products,
      cartId,
    );
    if (!checkIfCartExistsInProducts) {
      return response.notFound(res);
    }

    const productIndex = functionManager.itemIndex(products, cartId);
    const cartIndex = functionManager.itemIndex(cart, cartId);
    const cartTemp = functionManager.createCartItems(products, productIndex);
    const newCart = Object.assign({ id: cartId }, cartTemp);

    if (cartIndex === -1) {
      cart.push(newCart);
    } else {
      cart[cartIndex].quantity += 1;
      cart[cartIndex].subtotal += products[productIndex].price;
    }

    // await functionManager.writeFileData(cart);
    await fsPromises.writeFile(
      `${__dirname}/../data/cart/cart.json`,
      JSON.stringify(cart, null, 2),
    );
    console.log(newCart);
    response.success(res, newCart);
  } catch (err) {
    console.error("SERVER ERROR:", err);

    response.serverError(res);
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const cartId = Number(req.params.id);
    const cartIndex = functionManager.itemIndex(cart, cartId);
    if (cartIndex === -1) {
      return response.notFound(res);
    }
    cart.splice(cartIndex, 1);

    await fsPromises.writeFile(
      `${__dirname}/../data/cart/cart.json`,
      JSON.stringify(cart, null, 2),
    );
    response.success(res, "cart Deleted");
  } catch (err) {
    console.log(err);
    response.serverError(res);
  }
};
