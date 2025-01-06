import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  // Função para formatar valores monetários
  const formatValue = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>De {formatValue(parseFloat(item.price.replace('R$', '').replace('.', '').replace(',', '.')))}</Text>
        <Text style={styles.discountPrice}>{formatValue(item.quantity * parseFloat(item.discountPrice.replace('R$', '').replace('.', '').replace(',', '.')))} no PIX</Text>
        <Text style={styles.installments}>{item.installments}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}>
            <Icon name="minus" size={20} color="#ff6347" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}>
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    marginLeft: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#999',
  },
  discountPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e60000',
  },
  installments: {
    fontSize: 12,
    color: '#999',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    paddingHorizontal: 10,
  },
});

export default CartItem;




