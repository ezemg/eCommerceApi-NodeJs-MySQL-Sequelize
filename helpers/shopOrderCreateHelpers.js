const db = require('../database/models');
const { v4: uuidv4 } = require('uuid');

// Funciones para buscar los IDs
const getUserId = async (userUuid, transaction) => {
  const { id } = await db.User.findOne({
    where: { uuid: userUuid },
    raw: true,
    transaction,
  });
  return id;
};

const getAddressId = async (addressUuid, transaction) => {
  const { id } = await db.Address.findOne({
    where: { uuid: addressUuid },
    raw: true,
    transaction,
  });
  return id;
};

const getPaymentMethodId = async (paymentMethodUuid, transaction) => {
  const { id } = await db.PaymentMethod.findOne({
    where: { uuid: paymentMethodUuid },
    raw: true,
    transaction,
  });
  return id;
};

const getShippingMethodId = async (shippingMethodUuid, transaction) => {
  const { id } = await db.ShippingMethod.findOne({
    where: { uuid: shippingMethodUuid },
    raw: true,
    transaction,
  });
  return id;
};

const createOrderLines = async (myProducts, shopOrderId, transaction) => {
  for (const product of myProducts) {
    const { productId, price, qty } = product;
    await db.OrderLine.create(
      {
        product_item_id: productId,
        shop_order_id: shopOrderId,
        uuid: uuidv4(),
        qty,
        price,
      },
      { transaction }
    );
  }
};

const calculateOrderTotal = (myProducts) => {
  return myProducts.reduce((accumulator, product) => {
    return accumulator + product.price * product.qty;
  }, 0);
};

module.exports = {
  getUserId,
  getAddressId,
  getPaymentMethodId,
  getShippingMethodId,
  calculateOrderTotal,
  createOrderLines,
};
