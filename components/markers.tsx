import { Camera, CircleLayer, Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { featureCollection, point } from '@turf/helpers';
// import messaging from '@react-native-firebase/messaging';
import { useEffect, useRef, useState } from 'react';
import pin from '~/assets/pin.png';
import { getAddress } from '~/services/address';
import { useScooter } from '~/providers/ScooterProvider';
import { supabase } from '~/lib/supabase';
// i
export default function ScooterMarkers() {
  const {Id,addressName,isAddress,setIsAddress,setAddress,setSavePlace,name,setPointMap,addSafeMode,addMode,savePlace,pointMap,deleted,pressOption,pressSafe,markers,setMarkers,press,sliderValue,saveSafe,radius,setPressSafe,setSelectedPoint,selectedPoint,close,setPress,setSelectedScooter,setSliderValue,selectedScooter,minLat,minLng,maxLat,maxLng } = useScooter();
  function getRandomInt(min:number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  useEffect(()=>{
    if(saveSafe)
    {
      markers?.forEach(m =>{
    if (m.id == selectedScooter?.id)
    {
      m.radius = sliderValue
    }
  })
    }
  },[saveSafe])
  if(saveSafe)
    {
      markers?.forEach(m =>{
    if (m.id == selectedScooter?.id)
    {
      m.radius = sliderValue
    }
  })
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
  const points = markers
  ?.filter((scooter) => scooter.isDeleted == false) // Lọc các phần tử có isDeleted = 0
  .map((scooter) => point([scooter.long, scooter.lat], { scooter })) || [];
  const camera = useRef<Camera>(null)
  const onPointPress = async (event: OnPressEvent) => {
    if (event.features[0].properties?.scooter && !addMode) {
      // console.log(event.features[0].properties.scooter.a)
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
    }
  };
  
  useEffect(()=>{
    if(!press && selectedScooter && !pressSafe && !pressOption)
    {
      handleMapPress(selectedScooter.long,selectedScooter.lat)
    }
  },[press,pressSafe,pressOption])
  const handleMapPress = (long: number,lat:number) => {
    if (camera.current ) {
      console.log(long,lat)
      camera.current.setCamera({
        centerCoordinate: [long, lat], // Tọa độ trung tâm
        zoomLevel: 16, // Mức độ zoom
        animationMode: 'easeTo', // Hiệu ứng
        animationDuration: 500, // Thời gian hiệu ứng (ms)
      });
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
    <Camera ref={camera}  />
    
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
            shape={featureCollection([selectedPoint])}
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
    </>
  );
}