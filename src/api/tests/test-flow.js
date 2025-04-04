/**
 * Script para testar o fluxo completo da API InfoShop
 * Este script simula um fluxo natural de uso da API para validar as relações do MER
 */

const axios = require('axios');

// Configuração base
const API_URL = 'http://localhost:8080/api';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Variáveis para armazenar IDs criados durante o fluxo
let personId, clientId, addressId, categoryId1, categoryId2;
let productId1, productId2, productId3;
let cartId, cartItemId1, cartItemId2;
let orderId, orderItemId1, orderItemId2;

// Função para executar o fluxo completo
async function runCompleteFlow() {
  try {
    console.log('\n===== INICIANDO TESTE DE FLUXO COMPLETO DA API =====\n');
    
    // 1. Criar uma pessoa
    await createPerson();
    
    // 2. Criar um cliente associado à pessoa
    await createClient();
    
    // 3. Criar um endereço para o cliente
    await createAddress();
    
    // 4. Criar categorias
    await createCategories();
    
    // 5. Criar produtos e associá-los às categorias
    await createProducts();
    
    // 6. Criar um carrinho para o cliente
    await createCart();
    
    // 7. Adicionar itens ao carrinho
    await addItemsToCart();
    
    // 8. Verificar o carrinho com os itens
    await checkCart();
    
    // 9. Criar um pedido a partir do carrinho
    await createOrderFromCart();
    
    // 10. Verificar o pedido criado
    await checkOrder();
    
    // 11. Atualizar o status do pedido
    await updateOrderStatus();
    
    console.log('\n===== TESTE DE FLUXO COMPLETO FINALIZADO COM SUCESSO =====\n');
  } catch (error) {
    console.error('Erro durante o fluxo de teste:', error.response?.data || error.message);
  }
}

// Funções para cada etapa do fluxo
async function createPerson() {
  console.log('1. Criando uma pessoa...');
  
  const personData = {
    nome: 'João da Silva',
    cpf: '12345678902',
    email: 'joao.silvaa@example.com',
    telefone: '11987654321',
    data_nasc: '1990-01-15'
  };
  
  const response = await api.post('/persons', personData);
  personId = response.data.data.id_pessoa;
  
  console.log(`Pessoa criada com sucesso! ID: ${personId}`);
  console.log('Dados da pessoa:', response.data.data);
}

async function createClient() {
  console.log('\n2. Criando um cliente associado à pessoa...');
  
  const clientData = {
    id_pessoa: personId,
    senha_hash: 'senha_segura_hash'
  };
  
  const response = await api.post('/clients', clientData);
  clientId = response.data.data.id_cliente;
  
  console.log(`Cliente criado com sucesso! ID: ${clientId}`);
  console.log('Dados do cliente:', response.data.data);
}

async function createAddress() {
  console.log('\n3. Criando um endereço para o cliente...');
  
  const addressData = {
    id_cliente: clientId,
    rua: 'Rua das Flores',
    numero: '123',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234567'
  };
  
  const response = await api.post('/addresses', addressData);
  addressId = response.data.data.id_endereco;
  
  console.log(`Endereço criado com sucesso! ID: ${addressId}`);
  console.log('Dados do endereço:', response.data.data);
}

async function createCategories() {
  console.log('\n4. Criando categorias...');
  
  // Primeira categoria
  const categoryData1 = {
    nome: 'Hardware',
    descricao: 'Componentes físicos de computadores'
  };
  
  const response1 = await api.post('/categories', categoryData1);
  categoryId1 = response1.data.data.id_categoria;
  
  console.log(`Categoria 1 criada com sucesso! ID: ${categoryId1}`);
  
  // Segunda categoria
  const categoryData2 = {
    nome: 'Periféricos',
    descricao: 'Dispositivos externos para computadores'
  };
  
  const response2 = await api.post('/categories', categoryData2);
  categoryId2 = response2.data.data.id_categoria;
  
  console.log(`Categoria 2 criada com sucesso! ID: ${categoryId2}`);
}

async function createProducts() {
  console.log('\n5. Criando produtos e associando-os às categorias...');
  
  // Produto 1 - Associado à categoria Hardware
  const productData1 = {
    nome: 'Processador Intel i7',
    descricao: 'Processador de alta performance',
    preco: 1500.00,
    estoque: 10,
    categorias: [categoryId1]
  };
  
  const response1 = await api.post('/products', productData1);
  productId1 = response1.data.data.id_produto;
  
  console.log(`Produto 1 criado com sucesso! ID: ${productId1}`);
  
  // Produto 2 - Associado à categoria Periféricos
  const productData2 = {
    nome: 'Mouse Gamer RGB',
    descricao: 'Mouse de alta precisão com iluminação RGB',
    preco: 250.00,
    estoque: 20,
    categorias: [categoryId2]
  };
  
  const response2 = await api.post('/products', productData2);
  productId2 = response2.data.data.id_produto;
  
  console.log(`Produto 2 criado com sucesso! ID: ${productId2}`);
  
  // Produto 3 - Associado a ambas categorias
  const productData3 = {
    nome: 'Placa de Vídeo RTX 3080',
    descricao: 'Placa de vídeo de alta performance',
    preco: 4500.00,
    estoque: 5,
    categorias: [categoryId1, categoryId2]
  };
  
  const response3 = await api.post('/products', productData3);
  productId3 = response3.data.data.id_produto;
  
  console.log(`Produto 3 criado com sucesso! ID: ${productId3}`);
}

async function createCart() {
  console.log('\n6. Criando um carrinho para o cliente...');
  
  const cartData = {
    id_cliente: clientId
  };
  
  const response = await api.post('/carts', cartData);
  cartId = response.data.data.id_carrinho;
  
  console.log(`Carrinho criado com sucesso! ID: ${cartId}`);
  console.log('Dados do carrinho:', response.data.data);
}

async function addItemsToCart() {
  console.log('\n7. Adicionando itens ao carrinho...');
  
  // Adicionar o primeiro produto ao carrinho
  const cartItemData1 = {
    id_carrinho: cartId,
    id_produto: productId1,
    quantidade: 1
  };
  
  const response1 = await api.post('/cart-items', cartItemData1);
  cartItemId1 = response1.data.data.id_item;
  
  console.log(`Item 1 adicionado ao carrinho com sucesso! ID: ${cartItemId1}`);
  
  // Adicionar o segundo produto ao carrinho
  const cartItemData2 = {
    id_carrinho: cartId,
    id_produto: productId2,
    quantidade: 2
  };
  
  const response2 = await api.post('/cart-items', cartItemData2);
  cartItemId2 = response2.data.data.id_item;
  
  console.log(`Item 2 adicionado ao carrinho com sucesso! ID: ${cartItemId2}`);
}

async function checkCart() {
  console.log('\n8. Verificando o carrinho com os itens...');
  
  const response = await api.get(`/carts/${cartId}?includeItems=true`);
  
  console.log('Dados do carrinho com itens:');
  console.log(JSON.stringify(response.data.data, null, 2));
}

async function createOrderFromCart() {
  console.log('\n9. Criando um pedido a partir do carrinho...');
  
  const orderData = {
    id_carrinho: cartId
  };
  
  const response = await api.post('/orders/from-cart', orderData);
  orderId = response.data.data.id_pedido;
  
  console.log(`Pedido criado com sucesso a partir do carrinho! ID: ${orderId}`);
  console.log('Dados do pedido:', response.data.data);
}

async function checkOrder() {
  console.log('\n10. Verificando o pedido criado...');
  
  const response = await api.get(`/orders/${orderId}?includeItems=true`);
  
  console.log('Dados do pedido com itens:');
  console.log(JSON.stringify(response.data.data, null, 2));
}

async function updateOrderStatus() {
  console.log('\n11. Atualizando o status do pedido...');
  
  const updateData = {
    status: 'finalizado'
  };
  
  const response = await api.patch(`/orders/${orderId}`, updateData);
  
  console.log('Status do pedido atualizado com sucesso!');
  console.log('Dados do pedido atualizado:', response.data.data);
}

// Executar o fluxo completo
runCompleteFlow();