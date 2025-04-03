import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomNavigation from '../components/BottomNavigation';
import { CartContext } from '../context/CartContext';
import ProductImage from '../components/ProductImage';

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;
  const navigation = useNavigation();
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Adiciona o produto ao carrinho com a quantidade selecionada
    const productToAdd = {
      ...product,
      quantity: quantity
    };
    
    addToCart(productToAdd);
    
    // Exibe um alerta de confirmação
    Alert.alert(
      "Produto adicionado",
      `${product.name} foi adicionado ao seu carrinho!`,
      [
        { text: "Continuar comprando", style: "cancel" },
        { 
          text: "Ver carrinho", 
          onPress: () => navigation.navigate('Cart')
        }
      ]
    );
  };

  const increaseQuantity = () => {
    if (quantity < product.estoque) {
      setQuantity(quantity + 1);
    } else {
      Alert.alert("Limite de estoque", "Quantidade máxima disponível atingida.");
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Image 
          source={require('../assets/images/Logo_JamesWebb_Info.png')} 
          style={styles.logo} 
        />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.productImageContainer}>
          <ProductImage 
            source={product.image || product.imageUrl} 
            fallbackUrl={product.imageUrl} 
            style={styles.productImage} 
            resizeMode="contain"
            productId={product.id} // Adicionando o ID do produto para buscar imagem local
          />
        </View>

        <View style={styles.productInfoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>{product.price}</Text>
            <Text style={styles.discountPrice}>{product.discountPrice}</Text>
            <Text style={styles.discountLabel}>no PIX</Text>
          </View>
          
          <Text style={styles.installments}>{product.installments}</Text>
          
          <View style={styles.stockInfo}>
            <Icon name="check-circle" size={16} color="green" />
            <Text style={styles.stockText}>
              {product.estoque > 0 
                ? `Em estoque: ${product.estoque} unidades` 
                : "Produto indisponível"}
            </Text>
          </View>

          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantidade:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                onPress={decreaseQuantity} 
                style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                disabled={quantity <= 1}
              >
                <Icon name="minus" size={16} color={quantity <= 1 ? "#ccc" : "#333"} />
              </TouchableOpacity>
              
              <Text style={styles.quantityValue}>{quantity}</Text>
              
              <TouchableOpacity 
                onPress={increaseQuantity} 
                style={[styles.quantityButton, quantity >= product.estoque && styles.quantityButtonDisabled]}
                disabled={quantity >= product.estoque}
              >
                <Icon name="plus" size={16} color={quantity >= product.estoque ? "#ccc" : "#333"} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.buyButton, product.estoque <= 0 && styles.buyButtonDisabled]} 
            onPress={handleAddToCart}
            disabled={product.estoque <= 0}
          >
            <Icon name="shopping-cart" size={20} color="white" />
            <Text style={styles.buyButtonText}>COMPRAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 60, // Espaço para o BottomNavigation
  },
  productImageContainer: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfoContainer: {
    backgroundColor: 'white',
    marginTop: 10,
    padding: 16,
    borderRadius: 8,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 24,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#999',
    marginRight: 10,
  },
  discountPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    marginRight: 5,
  },
  discountLabel: {
    fontSize: 16,
    color: 'red',
  },
  installments: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stockText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  quantityButton: {
    padding: 8,
    width: 36,
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityValue: {
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyButton: {
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buyButtonDisabled: {
    backgroundColor: '#ccc',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProductDetailScreen;