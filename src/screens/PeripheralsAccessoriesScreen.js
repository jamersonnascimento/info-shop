import React, { useContext } from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../components/BottomNavigation';
import { CartContext } from '../context/CartContext';

// PeripheralsAccessoriesScreen component displays a list of peripherals and accessories
const PeripheralsAccessoriesScreen = ({ route }) => {
  const navigation = useNavigation();
  const { categoryName } = route.params;
  const { addToCart } = useContext(CartContext);
  const products = [
    {
        id: '1',
        name: 'Mouse Gamer Redragon King Pro 4K',
        price: 'R$ 422,52',
        discountPrice: 'R$ 299,90',
        installments: 'R$ 351,16 em até 12x',
        image: 'https://www.dropbox.com/scl/fi/m2flo68c8uqtvwceg46t5/Mouse-Gamer-Redragon-King-Pro-4K.jpg?rlkey=r1haqhrgys45z0qtn8ewuyphk&st=nvlcvv1f&dl=1',
      },
      {
        id: '2',
        name: 'Teclado Mecânico Redragon Kumara',
        price: 'R$ 299,99',
        discountPrice: 'R$ 199,99',
        installments: 'R$ 234,99 em até 12x',
        image: 'https://www.dropbox.com/scl/fi/7ppoz0f64wc8uu27ju9h7/Teclado-Mec-nico-Redragon-Kumara-RGB.jpg?rlkey=fsfg9pqd0nabfrzz3bnoqpvq5&st=49z7np5c&dl=1',
      },
      {
        id: '3',
        name: 'Webcam Logitech C920',
        price: 'R$ 499,99',
        discountPrice: 'R$ 399,99',
        installments: 'R$ 467,99 em até 12x',
        image: 'https://www.dropbox.com/scl/fi/bqird1fyklzpmxpfzpulf/Webcam-Logitech-C920.jpg?rlkey=22wlr2mpl86e243x4ri0if5ig&st=kcw39vyq&dl=1',
      },
  ];

  const handleLogoPress = () => {
    navigation.navigate('Home');
  };

  const handlePurchase = () => {
    // Alert for the addToCart button
    alert('Produto adicionado ao carrinho!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogoPress}>
          <Image source={require('../assets/images/Logo_JamesWebb_Info.png')} style={styles.logo} />
        </TouchableOpacity>
      </View>
      <Text style={styles.categoryTitle}>{categoryName}</Text>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>De {item.price}</Text>
              <Text style={styles.itemDiscountPrice}>{item.discountPrice} no PIX</Text>
              <Text style={styles.itemInstallments}>{item.installments}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addToCart(item)}
              >
                <Text style={styles.addButtonText}>Adicionar ao Carrinho</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.noResults}>Nenhum produto encontrado.</Text>}
        contentContainerStyle={styles.contentContainer}
      />
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6ECDA',  // Lighter background for better contrast with the cards
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginRight: 5,
    marginLeft: 0,
    marginTop: 30,
    marginBottom: 5,
    borderRadius: 25,
    padding: 30,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: -40,
    textAlign: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#b3b3b3',
    paddingBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 15,
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  itemDetails: {
    marginLeft: 20,
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#999',
    marginBottom: 2,
  },
  itemDiscountPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e60000',
    marginBottom: 2,
  },
  itemInstallments: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#228B22', // Green color
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#999',
  },
  contentContainer: {
    paddingBottom: 80, // Increased to give space to BottomNavigation
  },
});

export default PeripheralsAccessoriesScreen;
