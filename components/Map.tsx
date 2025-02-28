import Mapbox, { LocationPuck, MapView } from '@rnmapbox/maps';
import { useScooter } from '~/providers/ScooterProvider';
import ScooterMarkers from './markers';
import LineRoute from './LineRoute';
import * as Location from 'expo-location';
import { supabase } from '~/lib/supabase';
import { useEffect, useRef, useState } from 'react';
import Dropdown from './DropDown';
import { getAddress } from '~/services/address';
const LOCATION_TASK_NAME = 'background-location-task';
const requestPermissions = async () => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === 'granted') {
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus === 'granted') {

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                  accuracy: Location.Accuracy.Balanced,
              });
    }
  }
};
const updateUser = async (lat: number,long:number) => {
  const { data, error } = await supabase
    .from('userdata') // Tên bảng trong database
    .update({ long: long, lat: lat }) // Cập nhật giá trị cột `radius`
    .eq('id', 1); // Điều kiện để tìm dòng có id = 16

  if (error) {     
    console.error('Lỗi khi cập nhật radius:', error.message);
    return;
  }
  console.log('Cập nhật thành công:');
};

const updateLocation = async () => {
  try {
    let currentLocation = await Location.getCurrentPositionAsync();
    console.log('Vị trí:', currentLocation.coords.latitude, currentLocation.coords.longitude);
    updateUser(currentLocation.coords.latitude, currentLocation.coords.longitude);
  } catch (err) {
    console.error('Lỗi khi lấy vị trí:', err);
  }
};

setTimeout(()=>{
  updateLocation();
},2000) 
setInterval(updateLocation, 30000);
Mapbox.setAccessToken('pk.eyJ1IjoiZHVuZ3BodW5nMjcwOSIsImEiOiJjbTNybXozeHMwNXIxMnJzYmFiNWxxM3lyIn0.RJjcATnxHqamjd1n8KgHmQ');
export default function Map() {
  const sortMessagesById = (messages: any ) => {
  return messages.sort((a:any, b: any) => b.id - a.id);
};
  const fetchSdt = async   () => {
  const { data, error } = await supabase
    .from('phoneNumber') // Tên bảng trong database
    .select('*'); // Lấy tất cả các cột

  if (error) {
    console.error('Lỗi khi lấy dữ liệu:', error.message);
    return;
  }
  console.log('Dữ liệu lấy được:', JSON.stringify(data,null,2) );
  setSdt(data[0].sdt)
}

  
const fetchNoti = async   () => {
  const { data, error } = await supabase
    .from('notifications') // Tên bảng trong database
    .select('*'); // Lấy tất cả các cột

  if (error) {
    console.error('Lỗi khi lấy dữ liệu:', error.message);
    return;
  }
  console.log('Dữ liệu lấy được:', JSON.stringify(data,null,2) );
  setListNoti(sortMessagesById(data))
  
};
  const fetchLocations = async   () => {
  const { data, error } = await supabase
    .from('markerdata') // Tên bảng trong database
    .select('*'); // Lấy tất cả các cột

  if (error) {
    console.error('Lỗi khi lấy dữ liệu:', error.message);
    return;
  }
  console.log('Dữ liệu lấy được:', data);
  setMarkers(data)
  fetchUser()
  fetchNoti()
  fetchSdt()
};
const { pointMap,setSdt,setListNoti,addSafeMode,pxPerMeter,setPxPerMeter,setAddress,setPointMap,setMarkers,setZoom,sliderValue,setRadius,directionCoordinate,setUser, selectedScooter } = useScooter();
const fetchUser = async ()=>{
  const { data, error } = await supabase
    .from('userdata') // Tên bảng trong database
    .select('*') // Lấy tất cả các cột
    .eq('id', 2); // Lọc theo id = 2
  if (error) {
    console.error('Lỗi khi lấy dữ liệu:', error.message);
    return;
  }  
  
  console.log('Dữ liệu lấy được:', JSON.stringify(data,null,2));
  setUser(data)
}
  const mapRef = useRef<MapView | null>(null); // Tham chiếu tới MapView
  
  useEffect(() => {
    requestPermissions();
  }, []);  
  const handleRegionChange = async () => {
   if (mapRef.current) {
      const zoom = await mapRef.current.getZoom();
      setZoom(zoom)
      const metersPerPixel = 156543.03392 * Math.cos(0 * Math.PI / 180) / Math.pow(2, zoom); // Đơn giản hóa công thức
      const pixelRadius = sliderValue / metersPerPixel;
      setRadius(pixelRadius)
      setPxPerMeter(metersPerPixel)
    }
  };
  const getA = async (long: number,lat:number) =>{
             await getAddress(long,lat)
             .then(data =>{
              setAddress(data)
             })
             .catch(error =>{
              setAddress("Underfined address")
             })
            }
  return (
    <MapView
      ref={mapRef} // Gán ref cho MapView
      style={{ flex: 1 }}
      scaleBarEnabled={true}
      styleURL="mapbox://styles/mapbox/navigation-night-v1"
      onRegionIsChanging={handleRegionChange}
      onPress={(event) =>{
       if (event.geometry.type === 'Point' && addSafeMode ) {
          const coordinates = event.geometry.coordinates; // Lấy tọa độ
          getA(coordinates[0],coordinates[1])
          setPointMap({long: coordinates[0],lat: coordinates[1],addressLocation:''})
          console.log('Bạn đã nhấn vào tọa độ:', coordinates);
        } 
    }}
      onDidFinishLoadingMap={fetchLocations}
>
      <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />
      <ScooterMarkers />
      {!selectedScooter && (<Dropdown/>)}
      {directionCoordinate && <LineRoute coordinates={directionCoordinate} />}
    </MapView>
  );
}