// components/FAB.js
import React, { forwardRef } from 'react';
import { Text, TouchableOpacity,TouchableOpacityProps, Animated, Easing, StyleSheet } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useScooter } from '~/providers/ScooterProvider';

export  const LocationButton = forwardRef<TouchableOpacity,TouchableOpacityProps>  (
  ({ onPress, ...otherProps }, ref) => {
  const scaleValue = new Animated.Value(1); // Giá trị ban đầu
  const {status,setStatus} = useScooter()
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
        {status != false && (<FontAwesome6 name="location-crosshairs" size={40} color="#fff" />)} 
        {status == false && (<AntDesign name="warning" size={40} color="#fff" />)} 
      </TouchableOpacity>
    </Animated.View>
  );
}
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 50, // Cách đáy màn hình 50px
    left: "43%", // Đặt ở giữa màn hình theo chiều ngang
    backgroundColor: 'black',
    opacity: 0.75,
    width: 80,
    height: 80,
    borderRadius: 40,
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

