/*
Este arquivo é responsável por mapear IDs de produtos para imagens locais. 
Ele contém funções como`getProductImage` e`hasLocalImage` que permitem verificar 
se existe uma imagem local para um determinado ID de produto e retorná-la quando necessário.
*/
/**
 * Mapeamento de IDs de produtos para imagens locais
 * 
 * Este arquivo permite associar IDs de produtos do banco de dados
 * com imagens locais armazenadas na pasta assets/images/products
 */

// Mapeamento de ID do produto para o caminho da imagem local
const productImageMap = {
  // Formato: 'id_do_produto': require('caminho_para_imagem')
  '1': require('../assets/images/products/produto_1.jpg'),
  
  '3': require('../assets/images/products/produto_3.jpg'),
  '4': require('../assets/images/products/produto_4.jpg'),
  '5': require('../assets/images/products/produto_5.jpg'),
  '6': require('../assets/images/products/produto_6.jpg'),
  '7': require('../assets/images/products/produto_7.jpg'),
  '8': require('../assets/images/products/produto_8.jpg'),
  '9': require('../assets/images/products/produto_9.jpg'),
  '10': require('../assets/images/products/produto_10.jpg'),
  '11': require('../assets/images/products/produto_11.jpg'),
  '12': require('../assets/images/products/produto_12.jpg'),
  '13': require('../assets/images/products/produto_13.jpg'),
  '14': require('../assets/images/products/produto_14.jpg'),
  '15': require('../assets/images/products/produto_15.jpg'),
  '16': require('../assets/images/products/produto_16.jpg'),
  '17': require('../assets/images/products/produto_17.jpg'),
  '18': require('../assets/images/products/produto_18.jpg'),
  '19': require('../assets/images/products/produto_19.jpg'),
  '20': require('../assets/images/products/produto_20.jpg'),
  '21': require('../assets/images/products/produto_21.jpg'),
  '23': require('../assets/images/products/produto_23.jpg'),
  '24': require('../assets/images/products/produto_24.jpg'),
  // Adicione novos mapeamentos abaixo
};



/**
 * Obtém a imagem local para um produto específico com base no ID
 * @param {string} productId - ID do produto
 * @returns {Object|null} - Referência da imagem local ou null se não encontrada
 */
export const getProductImage = (productId) => {
  return productImageMap[productId] || null;
};

/**
 * Verifica se existe uma imagem local para um produto específico
 * @param {string} productId - ID do produto
 * @returns {boolean} - true se existir uma imagem local, false caso contrário
 */
export const hasLocalImage = (productId) => {
  return !!productImageMap[productId];
};