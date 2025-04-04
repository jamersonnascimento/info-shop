import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

// EmptyFavoritesMessage component displays a message when there are no favorite products
const EmptyFavoritesMessage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Nenhum produto nos seus favoritos.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    color: 'gray',
  },
});

export default EmptyFavoritesMessage;
