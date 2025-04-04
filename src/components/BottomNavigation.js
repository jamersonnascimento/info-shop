import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

// BottomNavigation component provides a navigation bar at the bottom of the screen
const BottomNavigation = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.navigationContainer}>
      {/* Navigation button for Home */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
        <Icon name="home" size={24} color="white" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      {/* Navigation button for Categories */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Categories')}>
        <Icon name="th-list" size={24} color="white" />
        <Text style={styles.navText}>Categorias</Text>
      </TouchableOpacity>
      {/* Navigation button for Favorites */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Favorites')}>
        <Icon name="heart" size={24} color="white" />
        <Text style={styles.navText}>Favoritos</Text>
      </TouchableOpacity>
      {/* Navigation button for Cart */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Cart')}>
        <Icon name="shopping-cart" size={24} color="white" />
        <Text style={styles.navText}>Carrinho</Text>
      </TouchableOpacity>
      {/* Navigation button for Account */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
        <Icon name="user" size={24} color="white" />
        <Text style={styles.navText}>Minha Conta</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles for the BottomNavigation component
const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 100,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  navText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

export default BottomNavigation;



