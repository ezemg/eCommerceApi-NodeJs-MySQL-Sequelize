const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

const db = require('../database/models');

const productsController = {
  // List all products
  productsGet: async (req, res = response) => {
    try {
      const products = await db.Product.findAll();

      res.json(products);
    } catch (error) {
      res.json({ msg: 'productsGet error from controller' });
    }
  },
  // Find products
  productsFind: async (req, res = response) => {},
  // Find one product
  productsFindOne: async (req, res = response) => {},
  // Create product
  productsPost: async (req, res = response) => {},
  // Delete product
  productsDelete: async (req, res = response) => {},
  // Edit product
  productsPut: async (req, res = response) => {},
};

const variationsController = {
  // List all variations
  variationsGet: async (req, res = response) => {
    try {
      const variations = await db.Variation.findAll({
        attributes: [
          'uuid',
          [
            db.Sequelize.literal('product_category.category_name'),
            'category_name',
          ],
          ['name', 'variation_name'],
          'is_active',
        ],
        include: [
          {
            model: db.ProductCategory,
            as: 'product_category',
            attributes: [],
          },
          {
            model: db.VariationOption,
            as: 'variation_option',
            attributes: ['value'],
          },
        ],
      });

      const result = variations
        .map((obj) => obj.get({ plain: true }))
        .map((el) => ({
          ...el,
          variation_option: el.variation_option.map((opt) => opt.value),
        }));

      res.json(result);
    } catch (error) {
      console.log(error);
      res.json({ msg: 'variationsGet error from controller' });
    }
  },
  // Find variations
  variationsFind: async (req, res = response) => {},
  // Find one variation
  variationsGetByUuid: async (req, res = response) => {
    try {
      const variation = await db.Variation.findAll({
        where: { uuid: req.params.uuid },
        attributes: [
          'uuid',
          [
            db.Sequelize.literal('product_category.category_name'),
            'category_name',
          ],
          ['name', 'variation_name'],
          'is_active',
        ],
        include: [
          {
            model: db.ProductCategory,
            as: 'product_category',
            attributes: [],
          },
          {
            model: db.VariationOption,
            as: 'variation_option',
            attributes: ['value'],
          },
        ],
      });

      const result = variation
        .map((obj) => obj.get({ plain: true }))
        .map((el) => ({
          ...el,
          variation_option: el.variation_option.map((opt) => opt.value),
        }));

      res.json(result);
    } catch (error) {
      console.log(error);
      res.json({ msg: 'Error from variationsGetByUuid' });
    }
  },
  // Create variation
  variationsPost: async (req, res = response) => {
    try {
      const { product_category_id, name } = req.body;

      const variation = await db.Variation.create({
        product_category_id,
        name,
        uuid: uuidv4(),
      });

      res.json({ msg: 'ok', variation });
    } catch (error) {
      console.log(error);
      res.json({ msg: 'variationsPost error from controller' });
    }
  },
  // Delete variation
  variationsDelete: async (req, res = response) => {
    try {
      const deletedProduct = await db.Variation.update(
        { is_active: 1 },
        { where: { uuid: req.params.uuid } }
      );

      res.json(deletedProduct);
    } catch (error) {
      console.log(error);
      res.json({ msg: 'variationsDelete error from controller' });
    }
  },
  // Edit variation
  variationsPut: async (req, res = response) => {
    const { body } = req;
    try {
      const variationEdit = await db.Variation.update(body, {
        where: { uuid: req.params.uuid },
      });

      console.log(variationEdit);

      res.status(200).json({
        msg: 'ok',
        variationEdit,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'error from variationsPut controller' });
    }
  },
};

const variationOptionsController = {
  // List all variation opts
  variationOptionsGet: async (req, res = response) => {
    try {
      const variationOptions = await db.VariationOption.findAll({
        include: { model: db.Variation, as: 'variation', attributes: [] },
        attributes: [
          'uuid',
          [db.Sequelize.literal('variation.name'), 'variation_category'],
          'value',
          'is_active',
        ],
      });
      res.json(variationOptions);
    } catch (error) {
      console.log(error);
      res.json({ msg: 'variationOptionsGet error from controller' });
    }
  },
  // Find one variation opt
  variationOptionsGetByUuid: async (req, res = response) => {
    try {
      const variationOption = await db.VariationOption.findOne({
        where: { uuid: req.params.uuid },
        include: { model: db.Variation, as: 'variation', attributes: [] },
        attributes: [
          'uuid',
          [db.Sequelize.literal('variation.name'), 'variation_category'],
          'value',
          'is_active',
        ],
      });
      res.json(variationOption);
    } catch (error) {
      console.log(error);
      res.json({ msg: 'variationOptionsGetByUuid error from controller' });
    }
  },
  // Create variation opt
  variationOptionsPost: async (req, res = response) => {
    try {
      const { variation_id, value } = req.body;

      const variation = await db.VariationOption.create({
        variation_id,
        value,
        uuid: uuidv4(),
      });

      res.json({ msg: 'ok', variation });
    } catch (error) {
      console.log(error);
      res.json({ msg: 'variationOptionsPost error from controller' });
    }
  },
  // Delete variation opt
  variationOptionsDelete: async (req, res = response) => {
    try {
      await db.VariationOption.update(
        { is_active: 1 },
        { where: { uuid: req.params.uuid } }
      );

      res.json({ msg: 'entry deleted' });
    } catch (error) {
      console.log(error);
      res.json({ msg: 'variationOptionDelete error from controller' });
    }
  },
  // Edit variation opt
  variationOptionsPut: async (req, res = response) => {
    const { body } = req;

    try {
      await db.VariationOption.update(body, {
        where: { uuid: req.params.uuid },
      });

      res.status(200).json({
        msg: 'Entry modified successfully',
      });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json({ msg: 'error from variationOptionsPut controller' });
    }
  },
};

const productItemsController = {
  // List all product items
  productItemsGet: async (req, res = response) => {
    try {
      const productItems = await db.ProductItem.findAll();
      res.json(productItems);
    } catch (error) {
      res.json({ msg: 'productItems error from controller' });
    }
  },
  // Find product items
  productItemsFind: async (req, res = response) => {},
  // Find one product item
  productItemsFindOne: async (req, res = response) => {},
  // Create product item
  productItemsPost: async (req, res = response) => {},
  // Delete product item
  productItemsDelete: async (req, res = response) => {},
  // Edit product item
  productItemsPut: async (req, res = response) => {},
};

module.exports = {
  ...productItemsController,
  ...productsController,
  ...variationOptionsController,
  ...variationsController,
};
