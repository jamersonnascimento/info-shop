import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import theme from '../styles/theme';

const Button = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const baseStyle = {
      ...styles.button,
      ...styles[size],
    };

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: theme.colors.textSecondary,
      };
    }

    switch (variant) {
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary,
        };
    }
  };

  const getTextStyle = () => {
    const baseStyle = {
      ...styles.text,
      ...styles[`${size}Text`],
    };

    if (disabled) {
      return {
        ...baseStyle,
        color: theme.colors.background,
      };
    }

    if (variant === 'outline') {
      return {
        ...baseStyle,
        color: theme.colors.primary,
      };
    }

    return {
      ...baseStyle,
      color: theme.colors.background,
    };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.background} />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  small: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  medium: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  large: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  text: {
    fontFamily: theme.typography.fontFamily.medium,
  },
  smallText: {
    fontSize: theme.typography.fontSize.sm,
  },
  mediumText: {
    fontSize: theme.typography.fontSize.md,
  },
  largeText: {
    fontSize: theme.typography.fontSize.lg,
  },
});

export default Button; 