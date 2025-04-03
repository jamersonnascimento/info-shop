import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CartScreen from '../screens/CartScreen';
import AccountScreen from '../screens/AccountScreen';
import HardwareProductsScreen from '../screens/HardwareProductsScreen'; 
import PeripheralsAccessoriesScreen from '../screens/PeripheralsAccessoriesScreen';
import PCsDesktopGamerScreen from '../screens/PCsDesktopGamerScreen'; 
import OrderSummaryScreen from '../screens/OrderSummaryScreen';
import CustomerServiceScreen from '../screens/CustomerServiceScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="HardwareProducts" component={HardwareProductsScreen} /> 
        <Stack.Screen name="PeripheralsAccessories" component={PeripheralsAccessoriesScreen} /> 
        <Stack.Screen name="PCsDesktopGamer" component={PCsDesktopGamerScreen} /> 
        <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} /> 
        <Stack.Screen name="CustomerService" component={CustomerServiceScreen} /> 
        <Stack.Screen name="ProductsScreen" component={ProductsScreen} /> 
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;










