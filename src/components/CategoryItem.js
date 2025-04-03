import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const CategoryItem = ({ item }) => {
  return (
    <View style={styles.categoryItem}>
      <Text style={styles.categoryName}>{item.name}</Text>
      {item.description && (
        <Text style={styles.categoryDescription}>{item.description}</Text>
      )}
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
    fontWeight: 'bold',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default CategoryItem;

