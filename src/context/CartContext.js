import React, { createContext, useState } from 'react';

// Criação do contexto do carrinho
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Função para adicionar item ao carrinho
  const addToCart = (item) => {
    // Verifica se o item já existe no carrinho
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex !== -1) {
      // Se o item já existe, apenas atualiza a quantidade
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += (item.quantity || 1);
      setCartItems(updatedCartItems);
    } else {
      // Se o item não existe, adiciona ao carrinho
      // Garante que a quantidade seja pelo menos 1
      const quantity = item.quantity || 1;
      setCartItems([...cartItems, { ...item, quantity }]);
    }
  };

  // Função para remover item do carrinho
  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  // Função para atualizar a quantidade de um item no carrinho
  const updateQuantity = (itemId, quantity) => {
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  // Função para limpar o carrinho
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};







