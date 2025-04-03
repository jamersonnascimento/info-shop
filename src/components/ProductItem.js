import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ProductImage from './ProductImage';

const ProductItem = ({ item }) => {
  return (
    <View style={styles.productCard}>
      <View style={styles.productItem}>
        <ProductImage 
          source={item.image || item.imageUrl} 
          fallbackUrl={item.imageUrl} 
          style={styles.productImage} 
          productId={item.id} // Adicionando o ID do produto para buscar imagem local
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price}</Text>
          <Text style={styles.productDiscount}>por: {item.discountPrice} no PIX</Text>
          <Text style={styles.productInstallments}>{item.installments}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productImage: {
    width: 70,
    height: 70,
    marginRight: 16,
    borderRadius: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    textDecorationLine: 'line-through',
    fontSize: 14,
  },
  productDiscount: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 15,
  },
  productInstallments: {
    color: 'gray',
    fontSize: 13,
    marginTop: 2,
  },
});

export default ProductItem;
