import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import CategoryItem from '../components/CategoryItem';
import BottomNavigation from '../components/BottomNavigation';

const CategoriesScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [categories] = useState([
    { id: '1', name: 'Peças (Hardware)' },
    { id: '2', name: 'Periféricos e acessórios' },
    { id: '3', name: 'PCs Desktop e Gamer' },
    { id: '4', name: 'Laptops e Netbooks' },
    { id: '5', name: 'Tablets e E-readers' },
    { id: '6', name: 'Smartphones e Tablets' },
    { id: '7', name: 'TVs e Monitores' },
    { id: '8', name: 'Fones de ouvido e Headsets' },
    { id: '9', name: 'Câmeras e Webcams' },
    { id: '10', name: 'Impressoras e Escritórios' },
    { id: '11', name: 'Consoles e Jogos' },
    { id: '12', name: 'Ferramentas e Equipamentos' },
    { id: '13', name: 'Eletrodomésticos' },
    // Outras categorias...
  ]);

  const handleCategoryPress = (categoryName) => {
    if (categoryName === 'Peças (Hardware)') {
      navigation.navigate('HardwareProducts', { categoryName });
    } else if (categoryName === 'Periféricos e acessórios') {
      navigation.navigate('PeripheralsAccessories', { categoryName });
    } else if (categoryName === 'PCs Desktop e Gamer') {
      navigation.navigate('PCsDesktopGamer', { categoryName });
    }
    // Adicione navegação para outras categorias conforme necessário
  };

  const handleLogoPress = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogoPress}>
          <Image source={require('../assets/images/Logo_JamesWebb_Info.png')} style={styles.logo} />
        </TouchableOpacity>
        <SearchBar value={searchText} onChangeText={setSearchText} />
      </View>
      <Text style={styles.title}>CATEGORIAS</Text>
      <View style={styles.scrollContainer}>
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCategoryPress(item.name)}>
              <CategoryItem item={item} />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.flatListContent}
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
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  scrollContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    overflow: 'hidden',
    maxHeight: 589,
    backgroundColor: 'white',
    marginHorizontal: 8,
  },
  flatListContent: {
    paddingVertical: 1,
  },
});

export default CategoriesScreen;












