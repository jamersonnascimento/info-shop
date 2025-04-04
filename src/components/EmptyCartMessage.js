import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// EmptyCartMessage component displays a message when the shopping cart is empty
const EmptyCartMessage = ({ onExplore }) => {
  return (
    <View style={styles.container}>
      <Icon name="shopping-cart" size={50} color="gray" style={styles.icon} />
      <Text style={styles.message}>Seu carrinho está vazio</Text>
      <Text style={styles.subMessage}>Escolha o que te levará ao próximo nível.</Text>
      <Button title="Vamos Explorar!" onPress={onExplore} color="green" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 8,
  },
  subMessage: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 16,
  },
});

export default EmptyCartMessage;
