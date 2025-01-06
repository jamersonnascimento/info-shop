import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomNavigation from '../components/BottomNavigation';

const CustomerServiceScreen = ({ navigation }) => {
  const handleChatSupport = () => {
    // Navegar para a tela de suporte via chat
  };

  const handlePhoneSupport = () => {
    // Ligar para o suporte
  };

  const handleEmailSupport = () => {
    // Enviar email para o suporte
  };

  const handleWhatsAppSupport = () => {
    const whatsappUrl = 'https://wa.me/5571983022222';
    Linking.openURL(whatsappUrl);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Imagem de Atendimento */}
        <Image
          source={{ uri: 'https://your-image-url.com/customer-service.png' }}
          style={styles.image}
        />

        {/* Título */}
        <Text style={styles.title}>Atendimento ao Cliente</Text>

        {/* Descrição */}
        <Text style={styles.description}>
          Estamos aqui para ajudar! Escolha uma das opções abaixo para entrar em contato conosco.
        </Text>

        {/* Botões de Atendimento */}
        <TouchableOpacity style={styles.button} onPress={handleChatSupport}>
          <Icon name="comments" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Suporte via Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handlePhoneSupport}>
          <Icon name="phone" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Suporte por Telefone</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleEmailSupport}>
          <Icon name="envelope" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Suporte por Email</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleWhatsAppSupport}>
          <Icon name="whatsapp" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Suporte por WhatsApp</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
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
  contentContainer: {
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default CustomerServiceScreen;

