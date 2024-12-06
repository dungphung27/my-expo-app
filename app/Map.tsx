import FAB from '~/components/FAB';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Map from '~/components/Map';
import { useScooter } from '~/providers/ScooterProvider';
import SelectedScooterSheet from '~/components/SelectedScooterSheet';
import SheetAdd from '~/components/bottomSheetAdd';
import { PlusButton } from '~/components/plusButton';
type Props = {
  navigation: DrawerNavigationProp<any, any>; // Sử dụng đúng kiểu cho navigation
};
  
  const MapScreen: React.FC<Props> = ({ navigation }) => {
    const {addMode,selectedScooter,addSafeMode,isVisible,setIsVisible} = useScooter()
  return (
    <>
      {!addMode && !addSafeMode && !selectedScooter&&  ( 
        <PlusButton onPress={()=>{
            setIsVisible(!isVisible)
        }}/>
      )}
        <FAB onPress={() => navigation.toggleDrawer()} />
        <Map />
        <SelectedScooterSheet />
        <SheetAdd />
    </>
  );
};
export default MapScreen;