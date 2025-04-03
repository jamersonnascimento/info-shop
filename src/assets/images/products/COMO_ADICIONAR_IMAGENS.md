# Como Adicionar Imagens de Produtos

## Visão Geral

Este sistema permite que você adicione suas próprias imagens locais para os produtos que vêm do banco de dados, em vez de usar imagens de placeholder ou URLs remotas.

## Passo 1: Adicione a imagem na pasta correta

Salve a imagem do produto na pasta `src/assets/images/products/` com um nome que inclua o ID do produto para facilitar a identificação, por exemplo: `produto_1.jpg` para o produto com ID 1.

## Passo 2: Atualize o arquivo de mapeamento de imagens

Abra o arquivo `src/utils/productImageMapper.js` e adicione uma entrada para o produto no objeto `productImageMap`:

```javascript
const productImageMap = {
  // Formato: 'id_do_produto': require('../assets/images/products/nome_da_imagem.jpg'),
  '1': require('../assets/images/products/produto_1.jpg'),
  '2': require('../assets/images/products/produto_2.jpg'),
  // Adicione mais produtos conforme necessário
};
```

## Dicas para imagens de produtos

1. **Tamanho recomendado**: 500x500 pixels ou maior, mantendo proporção quadrada
2. **Formato**: JPG ou PNG (prefira JPG para fotos e PNG para imagens com transparência)
3. **Qualidade**: Use imagens de boa qualidade, mas otimizadas para web
4. **Fundo**: Prefira imagens com fundo branco ou transparente
5. **Consistência**: Mantenha um padrão visual entre as imagens dos produtos

## Exemplo prático

Se você tem um produto com ID "5" no banco de dados e quer adicionar uma imagem local para ele:

1. Salve a imagem como `produto_5.jpg` nesta pasta
2. Abra o arquivo `src/utils/productImageMapper.js`
3. Adicione a linha: `'5': require('../assets/images/products/produto_5.jpg'),`

Pronto! Agora o produto com ID 5 usará a imagem local que você adicionou em vez da imagem de placeholder.

## Usando o componente ProductImage

O componente `ProductImage` foi criado para facilitar a exibição de imagens de produtos. Ele suporta:

- Imagens locais (via require)
- URLs remotas
- Fallback para URL alternativa se a imagem principal falhar
- Indicador de carregamento

Exemplo de uso:

```jsx
<ProductImage 
  source={product.image} 
  fallbackUrl={product.imageUrl} 
  style={styles.productImage} 
  resizeMode="contain"
/>
```