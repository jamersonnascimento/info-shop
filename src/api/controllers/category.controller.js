// This file contains controller functions for managing categories in the application.
// It includes operations such as creating, retrieving, updating, and deleting categories, as well as managing products within categories.

const db = require('../models');
const Category = db.Category;
const Product = db.Product;
const { Op } = require('sequelize');

// Constants to define the order of attributes for Category
const CATEGORY_ATTRIBUTES = [
  'id_categoria',
  'nome',
  'descricao',
  'criado_em',
  'atualizado_em'
];

// Create a new Category
exports.create = async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    // Validate required fields
    if (!nome?.trim()) {
      return res.status(400).json({ message: 'Nome da categoria é obrigatório e não pode estar vazio' });
    }

    // Create the Category
    const category = await Category.create({ 
      nome,
      descricao
    });

    res.status(201).json({
      message: 'Categoria criada com sucesso!',
      data: category
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao criar a categoria.', 
      error: error.message 
    });
  }
};

// Retrieve all Categories with pagination
exports.findAll = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      sortBy = 'criado_em', 
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    const where = search ? {
      [Op.or]: [
        { nome: { [Op.iLike]: `%${search}%` } },
        { descricao: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};

    const { count, rows } = await Category.findAndCountAll({
      where,
      attributes: CATEGORY_ATTRIBUTES,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, order]],
      raw: true,
      nest: true
    });

    res.status(200).json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      categories: rows
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar categorias.', 
      error: error.message 
    });
  }
};

// Retrieve a Category by ID
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.findByPk(id, {
      attributes: CATEGORY_ATTRIBUTES
    });

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar categoria.', 
      error: error.message 
    });
  }
};

// Update a Category
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, descricao } = req.body;

    // Validate required fields
    if (!nome?.trim()) {
      return res.status(400).json({ message: 'Nome da categoria é obrigatório e não pode estar vazio' });
    }

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    // Update the category
    await category.update({
      nome,
      descricao
    });

    res.status(200).json({
      message: 'Categoria atualizada com sucesso!',
      data: category
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao atualizar categoria.', 
      error: error.message 
    });
  }
};

// Delete a Category
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.findByPk(id, {
      include: [{
        model: Product,
        as: 'products'
      }]
    });

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    // Check if the category has associated products
    if (category.products && category.products.length > 0) {
      return res.status(400).json({ 
        message: 'Não é possível excluir a categoria pois existem produtos associados a ela' 
      });
    }

    // Delete the category
    await category.destroy();

    res.status(200).json({
      message: 'Categoria excluída com sucesso!'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao excluir categoria.', 
      error: error.message 
    });
  }
};

// Add a product to a category
exports.addProduct = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'ID do produto é obrigatório' });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Check if the product is already associated with a category
    const existingCategories = await product.getCategories();
    if (existingCategories && existingCategories.length > 0) {
      return res.status(400).json({ 
        message: 'Este produto já está associado a uma categoria',
        currentCategory: {
          id: existingCategories[0].id_categoria,
          nome: existingCategories[0].nome
        }
      });
    }

    await category.addProduct(product);

    res.status(200).json({
      message: 'Produto adicionado à categoria com sucesso!',
      category: {
        id: category.id_categoria,
        nome: category.nome
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao adicionar produto à categoria.', 
      error: error.message 
    });
  }
};

// Remove a product from a category
exports.removeProduct = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const productId = req.params.productId;

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    await category.removeProduct(product);

    res.status(200).json({
      message: 'Produto removido da categoria com sucesso!',
      category: {
        id: category.id_categoria,
        nome: category.nome
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao remover produto da categoria.', 
      error: error.message 
    });
  }
};

// List products in a category
exports.findProducts = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { 
      page = 1, 
      limit = 1000 // Set a high limit to ensure all products are returned
    } = req.query;

    const offset = (page - 1) * limit;

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    // Retrieve products associated with the category with pagination
    const products = await category.getProducts({
      limit: parseInt(limit),
      offset: parseInt(offset),
      joinTableAttributes: [], // Do not return attributes from the join table
      attributes: [
        'id_produto',
        'nome',
        'descricao',
        'preco',
        'estoque',
        'criado_em',
        'atualizado_em'
      ]
    });

    // Count the total number of products associated with the category (without pagination)
    const count = await category.countProducts();

    res.status(200).json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      products: products
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar produtos da categoria.', 
      error: error.message 
    });
  }
};