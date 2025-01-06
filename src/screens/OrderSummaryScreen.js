import React, { useContext, useMemo } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import CartItem from '../components/CartItem';
import { CartContext } from '../context/CartContext';

const OrderSummaryScreen = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  // Função para calcular o valor total dos produtos no carrinho
  const totalValue = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity * parseFloat(item.discountPrice.replace('R$', '').replace('.', '').replace(',', '.')), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }, [cartItems]);

  const handlePurchase = () => {
    // Aqui você pode adicionar a lógica de compra
    alert("Compra realizada com sucesso!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo do Pedido</Text>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onRemove={() => removeFromCart(item.id)}
            onUpdateQuantity={(itemId, quantity) => updateQuantity(itemId, quantity)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatListContent}
      />
      <View style={styles.totalContainer}>
        <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
          <Text style={styles.purchaseButtonText}>Comprar</Text>
        </TouchableOpacity>
        <Text style={styles.totalText}>Total à vista no PIX: {totalValue}</Text>
      </View>
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
    marginTop: 40,
  },
  flatListContent: {
    paddingBottom: 16,
  },
  totalContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 70,
    marginTop: 0,
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  purchaseButton: {
    backgroundColor: '#228B22', // Cor verde escuro
    borderRadius: 10,
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  purchaseButtonText: {
    color: '#fff', // Cor do texto em branco
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default OrderSummaryScreen;




