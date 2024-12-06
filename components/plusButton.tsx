// components/FAB.js
import React, { forwardRef } from 'react';
import { Text, TouchableOpacity,TouchableOpacityProps, Animated, Easing, StyleSheet } from 'react-native';
export  const PlusButton = forwardRef<TouchableOpacity,TouchableOpacityProps>  (
  ({ onPress, ...otherProps }, ref) => {
  const scaleValue = new Animated.Value(1); // Giá trị ban đầu

  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.9, // Thu nhỏ nút khi nhấn
      duration: 100,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1, // Phục hồi kích thước khi nhả
      duration: 100,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
   
  };

  return (
    <Animated.View style={[styles.fab, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity
      ref={ref}
      onPress={onPress} 
        activeOpacity={0.7}
        {...otherProps}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'black',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10, // Hiệu ứng đổ bóng cho Android
    shadowColor: '#000', // Hiệu ứng đổ bóng cho iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 100000000,
  },
  fabText: {
    fontSize: 33,
    color: '#fff',
  },
});

