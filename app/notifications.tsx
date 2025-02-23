import { View, Text ,ImageBackground,StyleSheet, Pressable, Modal, TouchableOpacity} from 'react-native';
import {FlatList} from 'react-native'
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useScooter } from '~/providers/ScooterProvider';
import {useEffect, useRef, useState } from 'react';
import { supabase } from '~/lib/supabase';
import Notification_item from './noti';
type Props = {
  navigation: DrawerNavigationProp<any, any>; // Sử dụng đúng kiểu cho navigation
};
const Noti: React.FC<Props> = ({ navigation }) => {
  const flatListRef = useRef<FlatList<any>>(null);
  const {selectedId,setSelectedId,listNoti} = useScooter()
    const deleteByType = (i: number) => {
        for(let index = i + 1; index <listNoti!.length;index++)
        {
            if (listNoti![index].type == listNoti![i].type )
            {
                listNoti!.splice(index,1)
                index--
            }
        }
    }
  useEffect(()=>{
    let type3,type4 = false
    if(listNoti)
    {
        for(let i = 0; i<  listNoti.length ;i++)
        {
            if (listNoti[i].type >= 3 )
            {
               deleteByType(i)
                if(listNoti[i].type == 3)  type3 = true
                else type4 = true
                if((type3 && type4) || ((type3|| type4) && i == (listNoti.length > 15 ? 15: listNoti.length - 1))) i = 1000
            }
        }

    }
    listNoti?.forEach(l =>{
        if (l.isSeen)
            setSelectedId([...selectedId,l.id])
    })
  },[listNoti])
  return (
    <View style={{height:'100%',width:'100%'}}  >
      <FlatList
       ref={flatListRef}
       data={listNoti?.slice(0,15)}
        initialNumToRender={12} // Render trước 10 item đầu tiên
      maxToRenderPerBatch={1} // Tối đa 10 item render mỗi lần cuộn
      windowSize={5} // Chỉ giữ 5 lần kích thước màn hình của danh sách trong bộ nhớ
      removeClippedSubviews={true} // Xóa item ngoài màn hình (Android)
       renderItem={({item})=> 
            <Notification_item Noti={item} />   
       }
       />
    </View>
  );
};
export default Noti;
