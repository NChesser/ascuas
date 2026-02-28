import React from 'react';
import { View, type ViewProps, type ViewStyle, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../theme/colors';

type CardVariant = 'base' | 'soft' | 'elevated' | 'outline';

interface CardProps extends ViewProps {
  variant?: CardVariant;
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, ViewStyle> = {
  base: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.amber200,
  },
  soft: {
    backgroundColor: Colors.amber50,
    borderWidth: 1,
    borderColor: Colors.amber200,
  },
  elevated: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.amber200,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.amber200,
  },
};

const Card: React.FC<CardProps> = ({
  variant = 'base',
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={[styles.base, variantStyles[variant], style]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius['2xl'],
    padding: Spacing['2xl'],
  },
});

export default Card;
