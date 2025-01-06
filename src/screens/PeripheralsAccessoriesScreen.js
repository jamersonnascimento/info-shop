import React, { useContext } from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../components/BottomNavigation';
import { CartContext } from '../context/CartContext';

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
        image: 'https://via.placeholder.com/150',
      },
      {
        id: '2',
        name: 'Teclado Mecânico Redragon Kumara',
        price: 'R$ 299,99',
        discountPrice: 'R$ 199,99',
        installments: 'R$ 234,99 em até 12x',
        image: 'https://via.placeholder.com/150',
      },
      {
        id: '3',
        name: 'Webcam Logitech C920',
        price: 'R$ 499,99',
        discountPrice: 'R$ 399,99',
        installments: 'R$ 467,99 em até 12x',
        image: 'https://via.placeholder.com/150',
      },
  ];

  const handleLogoPress = () => {
    navigation.navigate('Home');
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
            <Image source={{ uri: item.image }} style={styles.itemImage} />
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
    backgroundColor: '#d3d3d3',  // Fundo cinza mais forte
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginRight: 1,
    marginLeft: -9,
    marginTop: 30,
    marginBottom: 5,
    borderRadius: 25,
    padding: 30,
  },
  categoryTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: -40,
    textAlign: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#b3b3b3',
    paddingBottom: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 5,
    padding: 11,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
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
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#999',
  },
  itemDiscountPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e60000',
  },
  itemInstallments: {
    fontSize: 12,
    color: '#999',
  },
  addButton: {
    backgroundColor: '#228B22', // Cor verde
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
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
    paddingBottom: 50,
  },
});

export default PeripheralsAccessoriesScreen;


