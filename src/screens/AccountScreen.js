import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import LoginForm from '../components/LoginForm';
import BottomNavigation from '../components/BottomNavigation';

// AccountScreen component provides the user interface for account management
const AccountScreen = ({ navigation }) => {
  const handleLogin = (email, password) => {
    // Implement login logic
  };

  const handleRegister = () => {
    // Implement navigation to the registration screen
  };

  const handleForgotPassword = () => {
    // Implement navigation to the password recovery screen
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

      {/* Login Form */}
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
    backgroundColor: '#F6ECDA', // Background color
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30, // Space between the logo and the form
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});

export default AccountScreen;





