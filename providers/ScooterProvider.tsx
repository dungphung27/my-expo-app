import * as Location from 'expo-location';
import { getDirections } from "~/services/directions";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
interface Message {
    id: number;
  createdAt: string;
  type: number;
  message: string | undefined; 
}
interface notification {
    id: number;
    created_at: string;
    message: string;
    type: number;
    state: boolean
    isSeen: boolean
}
interface marker {
  id: number;
  lat: number;
  long: number;
  name: string;
  radius: number;
  isDeleted: boolean;
  addressLocation: string;
};
interface User {
    id: number;
    lat: number;
    long: number;
    name: string;
    radius: number;
    duration: number;
    emergencyMode: boolean,
    battery: number,
    charging: boolean,
}
interface Scooter {
    long: number;
    lat: number;
    id: number;
    radius:number;
    name: string;
    isDeleted: boolean;
    addressLocation: string;
}
interface poinMap{
  lat: number;
  long: number;
  addressLocation: string;
}
interface Direction {
    routes: Array<{
        geometry: {
            coordinates: number[][];
        };
        duration: number;
        distance: number;
    }>;
}


interface ScooterContextType {
    switchValue: boolean,
    locationSearch: boolean,
    setLocationSearch: React.Dispatch<React.SetStateAction<boolean>>;
    setswitchValue:  React.Dispatch<React.SetStateAction<boolean>>
    selectUser: boolean;
    setSelectUser: React.Dispatch<React.SetStateAction<boolean>>;
    user?: User[];
    setUser: React.Dispatch<React.SetStateAction<User[] | undefined>>;
    selectedScooter?: Scooter;
    setSelectedScooter: React.Dispatch<React.SetStateAction<Scooter | undefined>>;
    direction?: Direction;
    Id: number
    setId: React.Dispatch<React.SetStateAction<number>>;
    setDirection: React.Dispatch<React.SetStateAction<Direction | undefined>>;
    directionCoordinate?: number[][];
    routeTime?: number;
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    routeDistance?: number;
    pressOption: boolean;
    setPressOption: React.Dispatch<React.SetStateAction<boolean>>;
    setPress: React.Dispatch<React.SetStateAction<boolean>>;
    close: boolean;
    setClose: React.Dispatch<React.SetStateAction<boolean>>;
    minLat?: number;
    minLng?: number;
    maxLat?: number;
    maxLng?: number;
    radius: number;
    name?: string;
    addressName?: string,
    setAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
    pointMap?: poinMap;
    savePlace: boolean;
    setSavePlace: React.Dispatch<React.SetStateAction<boolean>>;
    setPointMap: React.Dispatch<React.SetStateAction<poinMap | undefined>>;
    setName:React.Dispatch<React.SetStateAction<string | undefined>>;
    addSafeMode: boolean;
    setAddSafeMode: React.Dispatch<React.SetStateAction<boolean>>;
    zoom: number;
    isInput:boolean
    setInput: React.Dispatch<React.SetStateAction<boolean>>;
    addMode: boolean;
    setAddMode: React.Dispatch<React.SetStateAction<boolean>>;
    deleted: boolean;
    setDeleted: React.Dispatch<React.SetStateAction<boolean>>;
    setZoom: React.Dispatch<React.SetStateAction<number>>
    setRadius: React.Dispatch<React.SetStateAction<number>>
    press: boolean;
    saveSafe: boolean;
    setSaveSafe: React.Dispatch<React.SetStateAction<boolean>>;
    sliderValue: number;
    setSliderValue:React.Dispatch<React.SetStateAction<number>>
    pressSafe: boolean;
    setPressSafe: React.Dispatch<React.SetStateAction<boolean>>;
    selectedPoint?: any
    markers?: marker[]
    status: boolean,
    setStatus: React.Dispatch<React.SetStateAction<boolean>>;
    isAddress: boolean
    setIsAddress:  React.Dispatch<React.SetStateAction<boolean>>;
    setMarkers: React.Dispatch<React.SetStateAction<marker[]>>;
    setSelectedPoint: React.Dispatch<React.SetStateAction<any>>;
    setMinLat: React.Dispatch<React.SetStateAction<number | undefined >>;
    setMinLng: React.Dispatch<React.SetStateAction<number| undefined>>;
    setMaxLat: React.Dispatch<React.SetStateAction<number| undefined>>;
    setMaxLng: React.Dispatch<React.SetStateAction<number| undefined>>;
    oldStatus?: boolean;
    setOldStatus: React.Dispatch<React.SetStateAction<boolean | undefined >>; 
    listSafe: string[];
    setListSafe:  React.Dispatch<React.SetStateAction<string[] >>;
    editSdt: boolean,
    setEditSdt: React.Dispatch<React.SetStateAction<boolean>>; 
    sdt: string,
    setSdt: React.Dispatch<React.SetStateAction<string>>; 
    listNoti?: notification[],
    setListNoti: React.Dispatch<React.SetStateAction<notification[] | undefined>>;
    selectedId: number[];
    setSelectedId: React.Dispatch<React.SetStateAction<number[]>>; 

}

const ScooterContext = createContext<ScooterContextType | undefined>(undefined);

export default function ScooterProvider({ children }: PropsWithChildren) {
    const [locationSearch,setLocationSearch] =  useState(false)
    const [switchValue, setswitchValue] = useState(false)
    const [status, setStatus] = useState(false)
    const [selectedId, setSelectedId] = useState<number []>([]);
    const [user,setUser] = useState<User[] | undefined>(undefined)
    const [selectedScooter, setSelectedScooter] = useState<Scooter | undefined>(undefined);
    const [direction, setDirection] = useState<Direction | undefined>(undefined);
    const [close,setClose] = useState(false)
    const [pressSafe,setPressSafe] = useState(false)
    const [pressOption,setPressOption]= useState(false)
    const [selectedPoint, setSelectedPoint] = useState<any>(undefined);
    const [minLat,setMinLat] = useState<number | undefined>(undefined)
    const [maxLat,setMaxLat] = useState<number | undefined>(undefined)
    const [maxLng,setMaxLng] = useState<number | undefined>(undefined)
    const [minLng,setMinLng] = useState<number | undefined>(undefined)
    const [press,setPress] = useState(false)
    const [radius,setRadius] = useState(50)
    const [zoom,setZoom] = useState(0)
    const [addressName,setAddress] = useState<string | undefined>('')
    const [name,setName] = useState<string | undefined>('')
    const [saveSafe,setSaveSafe] = useState(false)
    const [deleted,setDeleted] = useState(false)
    const [markers, setMarkers] = useState<marker[]>([]);
    const [sliderValue,setSliderValue] = useState(50)
    const [addMode,setAddMode] =useState(false)
    const [addSafeMode,setAddSafeMode] = useState(false)
    const [pointMap,setPointMap] = useState <poinMap | undefined> (undefined)
    const [savePlace,setSavePlace] = useState(false)
    const [isInput,setInput] = useState(false)
    const directionCoordinate = direction?.routes?.[0]?.geometry?.coordinates;
    const routeTime =  direction?.routes?.[0]?.duration;
    const [Id,setId] = useState(0)
    const routeDistance =  direction?.routes?.[0]?.distance;
    const [isVisible, setIsVisible] = useState(false);
    const [isAddress,setIsAddress] = useState(false)
    const [selectUser,setSelectUser] = useState(false)
    const [saveDuration,setSaveDuration] = useState(false)
    const [message,setmessage] = useState('')
    const [listMessages,setListMessages] = useState  <Message[] | undefined> (undefined)
    const [oldStatus,setOldStatus] = useState <boolean | undefined> (undefined)
    const [listSafe,setListSafe] = useState([''])
    const [inMessage,setInMessage] = useState(false)
    const [selectedMessage,setSelectedMessage] = useState<Message | undefined> (undefined)
    const [editSdt,setEditSdt] = useState(false)
    const [sdt,setSdt] = useState('')
    const [listNoti,setListNoti] = useState<notification[] | undefined>(undefined) 
    useEffect(() => {
        const fetchDirection = async () => {
            const location = await Location.getCurrentPositionAsync();
            let newDirection
            if (selectUser && user)
            {
                newDirection  = await getDirections(
                [location.coords.longitude, location.coords.latitude],
                [user[0].long, user[0].lat]
            );
            setMinLng(Math.min(user[0].long, location.coords.longitude));
            setMaxLng(Math.max(location.coords.longitude, user[0].long));
            setMinLat(Math.min(location.coords.latitude, user[0].lat));
            setMaxLat(Math.max(location.coords.latitude, user[0].lat));
            } else {
                 newDirection  = await getDirections(
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
        if (selectedScooter && press==true) fetchDirection();
        else setDirection(undefined)
    }, [selectedScooter,selectUser,press]);
    
    return (
        <ScooterContext.Provider value={{ 
            user,setUser,
            selectedScooter, setSelectedScooter,
            direction,setDirection,
            directionCoordinate,
            routeTime,
            routeDistance,
            setPress,
            minLat,
            minLng,
            maxLat,
            maxLng,
            setMaxLat,
            setMaxLng,
            setMinLat,
            setMinLng,
            press,
            close,
            setClose,
            setSelectedPoint,
            selectedPoint,
            pressSafe,
            setPressSafe,
            setSliderValue,
            sliderValue,
            setSaveSafe,
            saveSafe,
            radius,
            setRadius,
            zoom,
            setZoom,
            setMarkers,
            markers,
            pressOption,
            setPressOption,
            deleted,
            setDeleted,
            addMode,
            setAddMode,
            addSafeMode,
            setAddSafeMode,
            name,
            setName,
            pointMap,
            setPointMap,
            savePlace,
            setSavePlace,
            isInput,
            setInput,
            isVisible,
            setIsVisible,
            addressName,
            setAddress,
            isAddress,
            setIsAddress,
            Id,
            setId,
            setSelectUser,
            selectUser,
            status,
            setStatus,
            oldStatus,
            setOldStatus,
            listSafe,
            setListSafe,
            switchValue,
            setswitchValue,
            locationSearch,
            setLocationSearch,
            editSdt,setEditSdt,
            sdt,setSdt,
            listNoti,setListNoti,
            selectedId,setSelectedId
        }}>
            {children}
        </ScooterContext.Provider>
    );
}

export const useScooter = () => {
    const context = useContext(ScooterContext);
    if (!context) {
        throw new Error("useScooter must be used within a ScooterProvider");
    }
    return context;
};