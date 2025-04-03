import React, { createContext, useState, useCallback, useMemo } from 'react';

/**
 * Contexto para gerenciamento do carrinho de compras
 * Fornece funções para adicionar, remover, atualizar e limpar itens do carrinho
 */
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Estado para armazenar os itens do carrinho
  const [cartItems, setCartItems] = useState([]);

  /**
   * Adiciona um item ao carrinho ou atualiza sua quantidade se já existir
   * @param {Object} item - O produto a ser adicionado ao carrinho
   */
  const addToCart = useCallback((item) => {
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
      setCartItems(prevItems => [...prevItems, { ...item, quantity }]);
    }
  }, [cartItems]);

  /**
   * Remove um item do carrinho pelo ID
   * @param {string} itemId - ID do item a ser removido
   */
  const removeFromCart = useCallback((itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  /**
   * Atualiza a quantidade de um item no carrinho
   * @param {string} itemId - ID do item a ser atualizado
   * @param {number} quantity - Nova quantidade do item
   */
  const updateQuantity = useCallback((itemId, quantity) => {
    setCartItems(prevItems => prevItems.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  }, []);

  /**
   * Limpa todos os itens do carrinho
   */
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Calcula o total de itens no carrinho
  const itemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // Valor do contexto com todas as funções e estados necessários
  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, itemCount]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};







