import React, { useContext } from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../components/BottomNavigation';
import { CartContext } from '../context/CartContext';

// PCsDesktopGamerScreen component displays a list of gaming PCs
const PCsDesktopGamerScreen = ({ route }) => {
  const navigation = useNavigation();
  const { categoryName } = route.params;
  const { addToCart } = useContext(CartContext);
  const products = [
    {
      id: '1',
      name: 'PC Gamer Pichau Far Cry',
      price: 'R$ 7.066,80',
      discountPrice: 'R$ 5.490,30',
      installments: 'R$ 6.459,18 em até 12x',
      image: 'https://www.dropbox.com/scl/fi/p72bs2py20ruh5mvknxos/pc-completo-pichau-far-cry-0034.jpg?rlkey=cnutw3l54525o9icxpit0cjnp&st=3reua7jw&dl=1',
    },
    {
      id: '2',
      name: 'PC Gamer Pichau Hefesto IV',
      price: 'R$ 5.205,19',
      discountPrice: 'R$ 3.349,90',
      installments: 'R$ 3.941,16 em até 12x',
      image: 'https://www.dropbox.com/scl/fi/73dmcl5n9vrevs3bhogew/PC-Gamer-Pichau-Hefesto-IV.jpg?rlkey=iaxjb2nwwdhte7uaeuwov2w8f&st=jgdd2ziq&dl=1',
    },
    {
      id: '3',
      name: 'Notebook Gamer Acer Nitro 5',
      price: 'R$ 4.999,99',
      discountPrice: 'R$ 3.999,99',
      installments: 'R$ 4.679,99 em até 12x',
      image: 'https://www.dropbox.com/scl/fi/5t7m5yra0dreg1vp4ao0l/Notebook-Gamer-ACer-Nitro-5.jpg?rlkey=zzta8dsflf35htewcp9cho8qa&st=d6h995rw&dl=1',
    },
  ];

  const handleLogoPress = () => {
    navigation.navigate('Home');
  };

  const handlePurchase = () => {
    // Alert for the addToCart button
    alert("Produto adicionado ao carrinho!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogoPress}>
          <Image source={require('../assets/images/Logo_JamesWebb_Info.png')} style={styles.logo} />
        </TouchableOpacity>
      </View>
      <Text style={styles.categoryTitle}>{categoryName}</Text>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>De {item.price}</Text>
              <Text style={styles.itemDiscountPrice}>{item.discountPrice} no PIX</Text>
              <Text style={styles.itemInstallments}>{item.installments}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {addToCart(item);handlePurchase()}}
              >
                <Text style={styles.addButtonText}>Adicionar ao Carrinho</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.noResults}>Nenhum produto encontrado.</Text>}
        contentContainerStyle={styles.contentContainer}
      />
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d3d3d3',  // Stronger gray background
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginRight: 1,
    marginLeft: -9,
    marginTop: 30,
    marginBottom: 0,
    borderRadius: 25,
    padding: 30,
  },
  categoryTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: -40,
    textAlign: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#b3b3b3',
    paddingBottom: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 10,
    padding: 11,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  itemImage: {
    width: 160,
    height: 160,
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
  addButton: {
    backgroundColor: '#228B22', // Green color
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#999',
  },
  contentContainer: {
    paddingBottom: 50,
  },
});

export default PCsDesktopGamerScreen;



