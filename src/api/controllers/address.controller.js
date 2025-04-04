// This file contains controller functions for managing addresses in the application.
// It includes operations such as creating, retrieving, updating, and deleting addresses.

const db = require('../models');
const Address = db.Address;
const Client = db.Client;
const Person = db.Person;
const { Op } = require('sequelize');

// Constants to define the order of attributes for Address, Client, and Person
const ADDRESS_ATTRIBUTES = [
  'id_endereco',
  'id_cliente',
  'rua',
  'numero',
  'bairro',
  'cidade',
  'estado',
  'cep',
  'criado_em',
  'atualizado_em'
];

const CLIENT_ATTRIBUTES = [
  'id_cliente',
  'senha_hash',
  'criado_em',
  'atualizado_em'
];

const PERSON_ATTRIBUTES = [
  'nome',
  'cpf',
  'email',
  'telefone',
  'data_nasc'
];

// Create a new Address
exports.create = async (req, res) => {
  try {
    const { 
      id_cliente, 
      rua, 
      numero, 
      bairro, 
      cidade, 
      estado, 
      cep 
    } = req.body;

    // Validate required fields
    if (!id_cliente) {
      return res.status(400).json({ 
        message: 'ID do cliente é obrigatório.' 
      });
    }

    // Check if the client exists and include person information
    const client = await Client.findByPk(id_cliente, {
      include: [{
        model: Person,
        as: 'personInfo',
        attributes: PERSON_ATTRIBUTES
      }]
    });

    if (!client) {
      return res.status(404).json({ 
        message: 'Cliente não encontrado.' 
      });
    }

    // Create the Address
    const address = await Address.create({ 
      id_cliente, 
      rua, 
      numero, 
      bairro, 
      cidade, 
      estado: estado.toUpperCase(), 
      cep 
    });

    // Retrieve the created address with all relations
    const createdAddress = await Address.findByPk(address.id_endereco, {
      include: [{
        model: Client,
        as: 'clientInfo',
        attributes: CLIENT_ATTRIBUTES,
        include: [{
          model: Person,
          as: 'personInfo',
          attributes: PERSON_ATTRIBUTES
        }]
      }]
    });

    res.status(201).json({
      message: 'Endereço criado com sucesso!',
      data: createdAddress
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao criar o endereço.', 
      error: error.message 
    });
  }
};

// Retrieve all Addresses for a Client
exports.findAllByClient = async (req, res) => {
  try {
    const { id_cliente } = req.params;
    
    const addresses = await Address.findAll({
      where: { id_cliente },
      order: [['criado_em', 'DESC']]
    });

    res.status(200).json({
      data: addresses
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar os endereços.', 
      error: error.message 
    });
  }
};

// Retrieve a specific Address
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findByPk(id, {
      raw: true,
      nest: true,
      attributes: ADDRESS_ATTRIBUTES,
      include: [{
        model: Client,
        as: 'clientInfo',
        attributes: CLIENT_ATTRIBUTES,
        include: [{
          model: Person,
          as: 'personInfo',
          attributes: PERSON_ATTRIBUTES
        }]
      }]
    });

    if (!address) {
      return res.status(404).json({ 
        message: 'Endereço não encontrado.' 
      });
    }

    // Reorganize the data
    const { clientInfo, ...addressData } = address;
    
    const formattedAddress = {
      ...addressData,
      clientInfo: {
        ...clientInfo,
        personInfo: clientInfo?.personInfo
      }
    };

    res.status(200).json(formattedAddress);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar o endereço.', 
      error: error.message 
    });
  }
};

// Retrieve all Addresses with pagination
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
        { rua: { [Op.iLike]: `%${search}%` } },
        { bairro: { [Op.iLike]: `%${search}%` } },
        { cidade: { [Op.iLike]: `%${search}%` } },
        { cep: { [Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows } = await Address.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, order]],
      raw: true,
      nest: true,
      attributes: ADDRESS_ATTRIBUTES,
      include: [{
        model: Client,
        as: 'clientInfo',
        attributes: CLIENT_ATTRIBUTES,
        include: [{
          model: Person,
          as: 'personInfo',
          attributes: PERSON_ATTRIBUTES
        }]
      }]
    });

    // Reorganize the data before sending
    const formattedRows = rows.map(row => {
      const { clientInfo, ...addressData } = row;
      
      return {
        ...addressData,
        clientInfo: {
          ...clientInfo,
          personInfo: clientInfo?.personInfo
        }
      };
    });

    res.status(200).json({
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: formattedRows
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar os endereços.', 
      error: error.message 
    });
  }
};

// Update an Address
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if trying to change id_cliente
    if (updateData.id_cliente) {
      return res.status(403).json({ 
        message: 'Não é permitido alterar o cliente associado ao endereço.',
        details: 'Por questões de integridade, um endereço não pode ser transferido para outro cliente.'
      });
    }

    const address = await Address.findByPk(id);
    if (!address) {
      return res.status(404).json({ 
        message: 'Endereço não encontrado.' 
      });
    }

    // Convert estado to uppercase if present
    if (updateData.estado) {
      updateData.estado = updateData.estado.toUpperCase();
    }

    await address.update(updateData);

    // Retrieve the updated address with all relations
    const updatedAddress = await Address.findByPk(id, {
      raw: true,
      nest: true,
      attributes: ADDRESS_ATTRIBUTES,
      include: [{
        model: Client,
        as: 'clientInfo',
        attributes: CLIENT_ATTRIBUTES,
        include: [{
          model: Person,
          as: 'personInfo',
          attributes: PERSON_ATTRIBUTES
        }]
      }]
    });

    // Reorganize the data
    const { clientInfo, ...addressData } = updatedAddress;
    const formattedAddress = {
      ...addressData,
      clientInfo: {
        ...clientInfo,
        personInfo: clientInfo?.personInfo
      }
    };

    res.status(200).json({
      message: 'Endereço atualizado com sucesso!',
      data: formattedAddress
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao atualizar o endereço.', 
      error: error.message 
    });
  }
};

// Delete an Address
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findByPk(id);
    if (!address) {
      return res.status(404).json({ 
        message: 'Endereço não encontrado.' 
      });
    }

    await address.destroy();

    res.status(200).json({ 
      message: 'Endereço excluído com sucesso.',
      data: { id }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao excluir o endereço.', 
      error: error.message 
    });
  }
};

