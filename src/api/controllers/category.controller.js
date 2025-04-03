const db = require('../models');
const Category = db.Category;
const Product = db.Product;
const { Op } = require('sequelize');

// Constantes para definir ordem dos atributos
const CATEGORY_ATTRIBUTES = [
  'id_categoria',
  'nome',
  'descricao',
  'criado_em',
  'atualizado_em'
];

// Criar uma nova Categoria
exports.create = async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    // Validações mais robustas
    if (!nome?.trim()) {
      return res.status(400).json({ message: 'Nome da categoria é obrigatório e não pode estar vazio' });
    }

    // Criação da Categoria
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

// Buscar todas as Categorias com paginação
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

// Buscar uma Categoria por ID
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

// Atualizar uma Categoria
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, descricao } = req.body;

    // Validações
    if (!nome?.trim()) {
      return res.status(400).json({ message: 'Nome da categoria é obrigatório e não pode estar vazio' });
    }

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    // Atualização da categoria
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

// Deletar uma Categoria
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

    // Verifica se a categoria possui produtos associados
    if (category.products && category.products.length > 0) {
      return res.status(400).json({ 
        message: 'Não é possível excluir a categoria pois existem produtos associados a ela' 
      });
    }

    // Deleta a categoria
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

// Adicionar produto a uma categoria
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

    // Verifica se o produto já está associado a alguma categoria
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

// Remover produto de uma categoria
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

// Listar produtos de uma categoria
exports.findProducts = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { 
      page = 1, 
      limit = 1000 // Definir um limite alto para garantir que todos os produtos sejam retornados
    } = req.query;

    const offset = (page - 1) * limit;

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    // Busca produtos associados à categoria com paginação
    const products = await category.getProducts({
      limit: parseInt(limit),
      offset: parseInt(offset),
      joinTableAttributes: [], // Não retorna atributos da tabela de junção
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

    // Conta o total de produtos associados à categoria (sem paginação)
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