const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

const db = require('../database/models');

// List all categories
const categoriesGet = async (req, res = response) => {
  try {
    const categories = await db.ProductCategory.findAll({
      attributes: [
        'category_name',
        'parent_category_id',
        'uuid',
        'is_active',
        [
          db.Sequelize.literal('product_category_parent.category_name'),
          'parent_category',
        ],
      ],
      include: {
        model: db.ProductCategory,
        as: 'product_category_parent',
        attributes: [],
      },
    });
    res.json(categories);
  } catch (error) {
    console.log(error);
    res.json({ msg: 'categoriesGet error from controller' });
  }
};
// Find categories

// Get category by UUID
const categoriesGetByUuid = async (req, res = response) => {
  try {
    const category = await db.ProductCategory.findOne({
      where: { uuid: req.params.uuid },
      attributes: [
        'category_name',
        'parent_category_id',
        'uuid',
        [
          db.Sequelize.literal('product_category_parent.category_name'),
          'parent_category',
        ],
      ],
      include: {
        model: db.ProductCategory,
        as: 'product_category_parent',
        attributes: [],
      },
    });

    res.status(200).json(category);
  } catch (error) {
    console.log(error);
  }
};
// Create category
const categoriesPost = async (req, res = response) => {
  try {
    // TODO ESTO DEBERIA SER UNA TRANSACCION!!!!!
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const { parent_category_id, category_name } = req.body;

    const category = await db.ProductCategory.create({
      parent_category_id: parent_category_id ? parent_category_id : null,
      category_name,
      uuid: uuidv4(),
    });

    res.status(200).json(category);
  } catch (error) {
    console.log(error);
  }
};
// Delete category
const categoriesDelete = async (req, res = response) => {
  try {
    await db.ProductCategory.update(
      { is_active: 1 },
      { where: { uuid: req.params.uuid } }
    );

    res.status(200).json({ msg: 'Eliminado' });
  } catch (error) {
    console.log(error);
  }
};
// Edit category
const categoriesPut = async (req, res = response) => {
  const { body } = req;
  try {
    await db.ProductCategory.update(body, { where: { uuid: req.params.uuid } });

    res.status(200).json({
      msg: 'Entry edited',
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  categoriesDelete,
  categoriesGetByUuid,
  categoriesGet,
  categoriesPost,
  categoriesPut,
};
