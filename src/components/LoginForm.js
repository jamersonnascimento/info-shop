import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// LoginForm component handles user login and registration
const LoginForm = ({ onLogin, onRegister, onForgotPassword, onCustomerService }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle user registration
  const handleRegister = async () => {
    try {
      const userData = { email, password };
      await AsyncStorage.setItem(email, JSON.stringify(userData));
      Alert.alert("Registrado com sucesso", "Você pode fazer login agora.");
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(error);
      Alert.alert("Erro ao registrar", "Tente novamente.");
    }
  };

  // Function to handle user login
  const handleLogin = async () => {
    try {
      const userData = await AsyncStorage.getItem(email);
      if (userData) {
        const { password: storedPassword } = JSON.parse(userData);
        if (storedPassword === password) {
          Alert.alert("Login bem-sucedido", "Bem-vindo de volta!");
          onLogin(email, password);
        } else {
          Alert.alert("Erro de login", "Credenciais incorretas.");
        }
      } else {
        Alert.alert("Erro de login", "Credenciais incorretas.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro ao fazer login", "Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo de volta!</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={handleRegister}>
        <Text style={styles.linkText}>Registrar-se</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={onForgotPassword}>
        <Text style={styles.linkText}>Esqueceu a senha?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={onCustomerService}>
        <Text style={styles.linkText}>Atendimento ao Cliente</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: 'red', // Color of the login button
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20, // Space between buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 10,
    alignItems: 'center',
  },
  linkText: {
    color: 'red', // Color of the links
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginForm;





