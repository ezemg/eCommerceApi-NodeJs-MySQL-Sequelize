const db = require('../database/models');
const { v4: uuidv4 } = require('uuid');

// Funciones para buscar los IDs
const getUserId = async (userUuid, transaction) => {
  try {
    const { id } = await db.User.findOne({
      where: { uuid: userUuid },
      raw: true,
      transaction,
    });
    return id;
  } catch (error) {
    return undefined;
  }
};

const getAddressId = async (addressUuid, transaction) => {
  try {
    const { id } = await db.Address.findOne({
      where: { uuid: addressUuid },
      raw: true,
      transaction,
    });
    return id;
  } catch (error) {
    return undefined;
  }
};

const getPaymentMethodId = async (paymentMethodUuid, transaction) => {
  try {
    const { id } = await db.PaymentMethod.findOne({
      where: { uuid: paymentMethodUuid },
      raw: true,
      transaction,
    });
    return id;
  } catch (error) {
    return undefined;
  }
};

const getShippingMethodId = async (shippingMethodUuid, transaction) => {
  try {
    const { id } = await db.ShippingMethod.findOne({
      where: { uuid: shippingMethodUuid },
      raw: true,
      transaction,
    });
    return id;
  } catch (error) {
    return undefined;
  }
};

const getUserData = async (req, transaction) => {
  const userData = {
    userId: await getUserId(req.user.uuid, transaction),
    addressId: req.body.addressUuid
      ? await getAddressId(req.body.addressUuid, transaction)
      : undefined,
    paymentMethodId: req.body.paymentMethodUuid
      ? await getPaymentMethodId(req.body.paymentMethodUuid, transaction)
      : undefined,
    shippingMethodId: req.body.shippingMethodUuid
      ? await getShippingMethodId(req.body.shippingMethodUuid, transaction)
      : undefined,
  };

  const missingProperties = [];
  const propertiesToCheck = [
    'addressUuid',
    'paymentMethodUuid',
    'shippingMethodUuid',
  ];

  propertiesToCheck.forEach((prop) => {
    if (
      req.body[prop] &&
      userData[`${prop.replace('Uuid', 'Id')}`] === undefined
    ) {
      missingProperties.push(prop);
    }
  });

  if (missingProperties.length > 0) {
    throw new Error(
      `Las siguientes propiedades no fueron encontradas o son inválidas: ${missingProperties.join(
        ', '
      )}`
    );
  }
  return userData;
};

const createOrderLines = async (productItems, shopOrderId, transaction) => {
  const orderLinesData = productItems.map((productItem) => {
    const { productId, price, qty } = productItem;
    return {
      product_item_id: productId,
      shop_order_id: shopOrderId,
      uuid: uuidv4(),
      qty,
      price,
    };
  });

  await db.OrderLine.bulkCreate(orderLinesData, { transaction });
};

const calculateOrderTotal = (myProducts) => {
  return myProducts.reduce((accumulator, product) => {
    return accumulator + product.price * product.qty;
  }, 0);
};

const createShopOrder = async (userData, productItems, transaction) => {
  const { userId, addressId, paymentMethodId, shippingMethodId } = userData;

  const myData = {
    user_id: userId,
    shipping_address_id: addressId,
    payment_method_id: paymentMethodId,
    shipping_method_id: shippingMethodId,
    order_status_id: 1, // Establecer order_status como 'recibido'
    order_total: calculateOrderTotal(productItems),
    uuid: uuidv4(),
    ref_number: uuidv4(),
  };

  const shopOrder = await db.ShopOrder.create({ ...myData }, { transaction });

  return shopOrder;
};

const updateShopOrder = async (
  userData,
  productItems,
  shopOrderUuid,
  transaction
) => {
  const { userId, addressId, paymentMethodId, shippingMethodId } = userData;

  const myData = {
    user_id: userId,
    shipping_address_id: addressId ? addressId : undefined,
    payment_method_id: paymentMethodId ? paymentMethodId : undefined,
    shipping_method_id: shippingMethodId ? shippingMethodId : undefined,
    order_status_id: 1, // Establecer order_status como 'recibido'
    order_total: productItems ? calculateOrderTotal(productItems) : undefined,
  };

  const updatedShopOrder = await db.ShopOrder.update(
    { ...myData },
    { where: { uuid: shopOrderUuid } },
    { transaction }
  );

  return updatedShopOrder;
};

const getProductItemsData = async (productItems, transaction) => {
  try {
    const productItemsArray = [];
    for (const productItem of productItems) {
      const { uuid, qty } = productItem;
      const productData = await db.ProductItem.findOne(
        {
          where: { uuid },
          raw: true,
          attributes: ['id', 'price'],
        },
        { transaction }
      );

      if (productData) {
        productItemsArray.push({
          productId: productData.id,
          price: productData.price,
          qty,
        });
      }
    }

    return productItemsArray;
  } catch (error) {
    return undefined;
  }
};

const validateUserData = (userData, requiredProperties) => {
  for (const property of requiredProperties) {
    if (userData[property] === undefined) {
      throw new Error(
        `La propiedad '${property}' no se encontró. No se pueden realizar modificaciones.`
      );
    }
  }
};

module.exports = {
  getUserId,
  getAddressId,
  getPaymentMethodId,
  getShippingMethodId,
  calculateOrderTotal,
  createOrderLines,
  createShopOrder,
  getProductItemsData,
  getUserData,
  validateUserData,
  updateShopOrder,
};
