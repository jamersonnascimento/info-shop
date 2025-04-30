import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../styles/theme';

const ProductCard = ({
  image,
  title,
  price,
  rating,
  onPress,
  onFavoritePress,
  isFavorite = false,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavoritePress}
        >
          <Icon
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={24}
            color={isFavorite ? theme.colors.error : theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>R$ {price.toFixed(2)}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color={theme.colors.warning} />
            <Text style={styles.rating}>{rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
    margin: theme.spacing.sm,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.round,
    padding: theme.spacing.xs,
    ...theme.shadows.small,
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
});

export default ProductCard; 