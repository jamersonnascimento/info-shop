import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const ProductItem = ({ item }) => {
  return (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <Text style={styles.productDiscount}>por: {item.discountPrice} no PIX</Text>
        <Text style={styles.productInstallments}>{item.installments}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    textDecorationLine: 'line-through',
  },
  productDiscount: {
    color: 'red',
  },
  productInstallments: {
    color: 'gray',
  },
});

export default ProductItem;
