import React from 'react';
import PhoneRegistration from '../Auth/PhoneRegistration';
import Register from '../Auth/Register';
import Login from '../Auth/Login';
import {createStackNavigator} from '@react-navigation/stack';
import VerifyPhone from '../Auth/VerifyPhone';

export default function Route() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="VerifyPhone" component={VerifyPhone} />
    </Stack.Navigator>
  );
}
