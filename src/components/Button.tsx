import React from 'react';
import {
  TouchableOpacity,
  Text,
  type ViewStyle,
  type TextStyle,
  StyleSheet,
  type TouchableOpacityProps,
} from 'react-native';
import { Colors, Radius, Spacing } from '../theme/colors';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'cancel'
  | 'danger'
  | 'danger-outline'
  | 'ghost'
  | 'text'
  | 'success'
  | 'save'
  | 'icon';

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantContainer: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: Colors.amber500,
    borderWidth: 1,
    borderColor: Colors.amber500,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.amber200,
  },
  cancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.amber200,
  },
  danger: {
    backgroundColor: Colors.red500,
  },
  'danger-outline': {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  text: {
    backgroundColor: 'transparent',
  },
  success: {
    backgroundColor: Colors.green500,
  },
  save: {
    backgroundColor: Colors.amber500,
    borderWidth: 1,
    borderColor: Colors.amber500,
  },
  icon: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.amber200,
    borderRadius: Radius.full,
  },
};

const variantText: Record<ButtonVariant, TextStyle> = {
  primary: { color: Colors.amber50 },
  secondary: { color: Colors.amber700 },
  cancel: { color: Colors.amber700 },
  danger: { color: Colors.white },
  'danger-outline': { color: Colors.red500 },
  ghost: { color: Colors.amber600 },
  text: { color: Colors.amber600 },
  success: { color: Colors.white },
  save: { color: Colors.amber50 },
  icon: { color: Colors.amber600 },
};

const sizeContainer: Record<ButtonSize, ViewStyle> = {
  sm: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  md: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  lg: { paddingVertical: Spacing.md, width: '100%' as unknown as number },
  xl: { padding: Spacing.md },
};

const sizeText: Record<ButtonSize, TextStyle> = {
  sm: { fontSize: 12, fontWeight: '600' },
  md: { fontSize: 14 },
  lg: { fontSize: 15 },
  xl: { fontSize: 17 },
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  style,
  disabled,
  ...props
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      style={[
        styles.base,
        variantContainer[variant],
        sizeContainer[size],
        disabled && styles.disabled,
        style as ViewStyle,
      ]}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          style={[
            styles.text,
            variantText[variant],
            sizeText[size],
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Radius.sm,
  },
  text: {
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
