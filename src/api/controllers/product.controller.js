const db = require('../models');
const Product = db.Product;
const Category = db.Category;
const { Op } = require('sequelize');

// Constantes para definir ordem dos atributos
const PRODUCT_ATTRIBUTES = [
  'id_produto',
  'nome',
  'descricao',
  'preco',
  'estoque',
  'criado_em',
  'atualizado_em'
];

// Criar um novo Produto
exports.create = async (req, res) => {
  try {
    const { nome, descricao, preco, estoque } = req.body;

    // Validações mais robustas
    if (!nome?.trim()) {
      return res.status(400).json({ message: 'Nome do produto é obrigatório e não pode estar vazio' });
    }

    if (typeof preco !== 'number' || preco <= 0) {
      return res.status(400).json({ message: 'Preço deve ser um número positivo' });
    }

    if (estoque !== undefined && (typeof estoque !== 'number' || estoque < 0)) {
      return res.status(400).json({ message: 'Estoque deve ser um número não negativo' });
    }

    // Criação do Produto
    const product = await Product.create({ 
      nome,
      descricao,
      preco,
      estoque: estoque || 0
    });

    res.status(201).json({
      message: 'Produto criado com sucesso!',
      data: product
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao criar o produto.', 
      error: error.message 
    });
  }
};

// Buscar todos os Produtos com paginação
exports.findAll = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      sortBy = 'criado_em', 
      order = 'DESC',
      minPrice,
      maxPrice,
      inStock = false 
    } = req.query;

    const offset = (page - 1) * limit;

    const where = search ? {
      [Op.or]: [
        { nome: { [Op.iLike]: `%${search}%` } },
        { descricao: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};

    if (minPrice) {
      where.preco = { ...where.preco, [Op.gte]: minPrice };
    }

    if (maxPrice) {
      where.preco = { ...where.preco, [Op.lte]: maxPrice };
    }

    if (inStock === 'true') {
      where.estoque = { [Op.gt]: 0 };
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      attributes: PRODUCT_ATTRIBUTES,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, order]],
      raw: true,
      nest: true
    });

    res.status(200).json({
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: rows
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar os produtos.', 
      error: error.message 
    });
  }
};

// Buscar um Produto específico
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      attributes: PRODUCT_ATTRIBUTES
    });

    if (!product) {
      return res.status(404).json({ 
        message: 'Produto não encontrado.' 
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar o produto.', 
      error: error.message 
    });
  }
};

// Atualizar um Produto
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, estoque } = req.body;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    // Validações dos campos a serem atualizados
    if (nome !== undefined && !nome.trim()) {
      return res.status(400).json({ message: 'Nome não pode ser vazio' });
    }

    if (preco !== undefined && (typeof preco !== 'number' || preco <= 0)) {
      return res.status(400).json({ message: 'Preço deve ser um número positivo' });
    }

    if (estoque !== undefined && (typeof estoque !== 'number' || estoque < 0)) {
      return res.status(400).json({ message: 'Estoque deve ser um número não negativo' });
    }

    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ 
        message: 'Produto não encontrado.' 
      });
    }

    await product.update({
      nome,
      descricao,
      preco,
      estoque
    });

    res.status(200).json({
      message: 'Produto atualizado com sucesso!',
      data: product
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao atualizar o produto.', 
      error: error.message 
    });
  }
};

// Deletar um Produto
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ 
        message: 'Produto não encontrado.' 
      });
    }

    // Verifica se o produto está em algum carrinho
    const hasCartItems = await product.countCartItems();
    if (hasCartItems > 0) {
      return res.status(403).json({ 
        message: 'Não é possível excluir um produto que está em carrinhos.' 
      });
    }

    await product.destroy();

    res.status(200).json({ 
      message: 'Produto excluído com sucesso.',
      data: { id }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao excluir o produto.', 
      error: error.message 
    });
  }
};

// Adicionar categoria a um produto
exports.addCategory = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({ message: 'ID da categoria é obrigatório' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    await product.addCategory(category);

    res.status(200).json({
      message: 'Categoria adicionada ao produto com sucesso!'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao adicionar categoria ao produto.', 
      error: error.message 
    });
  }
};

// Remover categoria de um produto
exports.removeCategory = async (req, res) => {
  try {
    const productId = req.params.productId;
    const categoryId = req.params.categoryId;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    await product.removeCategory(category);

    res.status(200).json({
      message: 'Categoria removida do produto com sucesso!'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao remover categoria do produto.', 
      error: error.message 
    });
  }
};

// Listar categorias de um produto
exports.findCategories = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { 
      page = 1, 
      limit = 10
    } = req.query;

    const offset = (page - 1) * limit;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Busca categorias associadas ao produto com paginação
    const categories = await product.getCategories({
      limit: parseInt(limit),
      offset: parseInt(offset),
      joinTableAttributes: [], // Não retorna atributos da tabela de junção
      attributes: [
        'id_categoria',
        'nome',
        'descricao',
        'criado_em',
        'atualizado_em'
      ]
    });

    // Conta o total de categorias associadas ao produto (sem paginação)
    const count = await product.countCategories();

    res.status(200).json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      categories: categories
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar categorias do produto.', 
      error: error.message 
    });
  }
};