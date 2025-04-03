import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import BottomNavigation from '../components/BottomNavigation';
import { CartContext } from '../context/CartContext';
import api from '../services/api';
import ProductImage from '../components/ProductImage';
import { productsData } from '../data/products';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { addToCart } = useContext(CartContext);
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar produtos da API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      
      // Transformar os dados da API para o formato esperado pelo app
      const formattedProducts = response.data.data.map(product => {
        // Formatar preços
        let precoFormatado = 'Preço indisponível';
        let precoDesconto = 'Preço indisponível';
        let precoParcelas = 'Preço indisponível';
        
        if (product.preco !== undefined && product.preco !== null) {
          // Converter para número se for string
          const precoNumerico = typeof product.preco === 'string' ? 
            parseFloat(product.preco.replace(',', '.')) : 
            Number(product.preco);
            
          if (!isNaN(precoNumerico)) {
            precoFormatado = `R$ ${precoNumerico.toFixed(2).replace('.', ',')}`;
            precoDesconto = `R$ ${(precoNumerico * 0.8).toFixed(2).replace('.', ',')}`;
            precoParcelas = `R$ ${(precoNumerico * 1.1).toFixed(2).replace('.', ',')} em até 12x`;
          }
        }
        
        // Imagem padrão para produtos
        const productImage = 'https://via.placeholder.com/500x500?text=Produto+' + encodeURIComponent(product.nome || 'Sem+Nome');
        const productId = product.id_produto.toString();
        
        return {
          id: productId,
          name: product.nome || 'Produto sem nome',
          price: precoFormatado,
          discountPrice: precoDesconto,
          installments: precoParcelas,
          image: productImage,
          imageUrl: productImage,
          category: product.categoria || 'Categoria Padrão',
          description: product.descricao || 'Sem descrição disponível',
          estoque: product.estoque || 0
        };
      });
      
      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
      // Usar os dados locais de produtos como fallback em caso de erro
      console.log('Usando dados locais de produtos como fallback');
      setProducts(productsData);
      setFilteredProducts(productsData);
    } finally {
      setLoading(false);
    }
  };

  // Carregar produtos quando o componente montar
  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/Logo_JamesWebb_Info.png')} style={styles.logo} />
        <SearchBar value={searchText} onChangeText={setSearchText} />
      </View>
      <Text style={styles.title}>Ofertas em Destaques!</Text>
      
      {/* Exibir mensagem de erro se houver */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.scrollContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.loadingText}>Carregando produtos...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleProductPress(item)}>
                <View style={styles.card}>
                  <ProductImage 
                    source={item.image || item.imageUrl} 
                    fallbackUrl={item.imageUrl} 
                    style={styles.itemImage} 
                  />
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
            onRefresh={fetchProducts}
            refreshing={loading}
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
    padding: 20,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;




















