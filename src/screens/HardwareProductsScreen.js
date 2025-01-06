import React, { useContext } from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../components/BottomNavigation';
import { CartContext } from '../context/CartContext';

const HardwareProductsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { categoryName } = route.params;
  const { addToCart } = useContext(CartContext);
  const products = [
    { id: '1', name: 'Placa-Mãe ASUS Prime', price: 'R$ 700,00', discountPrice: 'R$ 650,00', installments: 'R$ 108,33 em até 6x', image: 'https://via.placeholder.com/150', }, 
    { id: '2', name: 'Processador AMD Ryzen 9', price: 'R$ 3.500,00', discountPrice: 'R$ 3.200,00', installments: 'R$ 533,33 em até 6x', image: 'https://via.placeholder.com/150', }, 
    { id: '3', name: 'Memória RAM Corsair 16GB', price: 'R$ 400,00', discountPrice: 'R$ 350,00', installments: 'R$ 58,33 em até 6x', image: 'https://via.placeholder.com/150', }, 
    { id: '4', name: 'Placa de Vídeo NVIDIA RTX 3080', price: 'R$ 8.000,00', discountPrice: 'R$ 7.500,00', installments: 'R$ 1.250,00 em até 6x', image: 'https://via.placeholder.com/150', }, 
    { id: '5', name: 'SSD Samsung 1TB', price: 'R$ 1.000,00', discountPrice: 'R$ 950,00', installments: 'R$ 158,33 em até 6x', image: 'https://via.placeholder.com/150', }, 
    { id: '6', name: 'Fonte Corsair 750W', price: 'R$ 650,00', discountPrice: 'R$ 600,00', installments: 'R$ 100,00 em até 6x', image: 'https://via.placeholder.com/150', }, 
    { id: '7', name: 'Gabinete NZXT H510', price: 'R$ 600,00', discountPrice: 'R$ 550,00', installments: 'R$ 91,67 em até 6x', image: 'https://via.placeholder.com/150', }, { id: '8', name: 'Cooler Master Hyper 212', price: 'R$ 250,00', discountPrice: 'R$ 230,00', installments: 'R$ 38,33 em até 6x', image: 'https://via.placeholder.com/150', },
    { id: '9', name: 'HD Seagate 2TB', price: 'R$ 450,00', discountPrice: 'R$ 400,00', installments: 'R$ 66,67 em até 6x', image: 'https://via.placeholder.com/150', },
    { id: '10', name: 'Placa de Som Sound BlasterX', price: 'R$ 300,00', discountPrice: 'R$ 280,00', installments: 'R$ 46,67 em até 6x', image: 'https://via.placeholder.com/150', }, 
    { id: '11', name: 'Placa de Rede Intel Gigabit', price: 'R$ 150,00', discountPrice: 'R$ 130,00', installments: 'R$ 21,67 em até 6x', image: 'https://via.placeholder.com/150', }, 
    { id: '12', name: 'Placa de Captura Elgato HD60S', price: 'R$ 1.200,00', discountPrice: 'R$ 1.100,00', installments: 'R$ 183,33 em até 6x', image: 'https://via.placeholder.com/150', },
    { id: '13', name: 'Drive de DVD ASUS', price: 'R$ 150,00', discountPrice: 'R$ 140,00', installments: 'R$ 23,33 em até 6x', image: 'https://via.placeholder.com/150', }, 
    { id: '14', name: 'Ventoinha Corsair LED', price: 'R$ 100,00', discountPrice: 'R$ 90,00', installments: 'R$ 15,00 em até 6x', image: 'https://via.placeholder.com/150', }, 
    { id: '15', name: 'Cartão de Memória Sandisk 128GB', price: 'R$ 200,00', discountPrice: 'R$ 180,00', installments: 'R$ 30,00 em até 6x', image: 'https://via.placeholder.com/150', }, 
    { id: '16', name: 'Monitor LG UltraGear 27"', price: 'R$ 2.500,00', discountPrice: 'R$ 2.300,00', installments: 'R$ 383,33 em até 6x', image: 'https://via.placeholder.com/150', }, 
    { id: '17', name: 'Mousepad Gamer SteelSeries', price: 'R$ 150,00', discountPrice: 'R$ 130,00', installments: 'R$ 21,67 em até 6x', image: 'https://via.placeholder.com/150', }, 
    { id: '18', name: 'Webcam Logitech C920', price: 'R$ 500,00', discountPrice: 'R$ 450,00', installments: 'R$ 75,00 em até 6x', image: 'https://via.placeholder.com/150', }, 
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
    backgroundColor: '#f0f0f0',
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
    marginBottom: 0,
    borderRadius: 25,
    padding: 30,
  },
  categoryTitle: {
    fontSize: 28,
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

export default HardwareProductsScreen;













      
