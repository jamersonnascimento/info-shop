import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const CategoryItem = ({ item }) => {
  return (
    <View style={styles.categoryItem}>
      <Text style={styles.categoryName}>{item.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  categoryName: {
    fontSize: 16,
  },
});

export default CategoryItem;

