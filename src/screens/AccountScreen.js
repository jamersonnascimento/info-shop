import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import LoginForm from '../components/LoginForm';
import BottomNavigation from '../components/BottomNavigation';

const AccountScreen = ({ navigation }) => {
  const handleLogin = (email, password) => {
    // Implementar lógica de login
  };

  const handleRegister = () => {
    // Implementar navegação para a tela de cadastro
  };

  const handleForgotPassword = () => {
    // Implementar navegação para a tela de recuperação de senha
  };

  const handleCustomerService = () => {
    navigation.navigate('CustomerService');
  };

  const handleLogoPress = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={handleLogoPress}>
          <Image
            source={require('../assets/images/Logo_JamesWebb_Info.png')}
            style={styles.logo}
          />
        </TouchableOpacity>
      </View>

      {/* Formulário de Login */}
      <LoginForm
        onLogin={handleLogin}
        onRegister={handleRegister}
        onForgotPassword={handleForgotPassword}
        onCustomerService={handleCustomerService}
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#ffffff', // Fundo branco
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30, // Mais espaço entre o logo e o formulário
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});

export default AccountScreen;





