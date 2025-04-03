import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import ProductItem from '../components/ProductItem';
import EmptyFavoritesMessage from '../components/EmptyFavoritesMessage';
import BottomNavigation from '../components/BottomNavigation';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [favorites, setFavorites] = useState([]); // Inicialmente vazio

  const handleLogoPress = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogoPress}>
          <Image
            source={require('../assets/images/Logo_JamesWebb_Info.png')}
            style={styles.logo}
          />
        </TouchableOpacity>
        <SearchBar value={searchText} onChangeText={setSearchText} />
      </View>

      {/* Lista de Favoritos */}
      {favorites.length === 0 ? (
        <EmptyFavoritesMessage />
      ) : (
        <View style={styles.scrollContainer}>
          <FlatList
            data={favorites}
            renderItem={({ item }) => <ProductItem item={item} />}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.flatListContent} // Adiciona espaçamento interno
          />
        </View>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0, // Mantém o padding 0 para o BottomNavigation ficar alinhado
    backgroundColor: '#F6ECDA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 2, // Adiciona espaçamento lateral para o header
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
  scrollContainer: {
    flex: 1,
    marginHorizontal: 16, // Adiciona margem lateral para o scrollContainer
  },
  flatListContent: {
    paddingVertical: 16, // Adiciona espaçamento interno vertical
  },
});

export default FavoritesScreen;


