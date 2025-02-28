import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { getDirections } from "~/services/directions";

import { useEffect,useRef } from 'react';
import { View, Text,Image, Animated, Easing, TouchableOpacity,Switch, Linking, Alert} from 'react-native';
import { useScooter } from '~/providers/ScooterProvider';
import scooterImg from '~/assets/safe_img.png';
import userAvartar from '~/assets/avartar.png'
import {FontAwesome6} from '@expo/vector-icons';
import { Button } from './Button';
import Ionicons from '@expo/vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import { supabase } from '~/lib/supabase';
export default function SelectedScooterSheet(){
  const scaleValue = new Animated.Value(1);
 const handleRegionChange =  (value: number) => {
      const metersPerPixel = 156543.03392 * Math.cos(0 * Math.PI / 180) / Math.pow(2, zoom); // Đơn giản hóa công thức
      const pixelRadius = value / metersPerPixel;
      setRadius(pixelRadius)
  };
  const updateRadius = async (id: number, newRadius: number) => {
  const { data, error } = await supabase
    .from('markerdata') // Tên bảng trong database
    .update({ radius :newRadius }) // Cập nhật giá trị cột `radius`
    .eq('id', id); // Điều kiện để tìm dòng có id = 16

  if (error) {
    console.error('Lỗi khi cập nhật radius:', error.message);
    return;
  }
  console.log('Cập nhật thành công:');
};
const updateUserRadius = async (newRadius: number) => {
  const { data, error } = await supabase
    .from('userdata') // Tên bảng trong database
    .update({ radius :newRadius }) // Cập nhật giá trị cột `radius`
    .eq('id', 2); // Điều kiện để tìm dòng có id = 16

  if (error) {
    console.error('Lỗi khi cập nhật radius:', error.message);
    return;
  }
  console.log('Cập nhật thành công:');
};
const deleteLocation = async (id: number) => {
  const { data, error } = await supabase
    .from('markerdata') // Tên bảng trong database
    .delete() // Xóa dữ liệu
    .eq('id', id); // Điều kiện để tìm dòng có id = 16

  if (error) {
    console.error('Lỗi khi xóa:', error.message);
    return;
  }

  console.log('Xóa thành công:');
};

  const fetchDirection = async () => {
            const location = await Location.getCurrentPositionAsync();
            let newDirection
            if(selectUser ){
              if (user) {
                 newDirection = await getDirections(
                [location.coords.longitude, location.coords.latitude],
                [user[0].long, user[0].lat]
            );
            setMinLng(Math.min(user[0].long, location.coords.longitude));
            setMaxLng(Math.max(location.coords.longitude, user[0].long));
            setMinLat(Math.min(location.coords.latitude, user[0].lat));
            setMaxLat(Math.max(location.coords.latitude, user[0].lat));
              }
              
            } else {
              newDirection = await getDirections(
                [location.coords.longitude, location.coords.latitude],
                [selectedScooter!.long, selectedScooter!.lat]
            );
            setMinLng(Math.min(selectedScooter!.long, location.coords.longitude));
            setMaxLng(Math.max(location.coords.longitude, selectedScooter!.long));
            setMinLat(Math.min(location.coords.latitude, selectedScooter!.lat));
            setMaxLat(Math.max(location.coords.latitude, selectedScooter!.lat));
            }
             
            setDirection(newDirection);
        };
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
    const {addressName,status,sdt,setDeleted,switchValue,setswitchValue,setDirection,userAddress,setUserAddress,setPressOption,setSelectUser,selectUser,user,pressOption,setRadius,zoom,saveSafe,setSaveSafe,setSliderValue,sliderValue,setPressSafe,pressSafe,press,setClose,setPress, selectedScooter, routeTime , routeDistance, setSelectedScooter,setMaxLng,setMaxLat,setMinLat,setMinLng} = useScooter();
    const bottomSheetRef = useRef<BottomSheet>(null)
    useEffect(()=>{
        if(selectedScooter)
        {
            setClose(false)
            bottomSheetRef.current?.expand()      
        }
        if (!selectedScooter)
        {
          bottomSheetRef.current?.close()
        }
    },[selectedScooter])
   
    useEffect(()=>{
      if(!saveSafe && selectedScooter) 
        setSliderValue(selectedScooter.radius)
    },[saveSafe])
    const makeCall = () => {
        const url = `tel:${sdt}`;
        Linking.openURL(url).catch((err) => Alert.alert('Lỗi', 'Không thể thực hiện cuộc gọi'));
  };
    const sendSMS = () =>{
      const url = `sms:${sdt}?body=${encodeURIComponent("")}`;
  Linking.openURL(url).catch(err => console.error('Lỗi mở SMS:', err));
    }
    return (
      
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={(pressSafe ) ? [320] :[270]}
      enablePanDownToClose
      onClose={() => {
        setSelectedScooter(undefined);
        setPress(false)
        setClose(true)
        if(selectUser)
          setSelectUser(false)
        setMaxLat(undefined);
        setMaxLng(undefined);
        setMinLat(undefined)
        setMinLng(undefined)
        setPressSafe(false)
        setSaveSafe(false)
        setPressOption(false)
        setDeleted(false)
      }}
      backgroundStyle={{ backgroundColor: '#414442' }}>
        {selectedScooter && (
  <BottomSheetView style={{ flex: 1, padding: 6, gap: 10 }}>
    {/* TOP part */}
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
      {!selectUser && (<Image source={scooterImg} style={{ width: 60, height: 60, borderRadius: 30 }} />)} 
      {selectUser && (<Image source={userAvartar} style={{ width: 65, height: 65,borderRadius: 32.5 }} />)} 
      <View style={{ flex: 1, gap: 1 }}>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}> {selectedScooter!.name} </Text>
        <Text style={{ color: 'gray', fontSize: 16 }}>
          Radius: {sliderValue}m
        </Text>
         {selectUser && (
          <>
            
            <Text style={{ color: 'gray', fontSize: 15 }}>
              Status: {status ? 'safe' : 'unsafe'}
            </Text>
           
            <Text style={{ color: 'gray', fontSize: 15 }}>
              Battery: {user![0].battery}% {user![0].charging ? 'is charging' : 'is not charging'}
            </Text>
        </>
        
        )}
         
      </View>
      <View style={{ gap: 5 }}>
        {press != true && pressSafe !=true  && pressOption!= true && (<View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              alignSelf: 'flex-start',
            }}> 
           {!selectUser &&(
            <TouchableOpacity
              activeOpacity={0.7}
              onPressIn= {()=> {handlePressIn
                setPressOption(true)
              }}
              onPressOut={handlePressOut}
            >
                <Ionicons name="settings" size={24} color="#42E100" />
              </TouchableOpacity>)} 
              {selectUser &&(
                <>
               
                <TouchableOpacity
              activeOpacity={0.7}
              onPress={makeCall}
            >
              <Ionicons name="call" size={24} color="#42E100" />
            </TouchableOpacity>
                
                <TouchableOpacity
              activeOpacity={0.7}
              onPress={sendSMS}
            >
              <Ionicons name="chatbubble" size={24} color="#42E100" />
            </TouchableOpacity>
           
              </>
            )} 
              <TouchableOpacity
                activeOpacity={0.7}
                onPressIn={handlePressIn}
                onPressOut= {()=>{
                  handlePressOut
                  setPressSafe(true)
                  setSaveSafe(false)
                }}
              >
                <Ionicons name="notifications" size={24} color="#42E100" />  
              </TouchableOpacity>          
        </View>
        )}
        {routeDistance !== undefined && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              alignSelf: 'flex-start',
            }}>
            <FontAwesome6 name="flag-checkered" size={18} color="#42E100" />
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
              {(routeDistance / 1000).toFixed(1)} km
            </Text>
          </View>
        )}
        {routeTime !== undefined && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              alignSelf: 'flex-start',
            }}>
            <FontAwesome6 name="clock" size={18} color="#42E100" />
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
              {(routeTime / 60).toFixed(0)} min
            </Text>
          </View>
        )}
      </View>
    </View>
    
      <View>
        <Text style={{ color: '#fff', fontSize: 18 }}>
          Address: {selectUser ? userAddress : selectedScooter.addressLocation }
         
        </Text>
    </View>
   {pressSafe == true && (  <View >
   <Slider
    style={{ backgroundColor: 'transparent' }}
    minimumValue={50}
    maximumValue={3000}
    value = {selectedScooter.radius}
    onValueChange={(value) => {
      setSliderValue(value);
      handleRegionChange(value);
    }}
    step={50}
    minimumTrackTintColor="#42E100"
    maximumTrackTintColor="#ccc"
    thumbTintColor="#42E100"
  />
  
</View>
   )}
   
    {/* Bottom part */}
   {pressSafe != true  && !pressOption && !press && ( <View>
      <Button
        title="Get Direction"
        onPress={()=> {
          setPress(true)
        }}
      />
    </View>
   )}
   {pressSafe != true && !pressOption && press && ( <View style={{flexDirection:'row',justifyContent:'space-around'}}>
      <Button
        title="Update"
        width='40%'
        onPressIn={() => {
          setTimeout(() => {
            setDirection(undefined)
          }, 100 ); // 100 giây = 100 * 1000 ms
        }}
        onPress={() => {
          fetchDirection();
        }}
        onPressOut={() => {
          fetchDirection();
          setPress(true);
        }}
      />
      <Button
        title="Cancel"
        backgroundColor='grey'
        width='40%'
        onPress={()=>{
          setPress(false)
        }}
      />
    </View>
   )}
    {(pressSafe) && ( <View style={{flexDirection:'row',justifyContent:'space-around'}}>
      
      <Button
        title="Save"
        width='40%'
        onPress={()=>{
          if(pressSafe)
          {
            if (selectUser)
            {
              updateUserRadius(sliderValue) 
            } else {
              updateRadius(selectedScooter.id,sliderValue)
            }
            setSaveSafe(true)
            setPressSafe(false)
            selectedScooter.radius = sliderValue
          } 
          
        }}
      />
      <Button
        title="Cancel"
        backgroundColor='grey'
        width='40%'
        onPress={()=>{
          setPressSafe(false)
          setSliderValue(selectedScooter.radius)
          handleRegionChange(selectedScooter.radius)
        }}
      />
    </View>
    
   )}
   {pressOption == true && ( <View style={{flexDirection:'row',justifyContent:'space-around'}}>
      
      <Button
        title="Delete "
        width='40%'
        backgroundColor='red'
        onPress={()=>{
          deleteLocation(selectedScooter.id)
          setDeleted(true)
          alert('Delete succesfully')
          setPressOption(false)
          bottomSheetRef.current?.close()
          
        }}
      />
      <Button
        title="Cancel"
        backgroundColor='grey'
        width='40%'
        onPress={()=>{
          setPressOption(false)
        }}
      />
    </View>
    
   )}
  </BottomSheetView>

)}
    </BottomSheet>
    )
}
