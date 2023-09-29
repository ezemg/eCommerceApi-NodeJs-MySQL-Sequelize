const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

const db = require('../database/models');

const paymentMethodsController = {
  paymentMethodsGet: async (req, res = response) => {
    try {
      const paymentMethods = await db.PaymentMethod.findAll();

      res.json(paymentMethods);
    } catch (error) {
      res.json({ msg: 'paymentMethodsGet error from controller' });
    }
  },
  paymentMethodsGetByUuid: async (req, res = response) => {
    try {
      const paymentMethod = await db.PaymentMethod.findOne({
        where: { uuid: req.params.uuid },
      });

      res.json(paymentMethod);
    } catch (error) {
      res.json({ msg: 'paymentMethodsGetByUuid error from controller' });
    }
  },
  paymentMethodsPost: async (req, res = response) => {
    const { value } = req.body;
    try {
      const paymentMethod = await db.PaymentMethod.create({
        uuid: uuidv4(),
        value,
      });

      res.json(paymentMethod);
    } catch (error) {
      console.log(error);
      res.json({ msg: 'paymentMethodsPost error from controller' });
    }
  },
  paymentMethodsPut: async (req, res = response) => {
    const { value } = req.body;
    try {
      await db.PaymentMethod.update(
        { value },
        {
          where: { uuid: req.params.uuid },
        }
      );
      res.json({ msg: 'ok, entry updated' });
    } catch (error) {
      console.log(error);
      res.json({ msg: 'paymentMethodsDelete error from controller' });
    }
  },
  paymentMethodsDelete: async (req, res = response) => {
    try {
      await db.PaymentMethod.update(
        { is_active: 1 },
        { where: { uuid: req.params.uuid } }
      );
      res.json({ msg: 'ok, entry deleted' });
    } catch (error) {
      console.log(error);
      res.json({ msg: 'paymentMethodsDelete error from controller' });
    }
  },
};

module.exports = { ...paymentMethodsController };
