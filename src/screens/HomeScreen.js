import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import SearchBar from '../components/SearchBar';
import BottomNavigation from '../components/BottomNavigation';
import { CartContext } from '../context/CartContext';

const HomeScreen = ({ navigation }) => {
  const { addToCart } = useContext(CartContext);
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([
    { id: '1', name: 'Headset Gamer HyperX Cloud III Wireless', price: 'R$ 999,99', discountPrice: 'R$ 699,99', installments: 'R$ 823,52 em até 12x', image: 'https://via.placeholder.com/150', category: 'Produtos para Gamers' },
    { id: '2', name: 'PC Gamer Pichau Far Cry', price: 'R$ 7.066,80', discountPrice: 'R$ 5.490,30', installments: 'R$ 6.459,18 em até 12x', image: 'https://via.placeholder.com/150', category: 'PCs Desktop e Gamer' },
    { id: '3', name: 'PC Gamer Pichau Hefesto IV', price: 'R$ 5.205,19', discountPrice: 'R$ 3.349,90', installments: 'R$ 3.941,16 em até 12x', image: 'https://via.placeholder.com/150', category: 'PCs Desktop e Gamer' },
    { id: '4', name: 'Mouse Gamer Redragon King Pro 4K', price: 'R$ 422,52', discountPrice: 'R$ 299,90', installments: 'R$ 351,16 em até 12x', image: 'https://via.placeholder.com/150', category: 'Produtos para Gamers' },
    { id: '5', name: 'Teclado Mecânico Redragon Kumara', price: 'R$ 299,99', discountPrice: 'R$ 199,99', installments: 'R$ 234,99 em até 12x', image: 'https://via.placeholder.com/150', category: 'Produtos para Gamers' },
    { id: '6', name: 'Monitor Gamer AOC 24G2', price: 'R$ 1.299,99', discountPrice: 'R$ 899,99', installments: 'R$ 1.053,99 em até 12x', image: 'https://via.placeholder.com/150', category: 'Monitores' },
    { id: '7', name: 'Cadeira Gamer DXRacer', price: 'R$ 2.499,99', discountPrice: 'R$ 1.999,99', installments: 'R$ 2.339,99 em até 12x', image: 'https://via.placeholder.com/150', category: 'Cadeiras e Mesas Gamer e Escritório' },
    { id: '8', name: 'Webcam Logitech C920', price: 'R$ 499,99', discountPrice: 'R$ 399,99', installments: 'R$ 467,99 em até 12x', image: 'https://via.placeholder.com/150', category: 'Câmeras e Acessórios' },
    { id: '9', name: 'Notebook Gamer Acer Nitro 5', price: 'R$ 4.999,99', discountPrice: 'R$ 3.999,99', installments: 'R$ 4.679,99 em até 12x', image: 'https://via.placeholder.com/150', category: 'Notebooks e Portáteis' },
    { id: '10', name: 'Placa de Vídeo RTX 3070', price: 'R$ 5.999,99', discountPrice: 'R$ 4.799,99', installments: 'R$ 5.623,99 em até 12x', image: 'https://via.placeholder.com/150', category: 'Placas de Vídeo' },
  ]);

  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    if (searchText === '') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(product =>
          product.name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText, products]);

  const handleAddToCart = (product) => {
    addToCart(product);
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/Logo_JamesWebb_Info.png')} style={styles.logo} />
        <SearchBar value={searchText} onChangeText={setSearchText} />
      </View>
      <Text style={styles.title}>Ofertas em Destaques!</Text>
      <View style={styles.scrollContainer}>
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleAddToCart(item)}>
              <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>De {item.price}</Text>
                  <Text style={styles.itemDiscountPrice}>{item.discountPrice} no PIX</Text>
                  <Text style={styles.itemInstallments}>{item.installments}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={styles.noResults}>Nenhum produto encontrado.</Text>}
          contentContainerStyle={styles.contentContainer}
        />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginRight: 1,
    marginLeft: 0,
    marginTop: 30,
    borderRadius: 25,
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
    padding: 6,
    marginBottom: 20,
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
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#999',
  },
  contentContainer: {
    paddingBottom: 35,
  },
});

export default HomeScreen;




















