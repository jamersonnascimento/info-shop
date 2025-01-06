import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const BottomNavigation = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.navigationContainer}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
        <Icon name="home" size={24} color="white" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Categories')}>
        <Icon name="th-list" size={24} color="white" />
        <Text style={styles.navText}>Categorias</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Favorites')}>
        <Icon name="heart" size={24} color="white" />
        <Text style={styles.navText}>Favoritos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Cart')}>
        <Icon name="shopping-cart" size={24} color="white" />
        <Text style={styles.navText}>Carrinho</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
        <Icon name="user" size={24} color="white" />
        <Text style={styles.navText}>Minha Conta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 5, // Adicionado para espaçamento interno
    position: 'absolute',
    bottom: 0,
    width: '100%',
    elevation: 8, // Somente para Android (efeito de elevação)
    zIndex: 1, // Garante que o BottomNavigation fique acima de outros elementos
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5, // Espaçamento entre o ícone e o texto
  },
});

export default BottomNavigation;



