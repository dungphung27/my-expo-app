import React, { useEffect, useState } from 'react';
import {Text, View,TouchableOpacity} from 'react-native';
import moment from "moment";
import { StyleSheet } from "react-native";
import { useScooter } from '~/providers/ScooterProvider'
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { supabase } from '~/lib/supabase';

type noti = {
    id: number;
    created_at: string;
    type: number;
    message: string; 
    isSeen: boolean;
    state: boolean
}
export type ChatMessageProps = {
  Noti: noti;
}
type RootStackParamList = {
  Screen1: undefined;
  Map: undefined;
};

const Notification_item = (props: ChatMessageProps) => {
  const { Noti } = props;
     const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
    const updateNoti = async () => {
  const { data, error } = await supabase
    .from('notifications') // Tên bảng trong database
    .update({ isSeen : true }) // Cập nhật giá trị cột `radius`
    .eq('id', Noti.id); // Điều kiện để tìm dòng có id = 16

  if (error) {
    console.error('Lỗi khi cập nhật radius:', error.message);
    return;
  }
  console.log('Cập nhật thành công:');
};
   const {setSelectedId,setAddSafeMode,setSelectUser,setSelectedScooter,user,setAddMode,setLocationSearch,selectedId} = useScooter()
    
   const handlePress = () => {
    if (!selectedId.includes(Noti.id) ) {
      setSelectedId([...selectedId, Noti.id]); // Thêm ID vào danh sách đã nhấn
    }
    if(Noti.type  <=2 )
    {
         setAddSafeMode(false)
         setSelectUser(false)
         setSelectedScooter(undefined)
         setAddMode(false)
         setLocationSearch(true)
         navigation.navigate('Map')
    }
    if(!Noti.isSeen) updateNoti()
        Noti.isSeen = true
  };
  const isSelected =selectedId.includes(Noti.id);
  const NotiIcon = () =>{
    switch(Noti.type)
    {
        case (1): {
            Noti.message = 'There is an emergency situation'
            return (

                <MaterialIcons name="sos" size={30} color="red" />
            )
        }
        case(2): {
            return (
                <>
                {Noti.state ? <AntDesign name="Safety" size={30} color="green" /> : <AntDesign name="warning" size={30} color="red" />  } 
                </>
            )
        }
        case (3): {
            useEffect(()=>{
                if(user)
                {
                     Noti.message = `Your battery's device is at ${user[0].battery}%` 
                }
             },[user])
            return (
                <>  
                {Noti.state ? <MaterialIcons name="battery-5-bar" size={30} color="green" /> :  <MaterialCommunityIcons name="battery-alert-variant-outline" size={30} color="red" />} 
                </>
            )
        }
        case (4) : {
            Noti.message = Noti.state ? 'Your device is is currently charging' : `Your device need to connect to the charger`
            return (
                <>
                {Noti.state ?<MaterialCommunityIcons name="battery-charging" size={30} color="green" /> :  <MaterialCommunityIcons name="battery-alert-variant-outline" size={30} color="red" />} 
                </>
            )
        }
    }
}
    const NotiTitle = () =>{
        switch(Noti.type)
    {
        case (1): {
            return (
                <Text style={styles.title}>SOS</Text>
            )
        }
        case(2): {
            return (
                <>
                {Noti.state ? <Text style={styles.title}>No Threats Detected</Text> : <Text style={styles.title}>Security Alert</Text> } 
                </>
            )
        }
        case (3): {
            return (
                <>
                {Noti.state ? <Text style={styles.title}>Battery status: OK</Text>:  <Text style={styles.title}>Low Battery</Text>} 
                </>
            )
        }
        case (4) : {
            return (
                <>
                {Noti.state ?<Text style={styles.title}>Device is Charging</Text> :  <Text style={styles.title}>Charger Disconnected</Text>} 
                </>
            )
        }
    }
    }
  return (
    <TouchableOpacity onPress={() => handlePress()}>
    <View style={[styles.container,( Noti.isSeen) && {
        backgroundColor:  'white',
    }]}>
        <View style={{padding: 20,alignItems: 'center',flex: 1,alignSelf:'center'}}>
            <NotiIcon />
        </View>
        
        <View style={{flexDirection: 'column',flex: 10,alignSelf:'center'}}>
            <View style={{flexDirection: 'row',alignItems:"center",justifyContent:"space-between"}}>
                 <View style={{paddingBottom:5}} >
                        <NotiTitle />
                        </View>
                 <View>
                    <Text style={styles.time}>{moment(Noti.created_at).fromNow()}</Text>
                    </View>
            </View>
            {Noti.type != 2 &&  <Text >{Noti.message}</Text> } 
            {Noti.type == 2 && user && Noti.state && <Text >{user[0].name} is in safe area: "{Noti.message}"</Text> }
            {Noti.type == 2 && user && !Noti.state && <Text >{user[0].name} is unsafe</Text> }
        </View>
        <View style={{flex:1,flexDirection:'row',alignItems: 'center',justifyContent: 'space-around'}}>
            {!Noti.isSeen && (
                <View style={{alignSelf: 'center'}}>
                    <Entypo name="dot-single" size={40} color="#007BFF" />
                </View>
                 )} 
        </View>
    </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 7,
    backgroundColor: 'rgba(0,0,0,0.05)',
    flexDirection:'row',
    
  },
  time: {
    alignSelf: "flex-end",
    color: 'grey'
  },
  title:{
    color: 'black',
    fontWeight:"700"
  }

});

export default Notification_item;