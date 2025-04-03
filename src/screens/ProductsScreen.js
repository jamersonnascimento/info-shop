import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import ProductItem from '../components/ProductItem';
import BottomNavigation from '../components/BottomNavigation';
import api from '../services/api';
import { productsData, getProductsByCategory } from '../data/products';
import { getProductImage } from '../utils/productImageMapper';

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
      // Função para formatar preços
      const formatarPreco = (preco) => {
        if (preco === undefined || preco === null) {
          return {
            original: 'Preço indisponível',
            desconto: 'Preço indisponível',
            parcelas: 'Preço indisponível'
          };
        }
        
        // Converter para número se for string
        const precoNumerico = typeof preco === 'string' ? 
          parseFloat(preco.replace(',', '.')) : 
          Number(preco);
          
        if (isNaN(precoNumerico)) {
          return {
            original: 'Preço indisponível',
            desconto: 'Preço indisponível',
            parcelas: 'Preço indisponível'
          };
        }
        
        return {
          original: `R$ ${precoNumerico.toFixed(2).replace('.', ',')}`,
          desconto: `R$ ${(precoNumerico * 0.9).toFixed(2).replace('.', ',')}`,
          parcelas: `R$ ${(precoNumerico * 1.1).toFixed(2).replace('.', ',')} em até 12x`
        };
      };
      
      const response = await api.get(`/categories/${categoryId}/products`);
      const productsData = response.data.products.map(product => {
        const productId = product.id_produto.toString();
        // Formatar preços
        const precos = formatarPreco(product.preco);
        // Imagem padrão para produtos
        const defaultImage = 'https://via.placeholder.com/150?text=Produto+' + encodeURIComponent(product.nome || 'Sem+Nome');
        
        return {
          id: productId,
          name: product.nome || 'Produto sem nome',
          description: product.descricao || 'Sem descrição disponível',
          price: precos.original,
          discountPrice: precos.desconto,
          installments: precos.parcelas,
          image: defaultImage,
          imageUrl: defaultImage,
          estoque: product.estoque || 0
        };
      });
      setProducts(productsData);
      setFilteredProducts(productsData);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError('Não foi possível carregar os produtos da API. Usando dados locais.');
      
      // Usar os dados locais de produtos filtrados por categoria como fallback
      const localProducts = getProductsByCategory(categoryName) || productsData;
      setProducts(localProducts);
      setFilteredProducts(localProducts);
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
            contentContainerStyle={styles.flatListContent}
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
    padding: 0,
    backgroundColor: '#F6ECDA',
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
    marginRight: -12,
    marginLeft: -13,
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
    maxHeight: 567,
    backgroundColor: '#F6ECDA',
    marginHorizontal: 3,
    marginBottom: 60, // Adiciona margem inferior para evitar que o conteúdo fique atrás do BottomNavigation
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
  flatListContent: {
    paddingVertical: 10,
    paddingBottom: 50, // Garante espaço suficiente na parte inferior para não ficar atrás do BottomNavigation
    backgroundColor: '#F6ECDA', // Cor de fundo da FlatList
  },
});

export default ProductsScreen;


