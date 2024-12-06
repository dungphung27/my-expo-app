import React, { useEffect } from 'react';
import { useScooter } from '~/providers/ScooterProvider';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';

const DropdownWithAnimation = () => {
  const {isVisible,setIsVisible,setSavePlace,addSafeMode,addMode,setAddMode} = useScooter()
  useEffect(()=>{
    if(addMode || addSafeMode)
    {
        setIsVisible(false)
    }
  },[addMode])
  return (
    <>
    {!addMode && !addSafeMode && (
        <>
      {/* Hộp menu khi nhấn "+" */}
      {isVisible  && (
        <Modal transparent={true} animationType="fade" >
          {/* Bấm ra ngoài để đóng */}
          <TouchableWithoutFeedback onPress={()=> setIsVisible(false)}>
            <View style={styles.overlay}>
              {/* Hộp menu hiển thị ngay bên dưới nút cộng */}
              <View style={styles.dropdown} >
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() =>{
                    setSavePlace(false)
                    setAddMode(true)
                  } }>
                  <Text style={styles.menuText}>Add Safe Place</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => alert('New Chat')}>
                  <Text style={styles.menuText}>💬 New Chat</Text>
                </TouchableOpacity>
                 */}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  )}
  </>
  );
};

const styles = StyleSheet.create({
  plusButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#000', // Nền đen cho nút +
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  plusText: {
    color: '#fff', // Màu chữ trắng
    fontSize: 30,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  dropdown: {
    position: 'absolute',
    top: 85, // Căn chỉnh modal ngay dưới nút cộng
    right: 20,
    backgroundColor: '#000', // Nền đen cho modal
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 10,
    zIndex: 100,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333', // Đường kẻ mờ
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#fff', // Chữ trắng
    fontWeight: '500',
  },
});

export default DropdownWithAnimation;