import React from 'react';
import DrawerNavigator from './DrawerNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { Stack } from 'expo-router';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home',headerShown: false }} />
      <NavigationContainer independent={true}>
        <DrawerNavigator />
      </NavigationContainer>
    </>
  );
}
