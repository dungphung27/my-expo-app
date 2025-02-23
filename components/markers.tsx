import { Camera, CircleLayer, Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { featureCollection, point } from '@turf/helpers';
import { useEffect, useRef, useState } from 'react';
import pin from '~/assets/icon_safe.png';
import * as Location from 'expo-location';
import userimg from '~/assets/user_img.png';
import { getAddress } from '~/services/address';
import { useScooter } from '~/providers/ScooterProvider';
import { supabase } from '~/lib/supabase';
export default function ScooterMarkers() {
  const {Id,addressName,isAddress,oldStatus,listNoti,setListNoti,setUser,setLocationSearch,locationSearch,listSafe,setListSafe,setOldStatus,setStatus,setIsAddress,setAddress,setSavePlace,selectUser,setSelectUser,user,name,setPointMap,addSafeMode,addMode,savePlace,pointMap,deleted,pressOption,pressSafe,markers,press,sliderValue,saveSafe,radius,setPressSafe,setSelectedPoint,selectedPoint,close,setPress,setSelectedScooter,setSliderValue,selectedScooter,minLat,minLng,maxLat,maxLng } = useScooter();
  useEffect(()=>{
    if(saveSafe)
    {
      if (!selectUser)
      {
        markers?.forEach(m =>{
          if (m.id == selectedScooter?.id)
          {
            m.radius = sliderValue
          }
        })
      } else {
        user![0].radius = sliderValue
      } 
    }
  },[saveSafe])
  if(saveSafe)
    {
      if (!selectUser)
      {
        markers?.forEach(m =>{
          if (m.id == selectedScooter?.id)
          {
            m.radius = sliderValue
          }
        })
      } else {
        user![0].radius = sliderValue
      } 
    }
    
    useEffect(()=>{
    if(isAddress)
    {
      markers?.forEach(m =>{
    if ((m.id == selectedScooter?.id) && addressName)
    {
      m.addressLocation = addressName
    }
  })
    }
  },[isAddress])
  
  if(isAddress)
    {
      markers?.forEach(m =>{
    if ((m.id == selectedScooter?.id) && addressName)
    {
      m.addressLocation = addressName
    }
  })
    setIsAddress(false)
    }
    useEffect(()=>{
    if(deleted && selectedScooter)
    {
      markers?.forEach(m =>{
    if (m.id == selectedScooter?.id)
    {
      m.isDeleted = true
    }
  })
    }
  },[deleted])
  useEffect(() => {
    if(pointMap && savePlace && addressName)
    {
    markers?.push({
        id: Id,
        lat: pointMap!.lat, // Vĩ độ
        long: pointMap!.long, // Kinh độ
        radius: 50, // Bán kính
        name: name!,
        isDeleted: false,
        addressLocation: addressName  
      })
      setPointMap({lat: 0,long: 0,addressLocation:' '})
      setPoint = point([pointMap.long,pointMap.lat])
      setSavePlace(false)
    }
}, [savePlace]);
useEffect(()=>{
  if(!addMode && !addSafeMode && pointMap)
  {
    setPointMap({lat: 0,long: 0,addressLocation:' '})
    setPoint = point([pointMap.long,pointMap.lat])
  }
},[addMode,addSafeMode])
 const updateAddress = async (id: number, newName: string) => {
  const { data, error } = await supabase
    .from('markerdata') // Tên bảng trong database
    .update({ addressLocation : newName }) // Cập nhật giá trị cột `radius`
    .eq('id', id); // Điều kiện để tìm dòng có id = 16

  if (error) {
    console.error('Lỗi khi cập nhật radius:', error.message);
    return;
  }
  console.log('Cập nhật thành công:');
};
type LocationType = {
  lat: number;
  long: number;
} | undefined;
let userPoint
const [location, setLocation] = useState<LocationType>(undefined);
const TrackLocation = async () => {
  useEffect(() => {
    const channel = supabase
      .channel('realtime_userdata')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'userdata' }, 
        async (payload : any) => {
          if (payload.new.id == 2) { 
            console.log('Tọa độ cập nhật:', payload.new.lat,payload.new.long);
            setLocation({
              lat: payload.new.lat,
              long: payload.new.long
            });
            setUser([payload.new])
            if( selectUser && location)
            {
              let long = location.long,lat = location.lat
               let s : any =   await getAddress(long,lat)
              setAddress(s)
            }
            
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return location;
};
TrackLocation()


if (location)
  {
    
    userPoint = point([location.long,location.lat],{user}) || undefined;
  } else if (!location && user)
  {
    userPoint = point([user[0].long,user[0].lat],{user}) || undefined;
  }
  useEffect( () =>{

    if(user)
    {
      setLocation({
        lat: user[0].lat,
        long: user[0].long
      })
      
    }
    if(selectUser && user)
    {
      setSelectedPoint(point([user[0].long,user[0].lat],{user}))
    }
  },[selectUser,user])
  useEffect( () =>{

    if(user && !selectUser)
    {
      
      if (camera.current ) {
      camera.current.setCamera({
        centerCoordinate: [user[0].long, user[0].lat], // Tọa độ trung tâm
        zoomLevel: 13, // Mức độ zoom
        animationMode: 'easeTo', // Hiệu ứng
        animationDuration: 500, // Thời gian hiệu ứng (ms)
      });
      setLocationSearch(false)
    }
    }
    
  },[user])
 
  const points = markers
  ?.filter((scooter) => scooter.isDeleted == false) // Lọc các phần tử có isDeleted = 0
  .map((scooter) => point([scooter.long, scooter.lat], { scooter })) || [];
  const camera = useRef<Camera>(null)
   useEffect(()=>{
    if(locationSearch && user)
    {
      handleMapPress(user[0].long,user[0].lat)
    }
  },[locationSearch])
  
  const onPointPress = async (event: OnPressEvent) => {
    if (event.features[0].properties?.scooter && !addMode) {
      let long = event.features[0].properties.scooter.long,lat = event.features[0].properties.scooter.lat
      if(!event.features[0].properties.scooter.addressLocation)
      {
        let s =  await getAddress(long,lat)
        await setAddress(s)
        updateAddress(event.features[0].properties.scooter.id,s)
        event.features[0].properties.scooter.addressLocation = s
        setSelectedScooter(event.features[0].properties.scooter);
        setIsAddress(true)
      } else {
        setSelectedScooter(event.features[0].properties.scooter);
      }
      setSliderValue(event.features[0].properties.scooter.radius)
      setPress(false)
      setPressSafe(false)
      handleMapPress(long,lat)
      setSelectedPoint(point([long, lat])); 
      setSelectUser(false)
    }
  };
  const onUserPress = async (event: OnPressEvent) =>{
    console.log(JSON.stringify(event.features[0].properties?.user[0],null,2))

    if(event.features[0].properties?.user[0] && !addMode)
    {
      let long = event.features[0].properties?.user[0].long, lat = event.features[0].properties?.user[0].lat;
      let s =  await getAddress(long,lat)
      await setAddress(s)
     
      setSelectedScooter({
        ...event.features[0].properties?.user[0], 
        addressLocation : s, 
      });
       setIsAddress(true)
      setSliderValue(event.features[0].properties.user[0].radius)
      setSelectUser(true)
      setPress(false)
      setPressSafe(false)
      handleMapPress(user![0].long,user![0].lat)
      setSelectedPoint(point([long, lat]));
      
    }
    
  }
  function haversineDistance(lat1 : number, lon1 : number, lat2 : number, lon2: number, unit = "km") {
    const R = unit === "km" ? 6371 : 3958.8; // Bán kính Trái Đất: 6371 km hoặc 3958.8 miles
    const toRadians = (degree : number) => degree * (Math.PI / 180); // Chuyển đổi độ sang radian

    // Chuyển đổi tọa độ sang radian
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    // Công thức Haversine
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Tính khoảng cách
    const distance = R * c;
    return distance; // Khoảng cách giữa 2 tọa độ
}
const listenForNewRows = async () => {
  supabase
    .channel("realtime-messages") // Tạo một kênh realtime
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications" },
      (payload : any) => {
        console.log("Dòng mới được thêm:", payload.new);
        if(listNoti)
        setListNoti([payload.new,...listNoti])
      else  setListNoti([payload.new])
      alert("You have a new notification")
      }
    )
    .subscribe();
};
listenForNewRows()
const listenForUpdateRows = async () => {
  supabase
    .channel("realtime-message") // Tạo một kênh realtime
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "notifications" },
      (payload : any) => {
        console.log("Dòng mới được thêm:", payload.new);
        listNoti?.forEach(l =>{
          if (l.id == payload.new.id)
          {
            l.isSeen = payload.new.isSeen
          }
        })
        setListNoti([...listNoti!])
      }
    )
    .subscribe();
};
listenForUpdateRows()
const sendMessage =async (s: string,b:boolean) =>{
  const message = s ? `${user![0].name} is in safe area ${s} `: `${user![0].name} is unsafe`
  if((b == false && b != oldStatus) || s || oldStatus == undefined)
  {
        alert(message)
        setOldStatus(b)
  }
}
  const checkIsInSafeArea = async () =>{
       let listArea : string[] = []
        let tmp : string[] = []
      let b1=false,b2= false
    
      markers!.forEach(marker =>{
        let distance = haversineDistance(user![0].lat,user![0].long,marker.lat,marker.long)
        if (distance*1000 > marker.radius )
        {
          if(!b1)
            b1 = false
        } else {
          b1 = true
          listArea = [...listArea,marker.name]
          tmp =  [...tmp,marker.name]
        }
      })
      let currentLocation = await Location.getCurrentPositionAsync();
      let distance = haversineDistance(user![0].lat,user![0].long,currentLocation.coords.latitude,currentLocation.coords.longitude)
      if(distance*1000 > user![0].radius)
      {
        b2 = false
      } else {
        b2 = true
        listArea = [...listArea,'gần bạn']
        tmp= [...tmp,'gần bạn']
      }
      setStatus(b1 || b2)
      let b = b1 || b2
      await setStatus(b)
       for (let index = 0; index < listArea.length; index++) {
        const a = listArea[index];
        listSafe.forEach((s) => {
          if (a === s) {

            listArea.splice(index, 1); 
            index--; // Giảm index để xử lý lại vị trí vừa bị xóa
          }
        });
      }
      let strArea = listArea.join(', ')
      sendMessage(strArea,b)
      setListSafe(tmp)
    
  }
  useEffect(()=>{
    if(user && markers)
      checkIsInSafeArea()
  },[user,markers])
  
  useEffect(() => {
  const fetchData = async () => {
    if (selectUser) {
      try {
        const s = await getAddress(user![0].long, user![0].lat);
        await setAddress(s);
        setTimeout(()=>{
          selectedScooter!.addressLocation = s
        },100)
        handleMapPress(user![0].long, user![0].lat);
      } catch (error) {
        console.error('Lỗi trong useEffect:', error);
      }
    }
  };

  fetchData(); // Gọi hàm async bên trong useEffect
}, [user, selectUser]); // Mảng phụ thuộc
  useEffect(()=>{
    if(!press && selectedScooter && !pressSafe && !pressOption )
    {
      if (selectUser)
      {
        handleMapPress(user![0].long,user![0].lat)
      } else{
        handleMapPress(selectedScooter.long,selectedScooter.lat)
      }
      
    }
  },[press,pressSafe,pressOption])
  const handleMapPress = (long: number,lat:number) => {
    if (camera.current ) {
      camera.current.setCamera({
        centerCoordinate: [long, lat], // Tọa độ trung tâm
        zoomLevel: selectUser ? 14.5 : 16, // Mức độ zoom
        animationMode: 'easeTo', // Hiệu ứng
        animationDuration: 500, // Thời gian hiệu ứng (ms)
      });
      setLocationSearch(false)
    }
  };
 let setPoint
  if (pointMap) 
  {
    setPoint = point([pointMap.long,pointMap.lat])
  }

    
  useEffect(()=>{
    if (minLat && minLng && maxLat && maxLng && press)
    {
      camera.current?.fitBounds(
      [minLng, minLat],
      [maxLng, maxLat],
      [100, 100]
    );
    }  else if ((close && !minLat) || addMode || addSafeMode ) {
      camera.current?.setCamera({
        zoomLevel: 12, // Mức độ zoom
        animationMode: 'easeTo', // Hiệu ứng
        animationDuration: 500, // Thời gian hiệu ứng (ms)
      });
    }

  },[minLat,minLng,maxLat,maxLng,close,press ,addMode,addSafeMode])
  useEffect(()=>{
    if(!selectedScooter)
    {
      setSelectedPoint(undefined)
    }
  },[selectedScooter])
  
  return (
    <>
    <Camera ref={camera}   />
    
    <ShapeSource id="scooters" cluster={true} clusterMaxZoomLevel={15} clusterRadius={20} shape={featureCollection(points)} onPress={onPointPress}>
      <SymbolLayer
        id="clusters-count"
        style={{
          textField: ['get', 'point_count'],
          textSize: 13,
          textColor: '#ffffff',
          textPitchAlignment: 'map',
        }}
      />
      <CircleLayer
        id="clusters"
        belowLayerID="clusters-count"
        // filter={['==', ['get', 'id'], 16]} 
        filter={['has', 'point_count']}
        style={{
          circlePitchAlignment: 'map',
          circleColor: '#42E100',
          circleRadius: 15,
          circleOpacity: 1,
          circleStrokeWidth: 2,
          circleStrokeColor: 'white',
        }}
      />
      <SymbolLayer
        id="scooter-icons"
        filter={['!', ['has', 'point_count']]}
        style={{
          iconImage: 'pin',
          iconSize: 0.4,
          iconAllowOverlap: true,
          iconAnchor: 'bottom',
        }}
      />
      <Images images={{ pin }} />
      </ShapeSource>
      {selectedPoint && (
          <ShapeSource
            id="selected-point"
            cluster={false} // Không cluster đối với điểm đã chọn
            shape={(selectUser && userPoint)  ? featureCollection([userPoint]) : featureCollection([selectedPoint])}
            onPress={onPointPress}
          >
        <CircleLayer
        id="cluster"
        // belowLayerID="clusters-count"
        // filter={['==', ['get', 'id'], 16]} 
        // filter={['has', 'point_count']}
        style={{
          // circlePitchAlignment: 'map',
          circleColor: '#42E100',
          circleRadius: radius*2,
          circleOpacity: 0.1,
          circleStrokeWidth: 2,
          circleStrokeColor: 'white',
        }}
      />
      
       </ShapeSource>
       
       )}
       {setPoint &&  (
        <ShapeSource
            id="point-map"
            cluster={false} // Không cluster đối với điểm đã chọn
            shape={featureCollection([setPoint])}
            
          >
           <SymbolLayer
        id="cluster-count"
        style={{
          textField: ['get', 'point_count'],
          textSize: 13,
          textColor: '#ffffff',
          textPitchAlignment: 'map',
        }}
      />

      <CircleLayer
        id="cluster"
        belowLayerID="cluster-count"
        // filter={['==', ['get', 'id'], 16]} 
        filter={['has', 'point_count']}
        style={{
          circlePitchAlignment: 'map',
          circleColor: '#42E100',
          circleRadius: 15,
          circleOpacity: 1,
          circleStrokeWidth: 2,
          circleStrokeColor: 'white',
        }}
      />

      <SymbolLayer
        id="scooter-icon"
        belowLayerID='scooter-icons'
        filter={['!', ['has', 'point_count']]}
        style={{
          iconImage: 'pin',
          iconSize: 0.4,
          iconAllowOverlap: true,
          iconAnchor: 'bottom',
        }}
      />
      <Images images={{ pin }} />
          </ShapeSource>
       )}
      {userPoint &&  (
        <ShapeSource
            id="user-map"
            cluster={false} // Không cluster đối với điểm đã chọn
            shape={featureCollection([userPoint])}
            onPress={onUserPress}
          >
           <SymbolLayer
        id="user-count"
        style={{
          textField: ['get', 'point_count'],
          textSize: 13,
          textColor: '#ffffff',
          textPitchAlignment: 'map',
        }}
      />

      <CircleLayer
        id="user"
        belowLayerID="user-count"
        // filter={['==', ['get', 'id'], 16]} 
        filter={['has', 'point_count']}
        style={{
          circlePitchAlignment: 'map',
          circleColor: '#42E100',
          circleRadius: 15,
          circleOpacity: 1,
          circleStrokeWidth: 2,
          circleStrokeColor: 'white',
        }}
      />

      <SymbolLayer
        id="user-icon"
        filter={['!', ['has', 'point_count']]}
        style={{
          iconImage: 'userimg',
          iconSize: 0.4,
          iconAllowOverlap: true,
          iconAnchor: 'bottom',
        }}
      />
      <Images images={{ userimg }} />
          </ShapeSource>
       )}
    </>
  );
}