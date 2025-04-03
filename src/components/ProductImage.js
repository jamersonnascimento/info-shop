/*
Este componente React Native gerencia a exibição de imagens de produtos com recursos avançados como: 
carregamento de imagens locais ou remotas, fallback para URLs alternativas quando a imagem principal falha, 
indicador de carregamento e suporte para diferentes modos de redimensionamento. Ele usa as funções do productImageMapper 
para buscar imagens locais com base no ID do produto.
*/
import React, { useState, useMemo } from 'react';
import { Image, StyleSheet, View, ActivityIndicator } from 'react-native';
import { getProductImage, hasLocalImage } from '../utils/productImageMapper';

/**
 * Componente para exibir imagens de produtos com fallback e indicador de carregamento
 * @param {Object} props - Propriedades do componente
 * @param {string|Object} props.source - URL da imagem ou referência require para imagem local
 * @param {string} [props.fallbackUrl] - URL de fallback caso a imagem principal falhe
 * @param {Object} [props.style] - Estilos adicionais para a imagem
 * @param {string} [props.resizeMode] - Modo de redimensionamento da imagem (contain, cover, stretch, etc)
 * @param {string} [props.productId] - ID do produto para buscar imagem local do mapeamento
 */
const ProductImage = ({ source, fallbackUrl, style, resizeMode = 'contain', productId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Imagem padrão caso todas as outras falhem
  const defaultImage = 'https://via.placeholder.com/400x400?text=Produto+Sem+Imagem';
  
  // Determina a fonte da imagem baseada nos parâmetros e estado usando useMemo para evitar recálculos desnecessários
  const imageSource = useMemo(() => {
    // Prioridade 1: Imagem local mapeada pelo ID do produto
    if (productId && !hasError && hasLocalImage(productId)) {
      return getProductImage(productId);
    }
    
    // Prioridade 2: Fonte principal (se não houver erro)
    if (!hasError) {
      if (typeof source === 'string') {
        return { uri: source };
      } else if (source) {
        return source;
      } else if (fallbackUrl) {
        return { uri: fallbackUrl };
      }
      return { uri: defaultImage };
    }
    
    // Prioridade 3: Fallback ou imagem padrão (se houver erro)
    return fallbackUrl ? { uri: fallbackUrl } : { uri: defaultImage };
  }, [productId, source, fallbackUrl, hasError]);

  // Handlers para eventos de imagem
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <View style={[styles.container, style]}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      )}
      
      <Image
        source={imageSource}
        style={[styles.image, style]}
        resizeMode={resizeMode}
        onLoadStart={() => setIsLoading(true)}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1,
  },
});

export default ProductImage;