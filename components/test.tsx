import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Lấy chiều rộng màn hình
const itemWidth = 80; // Chiều rộng mỗi phần tử
const spacing = 10; // Khoảng cách giữa các phần tử
const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`); // Danh sách phần tử

const HorizontalScrollView = () => {
  const [activeIndex, setActiveIndex] = useState<any | null>(null);

  const handleScroll = (event : any ) => {
    const offsetX = event.nativeEvent.contentOffset.x; // Lấy vị trí cuộn ngang
    const centerX = width / 2; // Tâm của màn hình
    const middleIndex = Math.round((offsetX -170 +  centerX - itemWidth / 2) / (itemWidth + spacing)); // Xác định phần tử giữa

    if (middleIndex !== activeIndex) {
      setActiveIndex(middleIndex); // Cập nhật phần tử giữa
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {items.map((item, index) => (
          <View key={index} style={[styles.box, activeIndex === index && styles.activeBox]}>
            <Text style={styles.text}>{item}</Text>
          </View>
        ))}
      </ScrollView>
      <Text style={styles.centerText}>Phần tử giữa: {items[activeIndex] || 'None'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { paddingHorizontal: width / 2 - itemWidth / 2 }, // Canh giữa
  box: {
    width: itemWidth,
    height: 80,
    marginHorizontal: spacing / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    borderRadius: 10,
  },
  activeBox: { backgroundColor: 'blue' },
  text: { fontSize: 16, color: 'white' },
  centerText: { marginTop: 10, fontSize: 16 },
});

export default HorizontalScrollView;