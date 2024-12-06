import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useScooter } from '~/providers/ScooterProvider';
import { Button } from './Button';
import { supabase } from '~/lib/supabase';
import { getAddress } from '~/services/address';
export default function SheetAdd() {
    const bottomSheetRefAdd = useRef<BottomSheet>(null); // Tạo tham chiếu đến Bottom Sheet
    const { setId,Id,setAddress,addressName,setInput,isInput,pointMap,setSavePlace,name,setName,addMode, setAddMode,addSafeMode,setAddSafeMode } = useScooter(); // Lấy trạng thái từ provider
    function getRandomInt(min:number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
    const addMarker = async () => {
  const { data, error } = await supabase
    .from('markerdata') // Tên bảng trong database
    .insert([
      {
        id: Id,
        lat: pointMap?.lat, // Vĩ độ
        long: pointMap?.long, // Kinh độ
        radius: 50, // Bán kính
        name: name,
        addressLocation: addressName
      },
    ]);
  if (error) {
    console.error('Lỗi khi thêm marker:', error.message);
    return;
  }
  console.log('Thêm marker thành công:');
};
    useEffect(() => {
        // Khi addMode = true, mở Bottom Sheet
        if (addMode) {
            bottomSheetRefAdd.current?.expand();
        } else {
            bottomSheetRefAdd.current?.close()
        }
    }, [addMode]);
    const [h,sh] = useState(0)
     useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      console.log('Bàn phím xuất hiện với chiều cao:', e.endCoordinates.height);
      sh(e.endCoordinates.height)
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      console.log('Bàn phím đã ẩn');
      sh(0)
    });
    hideSubscription
    showSubscription
})


    return (
        <BottomSheet
            ref={bottomSheetRefAdd} // Gắn tham chiếu
            index={-1} // Mặc định đóng Bottom Sheet
            snapPoints={(isInput || addSafeMode) ? [220 + h ] :[170 +h]} // Các vị trí mở rộng
            backgroundStyle={{ backgroundColor: '#414442' }} // Màu nền
            enableOverDrag={true}
            onClose={() => setAddMode(false)} // Khi đóng, cập nhật trạng thái addMode
        >
            <BottomSheetView style={{ flex: 1, padding: 10, gap: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center',paddingHorizontal:10, gap: 40 }}>
                    {!addSafeMode && !isInput && (<Text style={{ color: 'white', fontSize: 35,textAlign:'center', fontWeight: '700'}}>Add new safe place?</Text>)}
                    {!addSafeMode && isInput && (<Text style={{ color: 'white', fontSize: 35,textAlign:'center', fontWeight: '700'}}>Type a name</Text>)}
                    {addSafeMode && (<Text style={{ color: 'white', fontSize: 25,textAlign:'center', fontWeight: '700'}}>Choose a location for '{name}'</Text>)}
                </View>
                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0, justifyContent:'space-evenly' }}>
                    {!addSafeMode && !isInput && (
                        <>
                        <Button
                    title='Choose Location'
                    width='45%'
                    onPress={()=>{
                        setAddress('')
                        let n = getRandomInt(2,200000)
                        setId(n)
                        console.log(n)
                        setInput(true)
                    }}
                    />
                    <Button 
                    title='Cancel'
                    width='45%'
                    onPress={()=>{
                        setAddMode(false)
                        
                    }}
                    backgroundColor='grey'
                    />
                    </>)}
                    {isInput && !addSafeMode && (<View style={{flexDirection:'column'}}>
                         <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <TextInput
                        style={{backgroundColor: '#414442',
                                borderColor: '#38C400',
                                borderBottomWidth: 1,
                                width:400,
                                color:'#fff',
                                fontWeight:'600',
                                fontSize: 30,
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                marginBottom: 10
                        }}    
                        placeholder='home'
                        selectionColor='#38C400'
                        maxLength={15} 
                        onChangeText={(value)=>{
                            setName(value.trim())
                        }}
                    />
                    </TouchableWithoutFeedback>
                    <Button
                        title='Save name'
                        disabled={(name!.length <= 4 )}
                        onPress={()=>{
                            setAddSafeMode(true)
                            setInput(false)
                        }}
                        
                    />
                    </View>
                )}
                    {addSafeMode  && ( 
                <View style={{flexDirection:'column'}}> 
                     {addressName &&(<View>
                        <Text style={{ color: '#fff', fontSize: 18 }}>
                        Address: {addressName}
                        </Text>
                    </View>  
                     )}
                    <Button
                        title='Save location'
                        disabled={((name!.length <= 4) || !pointMap)}
                        onPress={()=>{
                            addMarker()
                            setAddSafeMode(false)
                            
                            console.log(Id)
                            setSavePlace(true)
                            alert('Add new place succesfully')
                            setAddMode(false)
                            setAddSafeMode(false)
                            bottomSheetRefAdd.current?.close
                        }}
                        
                    />

                    </View>)}
                 </View>
            </BottomSheetView>
        </BottomSheet>
    );
}

