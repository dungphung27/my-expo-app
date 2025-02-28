import FAB from '~/components/FAB';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Map from '~/components/Map';
import { useScooter } from '~/providers/ScooterProvider';
import SelectedScooterSheet from '~/components/SelectedScooterSheet';
import SheetAdd from '~/components/bottomSheetAdd';
import { PlusButton } from '~/components/plusButton';
import { LocationButton } from '~/components/locationButton';
import { CloseButton } from '~/components/closeButton';
import { InfoButton } from '~/components/InfoButton';

type Props = {
  navigation: DrawerNavigationProp<any, any>; // Sử dụng đúng kiểu cho navigation
};
  
  const MapScreen: React.FC<Props> = ({ navigation }) => {
    const {addMode,user,selectedScooter,setSafeZoneMode,setListSafeMarker,setPressInfo,setLocationSearch,listSafeMarker,safeZoneMode,addSafeMode,isVisible,setIsVisible} = useScooter()
  return (
    <>
      {!addMode && !addSafeMode && !selectedScooter&& !safeZoneMode &&  ( 
        <> 
        <PlusButton onPress={()=>{
            setIsVisible(!isVisible)
        }}/>
        
        </>
      )}
      {user && !addMode && !addSafeMode && !selectedScooter &&(
          <LocationButton onPress={()=>{
            setLocationSearch(true)
            
          }
          } />

        )}
      {safeZoneMode &&( 
         <>
            <CloseButton onPress={() => {setSafeZoneMode(false)
              console.log(listSafeMarker)
              setLocationSearch(true)
            }}/>
            <InfoButton  onPress={()=>{
              setPressInfo(true)
            }}/>
         </>
         )  }
        <FAB onPress={() => navigation.toggleDrawer()} />
        <Map />
        <SelectedScooterSheet />
        <SheetAdd />
    </>
  );
};
export default MapScreen;