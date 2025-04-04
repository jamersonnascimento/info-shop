import React, { useContext } from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../components/BottomNavigation';
import { CartContext } from '../context/CartContext';

// HardwareProductsScreen component displays a list of hardware products
const HardwareProductsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { categoryName } = route.params;
  const { addToCart } = useContext(CartContext);
  const products = [
    { id: '1', name: 'Placa Mãe Asus PRIME B550M-A', price: 'R$ 700,00', discountPrice: 'R$ 650,00', installments: 'R$ 108,33 em até 6x', image: 'https://www.dropbox.com/scl/fi/mcr3x3p0oqregwqkivg66/61T-vIM-N5L._AC_SX679_.jpg?rlkey=k3znonpogfjg8qr4q75aryuu0&st=bwwkyymj&dl=1', }, 
    { id: '2', name: 'Processador AMD Ryzen 9', price: 'R$ 3.500,00', discountPrice: 'R$ 3.200,00', installments: 'R$ 533,33 em até 6x', image: 'https://www.dropbox.com/scl/fi/6nfzg5b0oox2qwqfrhs5q/5116zdA9uyL.__AC_SX300_SY300_QL70_ML2_.jpg?rlkey=p8bswckj3z2sv0b7vz5wczegi&st=rd41i1rj&dl=1', }, 
    { id: '3', name: 'Memória RAM Corsair DDR4 16GB', price: 'R$ 400,00', discountPrice: 'R$ 350,00', installments: 'R$ 58,33 em até 6x', image: 'https://www.dropbox.com/scl/fi/iv6kas0h4qidpfi5d1lg6/51n6iSdBaRL._AC_SY879_.jpg?rlkey=3bt0d7byanidzgukmm5zpv53s&st=7jd2u425&dl=1', }, 
    { id: '4', name: 'Placa de Vídeo NVIDIA RTX 3080', price: 'R$ 8.000,00', discountPrice: 'R$ 7.500,00', installments: 'R$ 1.250,00 em até 6x', image: 'https://www.dropbox.com/scl/fi/nyecfeiq69hlwidco1314/EVGA-RTX-3080.jpg?rlkey=amm6bwv90jq85t6oq9jhl00yp&st=ubyjk0yv&dl=1', }, 
    { id: '5', name: 'SSD NVME M.2 Samsung 1TB', price: 'R$ 1.000,00', discountPrice: 'R$ 950,00', installments: 'R$ 158,33 em até 6x', image: 'https://www.dropbox.com/scl/fi/izs62u8l5mhg6gqgfreq9/SSD-Samsung-1TB.jpg?rlkey=9oqjomuq3imi9wd129ql6ftz1&st=mo6si0mq&dl=1', }, 
    { id: '6', name: 'Fonte Corsair 750W', price: 'R$ 650,00', discountPrice: 'R$ 600,00', installments: 'R$ 100,00 em até 6x', image: 'https://www.dropbox.com/scl/fi/rjwbgfbvhpi86dwr267a8/Fonte-Corsair-750w.jpg?rlkey=mabcsdcd3fkgc0k4wcvmmb3ow&st=cj43sf7d&dl=1', }, 
    { id: '7', name: 'Gabinete NZXT H510', price: 'R$ 600,00', discountPrice: 'R$ 550,00', installments: 'R$ 91,67 em até 6x', image: 'https://www.dropbox.com/scl/fi/uyz5udp72q1welcmcz9rk/Gabinete-NZXT-H510.jpg?rlkey=o4p2v9y522v8ba6q7hmhiwzq7&st=mh7eu3sn&dl=1', }, 
    { id: '8', name: 'Cooler Master Hyper 212', price: 'R$ 250,00', discountPrice: 'R$ 230,00', installments: 'R$ 38,33 em até 6x', image: 'https://www.dropbox.com/scl/fi/pn4wg31fkce21ll410npg/Cooler-Master-Hyper-212.jpg?rlkey=w8rzc1i7c83deba04ns1tgnrr&st=cffp4e6n&dl=1', },
    { id: '9', name: 'HD Seagate 2TB', price: 'R$ 450,00', discountPrice: 'R$ 400,00', installments: 'R$ 66,67 em até 6x', image: 'https://www.dropbox.com/scl/fi/66khds2ew1wahv96lsoc0/HD-SEagate-2TB.jpg?rlkey=r9gzqpqg9rily9d8zr8ny2wml&st=lw0avhcp&dl=1', },
    { id: '10', name: 'Placa de Som Sound BlasterX', price: 'R$ 300,00', discountPrice: 'R$ 280,00', installments: 'R$ 46,67 em até 6x', image: 'https://www.dropbox.com/scl/fi/e4bl9fk2gamu40jsfwo47/Placa-de-Som-Sound-BlasterX.jpg?rlkey=on5x2x5tdq7y45w02gqdkpanr&st=5y9btnkn&dl=1', }, 
    { id: '11', name: 'Placa de Rede Intel Gigabit', price: 'R$ 150,00', discountPrice: 'R$ 130,00', installments: 'R$ 21,67 em até 6x', image: 'https://www.dropbox.com/scl/fi/s2399k9gusfrzhsr25t2c/Placa-de-rede-Intel-Gigabit.jpg?rlkey=h85f13k69l5swm20riaj0jlnl&st=qn00w3ec&dl=1', }, 
    { id: '12', name: 'Placa de Captura Elgato HD60S', price: 'R$ 1.200,00', discountPrice: 'R$ 1.100,00', installments: 'R$ 183,33 em até 6x', image: 'https://www.dropbox.com/scl/fi/hhdb46njjx2yp3t1jp31w/Placa-de-captura-Elgato-HD60S.jpg?rlkey=0f2hyb1zdva9mddux16owulzo&st=4uo836wi&dl=1', },
    { id: '13', name: 'Drive de DVD ASUS', price: 'R$ 150,00', discountPrice: 'R$ 140,00', installments: 'R$ 23,33 em até 6x', image: 'https://www.dropbox.com/scl/fi/dwl6woldwqk00et12x839/Drive-de-DVD-ASUS.jpg?rlkey=dxbrupz7lwc8t2s8wv21jujl2&st=k4wd9g4t&dl=1', }, 
    { id: '14', name: 'Ventoinha Corsair LED', price: 'R$ 100,00', discountPrice: 'R$ 90,00', installments: 'R$ 15,00 em até 6x', image: 'https://www.dropbox.com/scl/fi/ikehzmfpqokz0auwar23i/Ventoinha-Corsair-LED.jpg?rlkey=2a84ckagz9alagqd4m9pmo2wr&st=zyqka9sc&dl=1', }, 
    { id: '15', name: 'Cartão de Memória Sandisk 128GB', price: 'R$ 200,00', discountPrice: 'R$ 180,00', installments: 'R$ 30,00 em até 6x', image: 'https://www.dropbox.com/scl/fi/2yutle2qc007mraf4yicr/Cart-o-de-mem-ria-SanDisk-128gb.jpg?rlkey=opuo557qr6ylemvhxk98z6okf&st=xsazlczb&dl=1', }, 
    { id: '16', name: 'Monitor LG UltraGear 27"', price: 'R$ 2.500,00', discountPrice: 'R$ 2.300,00', installments: 'R$ 383,33 em até 6x', image: 'https://www.dropbox.com/scl/fi/aqh7r99r7oscqjt9s7jsz/Monitor-LG-UltraGear-27p.jpg?rlkey=nx49ykf1ghg74f5yf645w6jd8&st=1fed3o25&dl=1', }, 
    { id: '17', name: 'Mousepad Gamer SteelSeries', price: 'R$ 150,00', discountPrice: 'R$ 130,00', installments: 'R$ 21,67 em até 6x', image: 'https://www.dropbox.com/scl/fi/v4t0d22nlp43e1f3xqs1c/Mouse-pad-Gamer-Steel-Series.jpg?rlkey=1ezp1ph2f7l51jf7f7k16jkg4&st=2paob49a&dl=1', }, 
    { id: '18', name: 'Webcam Logitech C920', price: 'R$ 500,00', discountPrice: 'R$ 450,00', installments: 'R$ 75,00 em até 6x', image: 'https://www.dropbox.com/scl/fi/bqird1fyklzpmxpfzpulf/Webcam-Logitech-C920.jpg?rlkey=22wlr2mpl86e243x4ri0if5ig&st=oyw2e1wc&dl=1', }, 
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
            <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode='contain' />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>De {item.price}</Text>
              <Text style={styles.itemDiscountPrice}>{item.discountPrice} no PIX</Text>
              <Text style={styles.itemInstallments}>{item.installments}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {addToCart(item); handlePurchase()}}
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
    backgroundColor: '#f0f0f0',
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginRight: 5,
    marginLeft: 0,
    marginTop: 30,
    marginBottom: 0,
    borderRadius: 25,
    padding: 30,
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: -40,
    textAlign: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#b3b3b3',
    paddingBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 15,
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
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
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#999',
    marginBottom: 2,
  },
  itemDiscountPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e60000',
    marginBottom: 2,
  },
  itemInstallments: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#228B22', // Green color
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    paddingBottom: 80, // Increased to give space to BottomNavigation
  },
});

export default HardwareProductsScreen;













      
