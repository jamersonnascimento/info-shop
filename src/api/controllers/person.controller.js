// This file contains controller functions for managing persons in the application.
// It includes operations such as creating, retrieving, updating, and deleting persons.

const db = require('../models');
const Person = db.Person;
const Client = db.Client;
const Address = db.Address;
const { Op } = require('sequelize');

// Constants to define the order of attributes for Person, Client, and Address
const PERSON_ATTRIBUTES = [
  'id_pessoa',
  'nome',
  'cpf',
  'email',
  'telefone',
  'data_nasc',
  'criado_em',
  'atualizado_em'
];

const CLIENT_ATTRIBUTES = [
  'id_cliente',
  'senha_hash',
  'criado_em',
  'atualizado_em'
];

const ADDRESS_ATTRIBUTES = [
  'id_endereco',
  'rua',
  'numero',
  'bairro',
  'cidade',
  'estado',
  'cep'
];

// Helper function to convert date format
const convertDateFormat = (dateStr) => {
  const brFormat = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  
  if (brFormat.test(dateStr)) {
    const [, day, month, year] = dateStr.match(brFormat);
    return `${year}-${month}-${day}`;
  }
  return dateStr;
};

// Create a new Person
exports.create = async (req, res) => {
  try {
    const { nome, cpf, email, telefone, data_nasc } = req.body;

    // Detailed validations
    if (!nome || nome.length < 2) {
      return res.status(400).json({ 
        message: 'Nome inválido. Mínimo de 2 caracteres.' 
      });
    }

    if (!cpf || !/^\d{11}$/.test(cpf)) {
      return res.status(400).json({ 
        message: 'CPF inválido. Deve conter 11 dígitos numéricos.' 
      });
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        message: 'Email inválido.' 
      });
    }

    if (!data_nasc) {
      return res.status(400).json({ 
        message: 'Data de nascimento é obrigatória.' 
      });
    }

    // Convert and validate the date
    const dataFormatada = convertDateFormat(data_nasc);
    const dataNascDate = new Date(dataFormatada);
    
    if (isNaN(dataNascDate.getTime())) {
      return res.status(400).json({ 
        message: 'Data de nascimento inválida. Use o formato dd/mm/yyyy.' 
      });
    }

    // Check if CPF or email already exists
    const existingPerson = await Person.findOne({
      where: {
        [Op.or]: [{ cpf }, { email }]
      }
    });

    if (existingPerson) {
      return res.status(409).json({ 
        message: 'CPF ou email já cadastrados.' 
      });
    }

    // Create the Person
    const person = await Person.create({ 
      nome, 
      cpf, 
      email, 
      telefone, 
      data_nasc: dataFormatada 
    });

    // Retrieve the created person with ordered attributes
    const newPerson = await Person.findByPk(person.id_pessoa, {
      attributes: PERSON_ATTRIBUTES
    });

    res.status(201).json({
      message: 'Pessoa criada com sucesso!',
      data: newPerson
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao criar a pessoa.', 
      error: error.message 
    });
  }
};

// Retrieve all Persons with pagination
exports.findAll = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      sortBy = 'nome', 
      order = 'ASC' 
    } = req.query;

    const offset = (page - 1) * limit;

    const where = search ? {
      [Op.or]: [
        { nome: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { cpf: { [Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows } = await Person.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, order]],
      raw: true,
      nest: true,
      attributes: PERSON_ATTRIBUTES,
      include: [{
        model: Client,
        as: 'clientInfo',
        attributes: CLIENT_ATTRIBUTES,
        include: [{
          model: Address,
          as: 'addresses',
          attributes: ADDRESS_ATTRIBUTES
        }]
      }]
    });

    // Reorganize the data before sending
    const formattedRows = rows.map(row => {
      const { id_pessoa, nome, cpf, email, telefone, data_nasc, criado_em, atualizado_em, ...rest } = row;
      return {
        id_pessoa,
        nome,
        cpf,
        email,
        telefone,
        data_nasc,
        criado_em,
        atualizado_em,
        ...rest
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
      message: 'Erro ao buscar pessoas.', 
      error: error.message 
    });
  }
};

// Retrieve a Person by ID
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const person = await Person.findByPk(id, {
      raw: true,
      nest: true,
      attributes: PERSON_ATTRIBUTES,
      include: [{
        model: Client,
        as: 'clientInfo',
        attributes: CLIENT_ATTRIBUTES,
        include: [{
          model: Address,
          as: 'addresses',
          attributes: ADDRESS_ATTRIBUTES
        }]
      }]
    });

    if (!person) {
      return res.status(404).json({ 
        message: 'Pessoa não encontrada.' 
      });
    }

    // Reorganize the data
    const { id_pessoa, nome, cpf, email, telefone, data_nasc, criado_em, atualizado_em, ...rest } = person;
    const formattedPerson = {
      id_pessoa,
      nome,
      cpf,
      email,
      telefone,
      data_nasc,
      criado_em,
      atualizado_em,
      ...rest
    };

    res.status(200).json(formattedPerson);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar a pessoa.', 
      error: error.message 
    });
  }
};

// Update a Person by ID
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If there is data_nasc, convert to the correct format
    if (updateData.data_nasc) {
      const dataFormatada = convertDateFormat(updateData.data_nasc);
      const dataNascDate = new Date(dataFormatada);
      
      if (isNaN(dataNascDate.getTime())) {
        return res.status(400).json({ 
          message: 'Data de nascimento inválida. Use o formato dd/mm/yyyy.' 
        });
      }
      
      updateData.data_nasc = dataFormatada;
    }

    const person = await Person.findByPk(id, {
      attributes: PERSON_ATTRIBUTES,
      include: [{
        model: Client,
        as: 'clientInfo',
        attributes: CLIENT_ATTRIBUTES
      }]
    });

    if (!person) {
      return res.status(404).json({ 
        message: 'Pessoa não encontrada para atualização.' 
      });
    }

    if (updateData.cpf || updateData.email) {
      const existingPerson = await Person.findOne({
        where: {
          [Op.and]: [
            { id_pessoa: { [Op.ne]: id } },
            {
              [Op.or]: [
                updateData.cpf ? { cpf: updateData.cpf } : null,
                updateData.email ? { email: updateData.email } : null
              ].filter(Boolean)
            }
          ]
        }
      });

      if (existingPerson) {
        return res.status(409).json({ 
          message: 'CPF ou email já cadastrados para outra pessoa.' 
        });
      }
    }

    await person.update(updateData);

    const updatedPerson = await Person.findByPk(id, {
      attributes: PERSON_ATTRIBUTES,
      include: [{
        model: Client,
        as: 'clientInfo',
        attributes: CLIENT_ATTRIBUTES,
        include: [{
          model: Address,
          as: 'addresses',
          attributes: ADDRESS_ATTRIBUTES
        }]
      }]
    });

    res.status(200).json({
      message: 'Pessoa atualizada com sucesso!',
      data: updatedPerson
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao atualizar a pessoa.', 
      error: error.message 
    });
  }
};

// Delete a Person by ID (Soft Delete)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const person = await Person.findByPk(id, {
      attributes: PERSON_ATTRIBUTES,
      include: [{
        model: Client,
        as: 'clientInfo',
        attributes: CLIENT_ATTRIBUTES
      }]
    });

    if (!person) {
      return res.status(404).json({ 
        message: 'Pessoa não encontrada.' 
      });
    }

    if (person.clientInfo) {
      return res.status(409).json({
        message: 'Não é possível excluir uma pessoa que é cliente.'
      });
    }

    await person.destroy();

    res.status(200).json({ 
      message: 'Pessoa excluída com sucesso.',
      data: {
        id: person.id_pessoa,
        nome: person.nome,
        email: person.email
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao excluir a pessoa.', 
      error: error.message 
    });
  }
};

// Delete all Persons (Development only)
exports.deleteAll = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ 
      message: 'Operação não permitida em ambiente de produção.' 
    });
  }

  try {
    const clientCount = await Client.count();
    if (clientCount > 0) {
      return res.status(409).json({
        message: 'Existem clientes cadastrados. Não é possível excluir todas as pessoas.'
      });
    }

    await Person.destroy({ 
      where: {},
      force: true
    });

    res.status(200).json({ 
      message: 'Todas as pessoas foram excluídas com sucesso.' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao excluir todas as pessoas.', 
      error: error.message 
    });
  }
};