import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProductImage from './ProductImage';

/**
 * Componente para exibir um item no carrinho de compras
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.item - O item do carrinho a ser exibido
 * @param {Function} props.onRemove - Função chamada quando o usuário remove o item
 * @param {Function} props.onUpdateQuantity - Função chamada quando o usuário atualiza a quantidade
 */
const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  // Função para formatar valores monetários
  const formatValue = (value) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return 'R$ 0,00';
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Extrai e formata os valores de preço do item
  const precos = useMemo(() => {
    // Função para extrair valor numérico de uma string de preço
    const extrairValor = (precoStr) => {
      if (typeof precoStr !== 'string') return 0;
      return parseFloat(precoStr.replace('R$', '').replace('.', '').replace(',', '.')) || 0;
    };

    const precoOriginal = extrairValor(item.price);
    const precoDesconto = extrairValor(item.discountPrice);
    
    return {
      original: formatValue(precoOriginal),
      desconto: formatValue(precoDesconto * item.quantity)
    };
  }, [item.price, item.discountPrice, item.quantity]);

  return (
    <View style={styles.container}>
      <ProductImage 
        source={item.image || item.imageUrl} 
        fallbackUrl={item.imageUrl} 
        style={styles.image} 
        resizeMode='contain'
        productId={item.id}
      />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>De {precos.original}</Text>
        <Text style={styles.discountPrice}>{precos.desconto} no PIX</Text>
        <Text style={styles.installments}>{item.installments}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            onPress={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            style={styles.quantityButton}
          >
            <Icon name="minus" size={20} color="#ff6347" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity 
            onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
            style={styles.quantityButton}
          >
            <Icon name="plus" size={20} color="#ff6347" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Icon name="trash" size={20} color="#ff6347" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    marginVertical: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  details: {
    flex: 1,
    marginLeft: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    // Limita o texto a 2 linhas
    maxWidth: '90%',
    numberOfLines: 2,
    ellipsizeMode: 'tail',
  },
  price: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#999',
    marginBottom: 2,
  },
  discountPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e60000',
    marginBottom: 2,
  },
  installments: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    padding: 10,
    marginLeft: 5,
  },
});

export default CartItem;




