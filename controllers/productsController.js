const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

const db = require('../database/models');

const productsController = {
  // List all products
  productsGet: async (req, res = response) => {
    try {
      const products = await db.Product.findAll({
        attributes: [
          'uuid',
          'name',
          'description',
          'product_image',
          'is_active',
          [
            db.Sequelize.literal('product_category.category_name'),
            'category_name',
          ],
        ],
        include: [
          {
            model: db.ProductCategory,
            as: 'product_category',
            attributes: [],
          },
          // {
          //   model: db.ProductItem,
          //   as: 'product_item',
          // },
        ],
      });

      res.json(products);
    } catch (error) {
      res.json({ msg: 'productsGet error from controller' });
    }
  },
  // Find one product
  productsGetByUuid: async (req, res = response) => {
    try {
      const product = await db.Product.findOne({
        where: { uuid: req.params.uuid },
        attributes: [
          'uuid',
          'name',
          'description',
          'product_image',
          'is_active',
          [
            db.Sequelize.literal('product_category.category_name'),
            'category_name',
          ],
        ],
        include: [
          {
            model: db.ProductCategory,
            as: 'product_category',
            attributes: [],
          },
          // {
          //   model: db.ProductItem,
          //   as: 'product_item',
          // },
        ],
      });

      res.json(product);
    } catch (error) {
      res.json({ msg: 'productsGet error from controller' });
    }
  },
  // Create product
  productsPost: async (req, res = response) => {
    try {
      const { product_category_id, name, description, product_image } =
        req.body;

      const product = await db.Product.create({
        product_category_id,
        name,
        description,
        product_image,
        uuid: uuidv4(),
      });

      res.json({ msg: 'ok', product });
    } catch (error) {
      console.log(error);
      res.json({ msg: 'variationsPost error from controller' });
    }
  },
  // Delete product
  productsDelete: async (req, res = response) => {
    try {
      await db.Product.update(
        { is_active: 1 },
        { where: { uuid: req.params.uuid } }
      );

      res.json({ msg: 'ok, entry deleted' });
    } catch (error) {
      console.log(error);
      res.json({ msg: 'variationsDelete error from controller' });
    }
  },
  // Edit product
  productsPut: async (req, res = response) => {
    const { body } = req;
    try {
      const productEdit = await db.Product.update(
        { ...body, is_active: 0 },
        {
          where: { uuid: req.params.uuid },
        }
      );

      res.status(200).json({
        msg: 'ok',
        productEdit,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'error from productsPut controller' });
    }
  },
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
      const productItems = await db.ProductItem.findAll({
        attributes: [
          'uuid',
          [
            db.Sequelize.col('product->product_category.category_name'),
            'category',
          ],
          [db.Sequelize.literal('product.name'), 'product_name'],
          [db.Sequelize.literal('product.description'), 'description'],
          'SKU',
          'qty_in_stock',
          'product_image',
          'price',
          'is_active',
        ],
        include: [
          {
            model: db.VariationOption,
            as: 'variation_option',
            include: { model: db.Variation, as: 'variation' },
          },
          {
            model: db.Product,
            as: 'product',
            attributes: [],
            include: { model: db.ProductCategory, as: 'product_category' },
          },
        ],
      });

      const result = productItems
        .map((obj) => obj.get({ plain: true }))
        .map((item) => ({
          ...item,
          variation_option: Object.fromEntries(
            item.variation_option.map((option) => [
              option.variation.name,
              option.value,
            ])
          ),
        }));

      res.json(result);
    } catch (error) {
      console.log(error);
      res.json({ msg: 'productItems error from controller' });
    }
  },

  // Find one product item
  productItemsGetByUuid: async (req, res = response) => {
    try {
      const productItem = await db.ProductItem.findOne({
        where: { uuid: req.params.uuid },
        attributes: [
          'uuid',
          [
            db.Sequelize.col('product->product_category.category_name'),
            'category',
          ],
          [db.Sequelize.literal('product.name'), 'product_name'],
          [db.Sequelize.literal('product.description'), 'description'],
          'SKU',
          'qty_in_stock',
          'product_image',
          'price',
          'is_active',
        ],
        include: [
          {
            model: db.VariationOption,
            as: 'variation_option',
            include: { model: db.Variation, as: 'variation' },
          },
          {
            model: db.Product,
            as: 'product',
            attributes: [],
            include: { model: db.ProductCategory, as: 'product_category' },
          },
        ],
      });

      let result = { ...productItem.get({ plain: true }) };

      result = {
        ...result,
        variation_option: Object.fromEntries(
          result.variation_option.map((option) => [
            option.variation.name,
            option.value,
          ])
        ),
      };

      res.json(result);
    } catch (error) {
      console.log(error);
      res.json({ msg: 'productItemsGetByUuid error from controller' });
    }
  },
  // Create product item
  productItemsPost: async (req, res = response) => {
    const {
      product_id,
      SKU,
      qty_in_stock,
      product_image,
      price,
      variation_option_ids: variationOptionsIds,
    } = req.body;

    try {
      const result = await db.sequelize.transaction(async (t) => {
        const productItem = await db.ProductItem.build(
          {
            product_id,
            SKU,
            qty_in_stock,
            product_image,
            price,
            uuid: uuidv4(),
          },
          { transaction: t }
        );

        await productItem.save({ transaction: t });

        for (const variation_option_id of variationOptionsIds) {
          await db.ProductConfiguration.create(
            {
              product_item_id: productItem.id,
              variation_option_id,
              uuid: uuidv4(),
            },
            { transaction: t }
          );
        }

        return productItem;
      });
      res.json({
        result,
        msg: 'ok, productItemsPost',
      });
    } catch (error) {
      console.log(error);
      res.json({ msg: 'productItemsPost error from controller' });
    }
  },
  // Delete product item
  productItemsDelete: async (req, res = response) => {
    try {
      const result = await db.sequelize.transaction(async (t) => {
        const ProductItemToDelete = await db.ProductItem.findOne(
          {
            where: { uuid: req.params.uuid },
          },
          { transaction: t }
        );

        const { id } = ProductItemToDelete.toJSON();

        await db.ProductConfiguration.destroy(
          { where: { product_item_id: id } },
          { transaction: t }
        );

        await ProductItemToDelete.update(
          {
            is_active: 1,
          },
          { transaction: t }
        );

        return ProductItemToDelete;
      });
      res.json({
        msg: 'entry deleted successfully',
      });
    } catch (error) {
      console.log(error);
      res.json({ msg: 'productItemsDelete error from controller' });
    }
  },
  // Edit product item
  productItemsPut: async (req, res = response) => {
    const { variation_option_ids: variationOptionsIds } = req.body;
    const { body } = req;

    const result = await db.sequelize.transaction(async (t) => {
      const productItemToEdit = await db.ProductItem.update(
        {
          ...body,
          isActive: 0,
        },
        { where: { uuid: req.params.uuid } },
        { transaction: t }
      );

      const { id } = await db.ProductItem.findOne({
        where: { uuid: req.params.uuid },
      });
      await db.ProductConfiguration.destroy(
        { where: { product_item_id: id } },
        { transaction: t }
      );

      if (variationOptionsIds.length > 0) {
        for (const variation_option_id of variationOptionsIds) {
          await db.ProductConfiguration.create(
            {
              product_item_id: id,
              variation_option_id,
              uuid: uuidv4(),
            },
            { transaction: t }
          );
        }
      }

      return productItemToEdit;
    });
    res.json({
      msg: 'ok, productItemsPut',
    });
  },
};

module.exports = {
  ...productItemsController,
  ...productsController,
  ...variationOptionsController,
  ...variationsController,
};
