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
  '14': require('../assets/images/products/produto_14.jpg'),
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