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
import SafeMarker from './SafeMarker';
export default function ScooterMarkers() {
  const {Id,addressName,oldStatus,listNoti,load,setLoad,setListNoti,setStrSafeArea,setUser,setLocationSearch,setUserDistance,safeZoneMode,locationSearch,userAddress,setUserAddress,listSafe,setListSafe,setOldStatus,setStatus,setSavePlace,selectUser,setSelectUser,user,name,setPointMap,addSafeMode,addMode,savePlace,pointMap,deleted,pressOption,pressSafe,markers,press,sliderValue,saveSafe,radius,setPressSafe,setSelectedPoint,listSafeMarker,setListSafeMarker,selectedPoint,close,setPress,setSelectedScooter,setSliderValue,selectedScooter,minLat,minLng,maxLat,maxLng } = useScooter();
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
              let long = payload.new.long,lat = payload.new.lat
              await getAddress(long,lat)
              .then(data =>{
                setUserAddress(data)
              })
              .catch(error =>{
                setUserAddress("Underfined address")
                console.log(error)
              })
              handleMapPress(payload.new.long,payload.new.lat,payload.new.radius);
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
    getAddress(user[0].long,user[0].lat)
      .then(data =>{
        setUserAddress(data)
      })
      .catch(error =>{
        setUserAddress("Underfined address")
        console.log(error)
      })
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

    if(user && (!selectUser || locationSearch))
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
    
  },[user,locationSearch])
 
  const points = markers
  ?.filter((scooter) => scooter.isDeleted == false) // Lọc các phần tử có isDeleted = 0
  .map((scooter) => point([scooter.long, scooter.lat], { scooter })) || [];
  const camera = useRef<Camera>(null)
  const onPointPress = async (event: OnPressEvent) => {
    if(!selectedScooter)
    {
      if (event.features[0].properties?.scooter && !addMode) {
      let long = event.features[0].properties.scooter.long,lat = event.features[0].properties.scooter.lat,radius = event.features[0].properties.scooter.radius
      setSelectedScooter(event.features[0].properties.scooter);
      setSliderValue(event.features[0].properties.scooter.radius)
      setPress(false)
      setPressSafe(false)
      handleMapPress(long,lat,radius)
      setSelectedPoint(point([long, lat])); 
      setSelectUser(false)
    }
    }
    
  };
  const onUserPress = async (event: OnPressEvent) =>{
    console.log(JSON.stringify(event.features[0].properties?.user[0],null,2))

    if(event.features[0].properties?.user[0] && !addMode)
    {
      let long = event.features[0].properties?.user[0].long, lat = event.features[0].properties?.user[0].lat;    
      let radius = event.features[0].properties.user[0].radius
      setSelectedScooter({
        ...event.features[0].properties?.user[0], 
        addressLocation : userAddress, 
      });
      setSliderValue(event.features[0].properties.user[0].radius)
      setSelectUser(true)
      setPress(false)
      setPressSafe(false)
      handleMapPress(user![0].long,user![0].lat,radius)
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
        setStrSafeArea(message)
        alert(message)
        setOldStatus(b)
  }
}
  useEffect(() => {
  let interval: NodeJS.Timeout | undefined; // Định nghĩa biến interval trong phạm vi của useEffect

  const getLocation = async () => {
    let currentLocation = await Location.getCurrentPositionAsync();
    let distance = haversineDistance(
      user![0].lat,
      user![0].long,
      currentLocation.coords.latitude,
      currentLocation.coords.longitude
    );
    setUserDistance(distance);
    console.log(distance);
  };

  if (safeZoneMode) {
    interval = setInterval(getLocation, 10000); // Chạy lại mỗi 10 giây
  }

  return () => {
    if (interval) {
      clearInterval(interval); // Dọn dẹp interval khi unmount hoặc safeZoneMode thay đổi
    }
  };
}, [safeZoneMode]);

  const checkIsInSafeArea = async () =>{
       let listArea : string[] = []
        let tmp : string[] = []
        let listSafeArea : any[] = []
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
          const newMarker = {
            id: marker.id,
            lat: marker.lat,
            long: marker.long,
            radius: marker.radius,
            name: marker.name,
            distance: distance
          }
          listSafeArea =[...listSafeArea,newMarker]
        }
      })
      console.log(listSafeArea)
      let currentLocation = await Location.getCurrentPositionAsync();
      let distance = haversineDistance(user![0].lat,user![0].long,currentLocation.coords.latitude,currentLocation.coords.longitude)
      setListSafeMarker(listSafeArea)
      setUserDistance(distance)
      console.log(listSafeMarker)
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
  },[user,markers,safeZoneMode])
    
  useEffect(()=>{
    if(!press && selectedScooter && !pressSafe && !pressOption )
    {
      if (selectUser)
      {
        handleMapPress(user![0].long,user![0].lat,user![0].radius)
      } else{
        handleMapPress(selectedScooter.long,selectedScooter.lat,selectedScooter.radius)
      }
      
    }
  },[press,pressSafe,pressOption])
  const handleMapPress = (long: number,lat:number,radius: number) => {
    if (camera.current ) {
      camera.current.setCamera({
        centerCoordinate: [long, lat], // Tọa độ trung tâm
        zoomLevel: 16 - Math.log2(radius / 200), // Mức độ zoom
        animationMode: 'flyTo', // Hiệu ứng
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
        animationMode: 'flyTo', // Hiệu ứng
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
    {!safeZoneMode && points && (
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

     )}   
    {safeZoneMode   && listSafeMarker?.map((m:any)=>(
          <SafeMarker Marker={m} /> 
        ))}
       {selectedPoint &&!safeZoneMode && (
          <ShapeSource
            id="selected-point"
            cluster={false} // Không cluster đối với điểm đã chọn
            shape={(selectUser && userPoint)  ? featureCollection([userPoint]) : featureCollection([selectedPoint])}
            onPress={onPointPress}
          >
        <CircleLayer
        id="cluster"
        style={{
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
      {userPoint  &&  (
        <ShapeSource
            id="user-map"
            cluster={false} // Không cluster đối với điểm đã chọn
            shape={featureCollection([userPoint])}
            onPress={onUserPress}
          >
           
      <SymbolLayer
        id="user-icon"
        // aboveLayerID="cluster-point"
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