import { createDrawerNavigator } from '@react-navigation/drawer';
import MapScreen from './Map';
import Message from './message';
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
        },
      })}
    >
      <Drawer.Screen name="Map" component={MapScreen} />
      <Drawer.Screen name="Message" component={Message} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;