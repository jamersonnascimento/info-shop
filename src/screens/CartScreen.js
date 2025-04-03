import React, { useContext } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EmptyCartMessage from '../components/EmptyCartMessage';
import CartItem from '../components/CartItem';
import BottomNavigation from '../components/BottomNavigation';
import { CartContext } from '../context/CartContext';

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
      {/* Título em destaque */}
      <Text style={styles.title}>Seu carrinho de compras</Text>

      {/* Mensagem de Carrinho Vazio ou Lista de Itens */}
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
            contentContainerStyle={styles.flatListContent} // Adiciona espaçamento interno
          />
        </View>
      )}

      {/* Resumo do Pedido e Botão para limpar o carrinho */}
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
    padding: 0, // Mantém o padding 0 para o BottomNavigation ficar alinhado
    backgroundColor: '#F6ECDA',
  },
  title: {
    fontSize: 28, // Aumentar o tamanho da fonte
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    marginTop: 50, // Adicionar margem superior para afastar do topo da tela
    color: '#333',
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Adicionando sombra ao texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  scrollContainer: {
    flex: 1,
    marginHorizontal: 16, // Adiciona margem lateral para o scrollContainer
  },
  flatListContent: {
    paddingVertical: 16, // Adiciona espaçamento interno vertical
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 80, // Ajuste para a BottomNavigation
  },
  summaryContainer: {
    backgroundColor: '#228B22',  // Cor verde escuro em hexadecimal
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
    color: '#fff', // Cor do texto em branco
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#ff6347', // Fundo vermelho tomate
    borderRadius: 10,
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    flexDirection: 'row', // Mantém ícone e texto na mesma linha
    paddingHorizontal: 10,
  },
  clearButtonContent: {
    flexDirection: 'row', // Mantém ícone e texto na mesma linha
    alignItems: 'center',
  },
  clearButtonText: {
    marginLeft: 5,
    color: '#fff', // Cor do texto em branco
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




















