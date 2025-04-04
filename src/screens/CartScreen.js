import React, { useContext } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EmptyCartMessage from '../components/EmptyCartMessage';
import CartItem from '../components/CartItem';
import BottomNavigation from '../components/BottomNavigation';
import { CartContext } from '../context/CartContext';

// CartScreen component displays the shopping cart interface
const CartScreen = ({ navigation }) => {
  const { cartItems, clearCart, removeFromCart, updateQuantity } = useContext(CartContext);

  const handleExplore = () => {
    navigation.navigate('Home');
  };

  const handleSummary = () => {
    navigation.navigate('OrderSummary');
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Seu carrinho de compras</Text>

      {/* Empty Cart Message or List of Items */}
      {cartItems.length === 0 ? (
        <EmptyCartMessage onExplore={handleExplore} />
      ) : (
        <View style={styles.scrollContainer}>
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
            contentContainerStyle={styles.flatListContent} // Adds internal spacing
          />
        </View>
      )}

      {/* Order Summary and Clear Cart Button */}
      {cartItems.length > 0 && (
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.summaryContainer} onPress={handleSummary}>
            <Text style={styles.summaryText}>Resumo do pedido</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
            <View style={styles.clearButtonContent}>
              <Icon name="trash" size={20} color="#fff" />
              <Text style={styles.clearButtonText}>Limpar o carrinho</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0, // Keeps padding 0 for BottomNavigation alignment
    backgroundColor: '#F6ECDA', // Background color
  },
  title: {
    fontSize: 28, // Increase font size
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    marginTop: 50, // Add top margin to move away from the top of the screen
    color: '#333',
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Adding shadow to text
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  scrollContainer: {
    flex: 1,
    marginHorizontal: 16, // Adds lateral margin to scrollContainer
  },
  flatListContent: {
    paddingVertical: 16, // Adds internal vertical spacing
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 80, // Adjustment for BottomNavigation
  },
  summaryContainer: {
    backgroundColor: '#228B22',  // Dark green color in hexadecimal
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: 150,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff', // White text color
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#ff6347', // Tomato red background
    borderRadius: 10,
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    flexDirection: 'row', // Keeps icon and text on the same line
    paddingHorizontal: 10,
  },
  clearButtonContent: {
    flexDirection: 'row', // Keeps icon and text on the same line
    alignItems: 'center',
  },
  clearButtonText: {
    marginLeft: 5,
    color: '#fff', // White text color
    fontWeight: 'bold',
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  removeItemButton: {
    paddingHorizontal: 10,
  },
});

export default CartScreen;




















