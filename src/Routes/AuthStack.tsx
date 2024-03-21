import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../LoginScreen';
import RegistrationScreen from '../Screens/RegistrationScreen';
import NewPasswordScreen from '../Screens/NewPasswordScreen';

export type AuthStackParamList = {
EmployeeLogin:undefined;
Register:undefined;
NewPassword:{Email:string}
}

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthStack = () =>  {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="EmployeeLogin" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegistrationScreen} />
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
      
    </Stack.Navigator>
  );
}