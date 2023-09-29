const { response, request } = require('express');
const { v4: uuidv4 } = require('uuid');

const db = require('../database/models');

const shopOrdersController = {
  shopOrdersGet: async (req, res = response) => {},
  shopOrdersGetByUuid: async (req, res = response) => {},
  shopOrdersPost: async (req, res = response) => {},
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
