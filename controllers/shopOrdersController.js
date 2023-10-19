const { response, request } = require('express');
const { v4: uuidv4 } = require('uuid');

const db = require('../database/models');
const {
  getUserId,
  getAddressId,
  getPaymentMethodId,
  getShippingMethodId,
  calculateOrderTotal,
  createOrderLines,
  getProductItemsData,
  createShopOrder,
  getUserData,
  validateUserData,
  updateShopOrder,
} = require('../helpers/shopOrderCreateHelpers.js');

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
    try {
      const result = await db.sequelize.transaction(async (t) => {
        const userData = await getUserData(req, t);

        const myProducts = await getProductItemsData(req.body.productItems, t);

        const shopOrder = await createShopOrder(userData, myProducts, t);

        await createOrderLines(myProducts, shopOrder.id, t);

        return shopOrder;
      });

      res.json({
        result,
        msg: 'ok, shopOrder created successfully',
      });
    } catch (error) {
      console.log(error);
      res.json({ msg: 'shopOrdersPost error from controller' });
    }
  },

  shopOrdersPut: async (req, res = response) => {
    try {
      const shopOrderUuid = req.params.uuid; // Obtener el UUID del ShopOrder a actualizar
      const updateData = req.body; // Datos a actualizar

      // Realizar la actualización dentro de una transacción
      const result = await db.sequelize.transaction(async (t) => {
        // Buscar el ShopOrder existente por UUID
        const existingShopOrder = await db.ShopOrder.findOne({
          where: { uuid: shopOrderUuid },
          raw: true,
          transaction: t,
        });

        if (!existingShopOrder) {
          throw new Error('ShopOrder not found');
        }

        const userData = await getUserData(req, t);

        for (const key in userData) {
          if (userData[key] === undefined) {
            delete userData[key];
          }
        }

        const myProducts = await getProductItemsData(req.body.productItems, t);

        const shopOrder = await updateShopOrder(
          userData,
          myProducts,
          existingShopOrder.uuid,
          t
        );

        // // Si hay cambios en los productos, actualiza los OrderLines y el OrderTotal
        if (myProducts) {
          // Elimina los OrderLines existentes para este ShopOrder
          await db.OrderLine.destroy({
            where: { shop_order_id: existingShopOrder.id },
            transaction: t,
          });

          // Recrea los OrderLines con los nuevos datos de productos
          await createOrderLines(myProducts, existingShopOrder.id, t);
        }

        return shopOrder;
      });

      res.json({
        // result,
        msg: 'ShopOrder updated successfully',
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({ msg: error.message });
    }
  },

  shopOrdersUpdateOrderStatus: async (req, res) => {
    res.json({ msg: 'shopOrdersUpdateOrderStatus controller' });
  },
  shopOrdersDelete: async (req, res = response) => {
    try {
      await db.ShopOrder.update(
        { is_active: 1 },
        { where: { uuid: req.params.uuid } }
      );
    } catch (error) {
      console.log(error);
      res.json({ msg: 'shopOrdersDelete error from controller' });
    }
  },
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
