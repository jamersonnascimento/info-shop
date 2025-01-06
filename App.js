import 'react-native-gesture-handler';
import * as React from 'react';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return (
    <CartProvider>
      <AppNavigator />
    </CartProvider>
  );
}

export default App;





