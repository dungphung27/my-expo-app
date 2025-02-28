import { createDrawerNavigator, DrawerContentComponentProps ,DrawerContentScrollView} from '@react-navigation/drawer';
import MapScreen from './Map';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import Noti from './notifications';
 import HorizontalScrollView from '~/components/test'
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        drawerStyle: {
          backgroundColor: '#000', // Màu nền của Drawer (đen)
          width: 250,
        },
        drawerType: 'front', // Drawer chồng lên màn hình chính
        headerShown: false, // Ẩn header mặc định của Drawer
        drawerActiveTintColor: '#A9A9A9', // Màu mục được chọn (xám)
        drawerInactiveTintColor: '#FFF', // Màu chữ mục không được chọn (trắng)
        drawerLabelStyle: {
          fontSize: 16, // Kích thước chữ trong Drawer
          marginLeft: -20
        },
        
      })}  
    >
      <Drawer.Screen name="Map" component={MapScreen}  listeners={{
    }}
      options={{
        drawerIcon: ({size,color}) =>(
          <FontAwesome name="map-marker" size={size} color={color} />
        )
      }}
    />
   <Drawer.Screen
    name="Notifications"
    component={Noti}
    options={{
      headerShown: true, // Hiển thị header chỉ cho màn hình "Message"
      headerTintColor: 'black', // Màu chữ của header
      headerTitleStyle: {
        fontSize: 20, // Kích thước chữ của tiêu đề
      },
      headerStyle: {
        borderBottomWidth: 0.5,  // Độ dày của gạch ngang
        borderBottomColor: 'grey',  // Màu của gạch ngang
      },
      drawerIcon: ({size,color}) =>(
          <Ionicons name="notifications" size={size} color={color} />
        )
    }}
  />
    </Drawer.Navigator>
    
  );
}

export default DrawerNavigator;