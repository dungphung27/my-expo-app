import React, { useEffect, useState } from 'react';
import { useScooter } from '~/providers/ScooterProvider';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import { supabase } from '~/lib/supabase';

const DropdownWithAnimation = () => {
  const {isVisible,setIsVisible,setSavePlace,editSdt,setEditSdt,sdt,setSdt,addSafeMode,addMode,setAddMode} = useScooter()
  const [phone,setPhone]  = useState('')
  const [isValid, setIsValid] = useState(false);

  // Kiểm tra số điện thoại Việt Nam (0xxx hoặc +84xxx, 10 số)
  const validatePhone = (text: string) => {
    const regex = /^(?:\+84|0)([3|5|7|8|9])[0-9]{8}$/;
    setPhone(text);
    setIsValid(regex.test(text));
  };
  useEffect(()=>{
    if(addMode || addSafeMode || editSdt)
    {
        setIsVisible(false)
    }
  },[addMode,editSdt])
  const updateSdt = async ( ) => {
  const { data, error } = await supabase
    .from('phoneNumber') // Tên bảng trong database
    .update({ sdt : phone }) // Cập nhật giá trị cột `radius`
    .eq('id', 1); // Điều kiện để tìm dòng có id = 16

  if (error) {
    console.error('Lỗi khi cập nhật sdt:', error.message);
    return;
  }
  console.log('Cập nhật sdt thành công:');
};
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
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {setEditSdt(true)}}>
                  <Text style={styles.menuText}>Edit your phone number</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  )}
  {editSdt && (
    <>
    <Modal visible={editSdt} transparent={true} animationType='fade' >
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Edit your phone number</Text>

        <TextInput
          style={styles.input}
          placeholder={sdt}
          keyboardType="phone-pad"
          onChangeText={(value) => validatePhone(value)}
          value={phone}
          placeholderTextColor='gray'
        />

        {phone.length > 0 && (
          <Text style={{ color: isValid ? "green" : "red", marginBottom: 10 }}>
            {isValid ? "✔ Valid phone number" : "✖ Invalid phone number"}
          </Text>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={()=>
            {
              setEditSdt(false)
              setPhone('')
              setIsValid(false)
            }
            }>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: isValid ? "#4CAF50" : "grey" }]}
            onPress={() => {
              if (isValid) 
                {

                  setSdt(phone)
                  setEditSdt(false)
                  setIsValid(false)
                  updateSdt()
                  setPhone('')
                }
            }}
            disabled={!isValid}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    top: 50, // Căn chỉnh modal ngay dưới nút cộng
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
   modalContainer: {
  backgroundColor: "#000", // Màu đen
  padding: 20,
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center", 
  alignSelf: "center", 
  width: "80%", // Giảm kích thước modal
  maxWidth: 300, // Giới hạn chiều rộng
  position: "absolute",
  top: "50%", 
  left: "50%",
  transform: [{ translateX: -150 }, { translateY: -100 }], // Dịch modal về trung tâm
},
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: '#fff'
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    color: '#fff'
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 5,
  },
  submitButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default DropdownWithAnimation;