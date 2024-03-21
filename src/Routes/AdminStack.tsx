import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/AdminHomeScreen';
import ProjectScreen from '../Screens/AdminScreens/ProjectScreen';
import TeamScreen from '../Screens/AdminScreens/TeamScreen';
import TeamDetailsScreen from '../Screens/AdminScreens/TeamDetailsScreen';
import ProjectStatisticsScreen from '../Screens/AdminScreens/ProjectStatisticsScreen';
import EmployeeTaskScreen from '../Screens/AdminScreens/EmployeeTaskScreen';
import EmployeeAttendanceScreen from '../Screens/AdminScreens/EmployeeAttendenceScreen';

export type AdminStackParamList = {
  Home: undefined;
  Project: undefined;
  Team: undefined;
  TeamDetails: { TeamId: number };
  ProjectStatistics: { ProjectId: number, Name: string, Description: string };
  EmployeeTask: { EmployeeName: string, EmployeeId: number, WeekEndDate: string };
  EmployeeAttendance:{EmployeeId: number};
}

const Stack = createStackNavigator<AdminStackParamList>();

export const AdminStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Project" component={ProjectScreen} />
      <Stack.Screen name="Team" component={TeamScreen} />
      <Stack.Screen name="TeamDetails" component={TeamDetailsScreen} />
      <Stack.Screen name="ProjectStatistics" component={ProjectStatisticsScreen} />
      <Stack.Screen name="EmployeeTask" component={EmployeeTaskScreen} />
      <Stack.Screen name="EmployeeAttendance" component={EmployeeAttendanceScreen} />

    </Stack.Navigator>
  );
}