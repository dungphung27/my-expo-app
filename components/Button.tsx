import React, { forwardRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle, StyleProp } from 'react-native';

type ButtonProps = {
  title?: string;
  backgroundColor?: string; // Cho phép tuỳ biến màu nền
  width?: number | string; // Tuỳ biến độ rộng
} & TouchableOpacityProps;

export const Button = forwardRef<TouchableOpacity, ButtonProps>(
  ({ title = 'Button', backgroundColor = '#38C400', width = '100%', onPress, ...otherProps }, ref) => {
    const buttonStyle: StyleProp<ViewStyle> = [
      styles.button,
      {
        backgroundColor: otherProps.disabled ? 'gray' : backgroundColor,
        width: width as ViewStyle['width'], // Ép kiểu width để đảm bảo TypeScript không báo lỗi
      },
    ];

    return (
      <TouchableOpacity ref={ref} style={buttonStyle} onPress={onPress} {...otherProps}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'auto',
  },
});