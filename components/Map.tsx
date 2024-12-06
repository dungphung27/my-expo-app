import Mapbox, { LocationPuck, MapView } from '@rnmapbox/maps';
import { useScooter } from '~/providers/ScooterProvider';
import ScooterMarkers from './markers';
import LineRoute from './LineRoute';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { supabase } from '~/lib/supabase';

import { useEffect, useRef, useState } from 'react';
import Dropdown from './DropDown';
import { getAddress } from '~/services/address';

const LOCATION_TASK_NAME = 'background-location-task';

const requestPermissions = async () => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === 'granted') {
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    // Xử lý logic nếu cần
  }
};

Mapbox.setAccessToken('pk.eyJ1IjoiZHVuZ3BodW5nMjcwOSIsImEiOiJjbTNybXozeHMwNXIxMnJzYmFiNWxxM3lyIn0.RJjcATnxHqamjd1n8KgHmQ');

export default function Map() {
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
};

  // Khai báo kiểu cho mapRef để TypeScript nhận diện đúng
  const mapRef = useRef<MapView | null>(null); // Tham chiếu tới MapView
  const { pointMap,addSafeMode,setAddress,setPointMap,setMarkers,setZoom,sliderValue,setRadius,directionCoordinate, selectedScooter } = useScooter();
  useEffect(() => {
    // Yêu cầu quyền khi component mount
    requestPermissions();
  }, []);  
  const handleRegionChange = async () => {
   if (mapRef.current) {
      const zoom = await mapRef.current.getZoom();
      setZoom(zoom)
      const metersPerPixel = 156543.03392 * Math.cos(0 * Math.PI / 180) / Math.pow(2, zoom); // Đơn giản hóa công thức
      const pixelRadius = sliderValue / metersPerPixel;
      setRadius(pixelRadius)
    }
  };
  const getA = async (long: number,lat:number) =>{
            let s = await getAddress(long,lat)
            setAddress(s)
            }
  return (
    <MapView
      ref={mapRef} // Gán ref cho MapView
      style={{ flex: 1 }}
      scaleBarEnabled={false}
      styleURL="mapbox://styles/mapbox/dark-v11"
      onRegionIsChanging={handleRegionChange}
      onPress={(event) =>{
       if (event.geometry.type === 'Point' && addSafeMode ) {
          const coordinates = event.geometry.coordinates; // Lấy tọa độ
            getA(coordinates[0],coordinates[1])
          setPointMap({long: coordinates[0],lat: coordinates[1],addressLocation:''})
          console.log('Bạn đã nhấn vào tọa độ:', coordinates);
          console.log(pointMap)
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