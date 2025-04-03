import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import ProductItem from '../components/ProductItem';
import BottomNavigation from '../components/BottomNavigation';
import api from '../services/api';

const ProductsScreen = ({ route }) => {
  const { categoryName, categoryId } = route.params;
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/categories/${categoryId}/products`);
      const productsData = response.data.products.map(product => ({
        id: product.id_produto.toString(),
        name: product.nome,
        description: product.descricao,
        price: `R$ ${parseFloat(product.preco).toFixed(2).replace('.', ',')}`,
        discountPrice: `R$ ${(parseFloat(product.preco) * 0.9).toFixed(2).replace('.', ',')}`,
        installments: `R$ ${(parseFloat(product.preco) * 1.1).toFixed(2).replace('.', ',')} em até 12x`,
        image: 'https://via.placeholder.com/150',
        estoque: product.estoque
      }));
      setProducts(productsData);
      setFilteredProducts(productsData);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/Logo_JamesWebb_Info.png')} style={styles.logo} />
        <SearchBar value={searchText} onChangeText={setSearchText} />
      </View>
      <Text style={styles.title}>{categoryName}</Text>
      <View style={styles.scrollContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="red" />
            <Text style={styles.loadingText}>Carregando produtos...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
                <ProductItem item={item} />
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            ListEmptyComponent={<Text style={styles.noResults}>Nenhum produto encontrado.</Text>}
          />
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProductsScreen;


