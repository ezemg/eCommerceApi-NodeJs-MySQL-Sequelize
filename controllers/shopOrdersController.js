const { response, request } = require('express');
const { v4: uuidv4 } = require('uuid');

const db = require('../database/models');

const shopOrdersController = {
  shopOrdersGet: async (req, res = response) => {
    try {
      const shopOrders = await db.ShopOrder.findAll({
        include: [
          {
            model: db.Address,
            as: 'address',
            attributes: ['address_line', 'city', 'region'],
          },
          {
            model: db.PaymentMethod,
            as: 'payment_method',
            attributes: [],
          },
          {
            model: db.User,
            as: 'user',
            attributes: ['uuid', 'email_address', 'phone_number'],
          },
          {
            model: db.OrderLine,
            as: 'order_line',

            include: [
              {
                model: db.ProductItem,
                as: 'product_item',

                include: [
                  {
                    model: db.Product,
                    as: 'product',
                  },
                  {
                    model: db.VariationOption,
                    as: 'variation_option',
                    include: [{ model: db.Variation, as: 'variation' }],
                  },
                ],
              },
            ],
            attributes: ['qty', 'price'],
          },
          {
            model: db.ShippingMethod,
            as: 'shippingMethod',
            attributes: [],
          },
          {
            model: db.OrderStatus,
            as: 'order_status',
            attributes: [],
          },
        ],
        attributes: [
          'uuid',
          'order_date',
          'order_total',
          'ref_number',
          'invoice_number',
          [
            db.Sequelize.literal('payment_method.value'),
            'payment_method_option',
          ],
          [
            db.Sequelize.literal('shippingMethod.name'),
            'shipping_method_option',
          ],
          [db.Sequelize.literal('order_status.status'), 'actual_status'],
        ],
      });

      const formattedShopOrders = shopOrders.map((order) => ({
        ...order.get({ plain: true }),
        order_line: order.order_line.map((orderLine) => ({
          name: orderLine.product_item.product.name,
          SKU: orderLine.product_item.SKU,
          qty: orderLine.qty,
          variations: orderLine.product_item.variation_option.reduce(
            (variations, option) => ({
              ...variations,
              [option.variation.name]: option.value,
            }),
            {}
          ),
          price: orderLine.price,
        })),
      }));

      res.json(formattedShopOrders);
    } catch (error) {
      console.log(error);
      res.json({ msg: 'shopOrdersGet error from controller' });
    }
  },
  shopOrdersGetByUuid: async (req, res = response) => {
    try {
      const shopOrder = await db.ShopOrder.findOne({
        where: { uuid: req.params.uuid },
        include: [
          {
            model: db.Address,
            as: 'address',
            attributes: ['address_line', 'city', 'region'],
          },
          {
            model: db.PaymentMethod,
            as: 'payment_method',
            attributes: [],
          },
          {
            model: db.User,
            as: 'user',
            attributes: ['uuid', 'email_address', 'phone_number'],
          },
          {
            model: db.OrderLine,
            as: 'order_line',

            include: [
              {
                model: db.ProductItem,
                as: 'product_item',

                include: [
                  {
                    model: db.Product,
                    as: 'product',
                  },
                  {
                    model: db.VariationOption,
                    as: 'variation_option',
                    include: [{ model: db.Variation, as: 'variation' }],
                  },
                ],
              },
            ],
            attributes: ['qty', 'price'],
          },
          {
            model: db.ShippingMethod,
            as: 'shippingMethod',
            attributes: [],
          },
          {
            model: db.OrderStatus,
            as: 'order_status',
            attributes: [],
          },
        ],
        attributes: [
          'uuid',
          'order_date',
          'order_total',
          'ref_number',
          'invoice_number',
          [
            db.Sequelize.literal('payment_method.value'),
            'payment_method_option',
          ],
          [
            db.Sequelize.literal('shippingMethod.name'),
            'shipping_method_option',
          ],
          [db.Sequelize.literal('order_status.status'), 'actual_status'],
        ],
      });

      const formattedShopOrders = {
        ...shopOrder.get({ plain: true }),
        order_line: shopOrder.order_line.map((orderLine) => ({
          name: orderLine.product_item.product.name,
          SKU: orderLine.product_item.SKU,
          qty: orderLine.qty,
          variations: orderLine.product_item.variation_option.reduce(
            (variations, option) => ({
              ...variations,
              [option.variation.name]: option.value,
            }),
            {}
          ),
          price: orderLine.price,
        })),
      };
      res.json(formattedShopOrders);
    } catch (error) {
      console.log(error);
      res.json({ msg: 'shopOrdersGetByUuid error from controller' });
    }
  },
  shopOrdersPost: async (req, res = response) => {
    // Armar order_line

    try {
      // Buscar id de user
      const { id: userId } = await db.User.findOne({
        where: { uuid: req.user.uuid },
        raw: true,
      });

      // Buscar address
      const { id: addressId } = await db.Address.findOne({
        where: { uuid: req.body.addressUuid },
        raw: true,
      });

      // Buscar payment_method
      const { id: paymentMethodId } = await db.PaymentMethod.findOne({
        where: { uuid: req.body.paymentMethodUuid },
        raw: true,
      });
      // Buscar shippingMethod
      const { id: shippingMethodId } = await db.ShippingMethod.findOne({
        where: { uuid: req.body.shippingMethodUuid },
        raw: true,
      });

      // Buscar ids de los product_items y preparar data de productos,

      const myProducts = [];

      for (const productItem of req.body.productItems) {
        const { uuid, qty } = productItem;
        const productData = await db.ProductItem.findOne({
          where: { uuid },
          raw: true,
          attributes: ['id', 'price'],
        });

        if (productData) {
          myProducts.push({
            productId: productData.id,
            price: productData.price,
            qty,
          });
        }
      }

      console.log(myProducts);

      const myData = {
        userId,
        addressId,
        paymentMethodId,
        shippingMethodId,
        // Establecer order_status como 'recibido'
        orderStatusId: 1,
      };

      // Calculo el total de la compra
      myData.orderTotal = myProducts.reduce((accumulator, product) => {
        return accumulator + product.price * product.qty;
      }, 0);

      const shopOrder = await db.ShopOrder.create({
        user_id: myData.userId,
        uuid: uuidv4(),
        payment_method_id: myData.paymentMethodId,
        shipping_address_id: myData.addressId,
        shipping_method_id: myData.shippingMethodId,
        order_total: myData.orderTotal,
        order_status_id: myData.orderStatusId,
        ref_number: uuidv4(),
      });

      for (const product of myProducts) {
        const { productId, price, qty } = product;
        await db.OrderLine.create({
          product_item_id: productId,
          shop_order_id: shopOrder.id,
          uuid: uuidv4(),
          qty,
          price,
        });
      }
      res.json(shopOrder);
    } catch (error) {
      console.log(error);
      res.json({ msg: 'shopOrdersPost error from controller' });
    }
  },
  shopOrdersPut: async (req, res = response) => {},
  shopOrdersDelete: async (req, res = response) => {},
};

const orderStatusController = {
  orderStatusGet: async (req, res = response) => {
    try {
      const orderStatus = await db.OrderStatus.findAll({
        where: { is_active: 0 },
        attributes: ['uuid', 'status'],
      });

      res.json(orderStatus);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'orderStatusGet error from controller' });
    }
  },
  orderStatusGetByUuid: async (req, res = response) => {
    try {
      const orderStatus = await db.OrderStatus.findOne({
        where: { uuid: req.params.uuid },
        attributes: ['uuid', 'status'],
      });

      res.json(orderStatus);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ msg: 'orderStatusGetByUuid error from controller' });
    }
  },
  orderStatusPost: async (req, res = response) => {
    const { status } = req.body;

    try {
      const orderStatus = await db.OrderStatus.create({
        status,
        uuid: uuidv4(),
      });

      res.json(orderStatus);
    } catch (error) {
      console.log(error);
      res.json({ msg: 'orderStatusPost error from controller' });
    }
  },
  orderStatusPut: async (req, res = response) => {
    const { body } = req;

    try {
      await db.OrderStatus.update(
        {
          ...body,
          is_active: 0,
        },
        {
          where: { uuid: req.params.uuid },
        }
      );
      res.json({ msg: 'ok, entry updated' });
    } catch (error) {
      console.log(error);
      res.json({ msg: 'orderStatusPut error from controller' });
    }
  },
  orderStatusDelete: async (req, res = response) => {
    try {
      await db.OrderStatus.update(
        {
          is_active: 1,
        },
        { where: { uuid: req.params.uuid } }
      );
      res.json({ msg: 'ok, entry deleted' });
    } catch (error) {
      console.log(error);
      res.json({ msg: 'orderStatusDelete error from controller' });
    }
  },
};

const orderLineController = {
  orderLineGet: async (req, res = response) => {
    try {
      const orderLines = await db.OrderLine.findAll({
        include: [
          {
            model: db.ProductItem,
            as: 'product_item',
            include: [
              { model: db.Product, as: 'product' },
              { model: db.VariationOption, as: 'variation_option' },
            ],
          },
        ],
      });

      res.json(orderLines);
    } catch (error) {
      console.log(error);
      res.json({ msg: 'orderLinesGet error from controller' });
    }
  },
  orderLineGetByUuid: async (req, res = response) => {},
  orderLinePost: async (req, res = response) => {},
  orderLinePut: async (req, res = response) => {},
  orderLineDelete: async (req, res = response) => {},
};

const userReviewController = {
  userReviewGet: async (req, res = response) => {},
  userReviewGetByUuid: async (req, res = response) => {},
  userReviewPost: async (req, res = response) => {},
  userReviewPut: async (req, res = response) => {},
  userReviewDelete: async (req, res = response) => {},
};

const shippingMethodsController = {
  shippingMethodsGet: async (req, res = response) => {
    try {
      const shippingMethods = await db.ShippingMethod.findAll({
        where: { is_active: 0 },
        attributes: ['uuid', 'name', 'price'],
      });

      res.json(shippingMethods);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  shippingMethodsGetByUuid: async (req, res = response) => {
    try {
      const shippingMethod = await db.ShippingMethod.findOne({
        where: { uuid: req.params.uuid },
      });

      res.json(shippingMethod);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  shippingMethodsPost: async (req, res = response) => {
    const { name, price } = req.body;

    try {
      const shippingMethod = await db.ShippingMethod.create({
        name,
        price,
        uuid: uuidv4(),
      });

      res.json(shippingMethod);
    } catch (error) {
      console.log(error);
      res.json({ msg: 'shippingMethodsPost error from controller' });
    }
  },
  shippingMethodsPut: async (req, res = response) => {
    const { body } = req;
    try {
      await db.ShippingMethod.update(
        {
          ...body,
          is_active: 0,
        },
        {
          where: { uuid: req.params.uuid },
        }
      );
      res.json({ msg: 'ok, entry updated' });
    } catch (error) {
      console.log(error);
      res.json({ msg: 'shippingMethodsPut error from controller' });
    }
  },
  shippingMethodsDelete: async (req, res = response) => {
    try {
      await db.ShippingMethod.update(
        {
          is_active: 1,
        },
        { where: { uuid: req.params.uuid } }
      );
      res.json({ msg: 'ok, entry deleted' });
    } catch (error) {
      console.log(error);
      res.json({ msg: 'shippingMethodsDelete error from controller' });
    }
  },
};

module.exports = {
  ...shopOrdersController,
  ...orderStatusController,
  ...orderLineController,
  ...userReviewController,
  ...shippingMethodsController,
};
