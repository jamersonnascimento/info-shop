import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, Image } from 'react-native';
import SearchBar from '../components/SearchBar';
import ProductItem from '../components/ProductItem';
import BottomNavigation from '../components/BottomNavigation';

const ProductsScreen = ({ route }) => {
  const { categoryName } = route.params;
  const [searchText, setSearchText] = useState('');
  const productsByCategory = {
    'Hardware': [
      { id: '1', name: 'Placa de Vídeo RTX 3070', price: 'R$ 5.999,99', discountPrice: 'R$ 4.799,99', installments: 'R$ 5.623,99 em até 12x', image: 'https://via.placeholder.com/150' },
      { id: '2', name: 'Processador Intel Core i9', price: 'R$ 2.499,99', discountPrice: 'R$ 1.999,99', installments: 'R$ 2.339,99 em até 12x', image: 'https://via.placeholder.com/150' },
      // Adicione mais produtos conforme necessário
    ],
    'Periféricos': [
      { id: '3', name: 'Mouse Gamer Redragon King Pro 4K', price: 'R$ 422,52', discountPrice: 'R$ 299,90', installments: 'R$ 351,16 em até 12x', image: 'https://via.placeholder.com/150' },
      { id: '4', name: 'Teclado Mecânico Redragon Kumara', price: 'R$ 299,99', discountPrice: 'R$ 199,99', installments: 'R$ 234,99 em até 12x', image: 'https://via.placeholder.com/150' },
      // Adicione mais produtos conforme necessário
    ],
    'Computadores': [
      { id: '5', name: 'PC Gamer Pichau Far Cry', price: 'R$ 7.066,80', discountPrice: 'R$ 5.490,30', installments: 'R$ 6.459,18 em até 12x', image: 'https://via.placeholder.com/150' },
      { id: '6', name: 'PC Gamer Pichau Hefesto IV', price: 'R$ 5.205,19', discountPrice: 'R$ 3.349,90', installments: 'R$ 3.941,16 em até 12x', image: 'https://via.placeholder.com/150' },
      // Adicione mais produtos conforme necessário
    ],
  };

  const [filteredProducts, setFilteredProducts] = useState(productsByCategory[categoryName] || []);

  useEffect(() => {
    if (searchText === '') {
      setFilteredProducts(productsByCategory[categoryName] || []);
    } else {
      setFilteredProducts(
        (productsByCategory[categoryName] || []).filter(product =>
          product.name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText, categoryName]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/Logo_JamesWebb_Info.png')} style={styles.logo} />
        <SearchBar value={searchText} onChangeText={setSearchText} />
      </View>
      <Text style={styles.title}>{categoryName}</Text>
      <View style={styles.scrollContainer}>
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => <ProductItem item={item} />}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={styles.noResults}>Nenhum produto encontrado.</Text>}
        />
      </View>
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginRight: 1,
    marginLeft: -20,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  scrollContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    overflow: 'hidden',
    maxHeight: 645,
    backgroundColor: 'white',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#999',
  },
});

export default ProductsScreen;


