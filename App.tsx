import React, { useEffect } from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LocaleProvider } from "./src/Contexts/Locale";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider } from "./src/Contexts/Auth";
import { Router } from "./src/Routes/Router";
import { AxiosProvider } from "./src/Contexts/Axios";
import { MetaProvider } from "./src/Contexts/Meta";
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import  InternetCheckScreen from "./src/Components/InternetCheckScreen"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import BackgroundNotificationScheduler from './src/Components/BackgroundNotificationScheduler';

const App: React.FC = () => {
  return (
    <LocaleProvider>
      <AuthProvider>
        <AxiosProvider>
          <MetaProvider>
            <SafeAreaProvider>      
              <View  style={styles.container}> 
              <StatusBar style="auto" />
                 <InternetCheckScreen/>
                  <Router />
                  <BackgroundNotificationScheduler/>
              </View>
            </SafeAreaProvider>
          </MetaProvider>
        </AxiosProvider>
      </AuthProvider>
    </LocaleProvider>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#3A9EC2",
//   },
//   shell: {
//     flex: 1,
//     borderColor: "#8FE3CF",
//     borderLeftWidth: 5,
//     borderRightWidth: 5,
//     borderBottomWidth: 5,
//   },
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A9EC2',
  },
  shell: {
    flex: 1,
    borderColor: '#8FE3CF',
    borderLeftWidth: wp('1.3%'),
    borderRightWidth: wp('1.3%'),
    borderBottomWidth: wp('1.3%'),
  },
});

export default App;