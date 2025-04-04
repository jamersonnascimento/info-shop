import 'react-native-gesture-handler';
import * as React from 'react';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';

// App component serves as the entry point of the application
function App() {
  return (
    // CartProvider provides cart context to the entire app
    <CartProvider>
      {/* AppNavigator handles navigation throughout the app */}
      <AppNavigator />
    </CartProvider>
  );
}

export default App;





