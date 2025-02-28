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
import { View } from 'react-native';
type marker = {
    id: number;
    lat: number;
    long: number;
    name: string;
    radius: number;
    distance: number;
}
export type markerProps = {
    Marker: marker;
}
 const SafeMarker = (props: markerProps)  =>{
    const {zoom,pxPerMeter} = useScooter()
   
    const {Marker} = props
    let areaPoint =  point([Marker.long,Marker.lat],{Marker}) || undefined;
    return (
        <ShapeSource 
            id={`safeMarker${Marker.id}`} 
            cluster={false} // Không cluster đối với điểm đã chọn
            shape={featureCollection([areaPoint])}>
             <SymbolLayer
                id={`safe-icon${Marker.id}`}
                style={{
                iconImage: 'pin',
                iconSize: 0.4,
                iconAllowOverlap: true,
                iconAnchor: 'bottom',
                }}
            />
            <CircleLayer
                id={`circle${Marker.id}`}
                style={{
                circleColor: '#42E100',
                circleRadius: Marker.radius*2/pxPerMeter,
                circleOpacity: 0.1,
                circleStrokeWidth: 2,
                circleStrokeColor: 'white',
                }}
            />
       <Images images={{ pin }} />
        </ShapeSource>
    )
}
export default SafeMarker