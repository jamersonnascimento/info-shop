import React, { useContext, useMemo, useState } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Modal } from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import CartItem from '../components/CartItem';
import { CartContext } from '../context/CartContext';

const OrderSummaryScreen = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Função para calcular o valor total dos produtos no carrinho
  const totalValue = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity * parseFloat(item.discountPrice.replace('R$', '').replace('.', '').replace(',', '.')), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }, [cartItems]);

  const handlePurchase = (paymentMethod) => {
    // Aqui você pode adicionar a lógica de compra com o método de pagamento selecionado
    setSelectedPaymentMethod(paymentMethod);
    setModalVisible(false);
    alert(`Compra realizada com sucesso! Método de pagamento: ${paymentMethod}`);
  };
  
  const openPaymentModal = () => {
    setModalVisible(true);
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
        <Text style={styles.totalText}>Total: {totalValue}</Text>
        
        <TouchableOpacity 
          style={styles.mainPurchaseButton} 
          onPress={openPaymentModal}
        >
          <Text style={styles.purchaseButtonText}>COMPRAR</Text>
        </TouchableOpacity>
      </View>
      
      {/* Modal de métodos de pagamento */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Escolha o método de pagamento</Text>
            
            <View style={styles.paymentButtonsContainer}>
              <TouchableOpacity 
                style={[styles.purchaseButton, selectedPaymentMethod === 'cartao_credito' ? styles.selectedButton : null]} 
                onPress={() => handlePurchase('cartao_credito')}
              >
                <Text style={styles.purchaseButtonText}>Cartão de Crédito</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.purchaseButton, selectedPaymentMethod === 'cartao_debito' ? styles.selectedButton : null]} 
                onPress={() => handlePurchase('cartao_debito')}
              >
                <Text style={styles.purchaseButtonText}>Cartão de Débito</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.purchaseButton, selectedPaymentMethod === 'pix' ? styles.selectedButton : null]} 
                onPress={() => handlePurchase('pix')}
              >
                <Text style={styles.purchaseButtonText}>PIX</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.purchaseButton, selectedPaymentMethod === 'boleto' ? styles.selectedButton : null]} 
                onPress={() => handlePurchase('boleto')}
              >
                <Text style={styles.purchaseButtonText}>Boleto</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 10,
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  mainPurchaseButton: {
    backgroundColor: '#228B22',
    borderRadius: 10,
    width: 200,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  purchaseButton: {
    backgroundColor: '#228B22', // Cor verde escuro
    borderRadius: 10,
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    margin: 5,
  },
  selectedButton: {
    backgroundColor: '#006400', // Verde mais escuro quando selecionado
    borderWidth: 2,
    borderColor: '#FFD700', // Borda dourada
  },
  purchaseButtonText: {
    color: '#fff', // Cor do texto em branco
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ff6347',
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OrderSummaryScreen;




