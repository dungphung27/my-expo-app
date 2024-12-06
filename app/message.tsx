import { View, Text } from 'react-native';
import FAB from '~/components/FAB';
import { DrawerNavigationProp } from '@react-navigation/drawer';
type Props = {
  navigation: DrawerNavigationProp<any, any>; // Sử dụng đúng kiểu cho navigation
};

const Message: React.FC<Props> = ({ navigation }) => {
  return (
    <View >
        <FAB onPress={() => navigation.toggleDrawer()} />
       <Text >Profile Screen</Text>
    </View>
  );
};
export default Message;
