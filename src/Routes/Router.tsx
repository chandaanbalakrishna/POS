
import React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

import { AuthStack } from "./AuthStack";
import { useAuth } from "../Contexts/Auth";
import { Roles } from "../Constants/Roles";
import { EmployeeStack } from "./EmployeeStack";
import { AdminStack } from "./AdminStack";
import Footer from "../Components/Footer";
import info from "expo-constants";
import { useAxios } from '../Contexts/Axios';
import { Appversion } from "../Models/VersionCode";

export const Router = () => {
  const { loginData} = useAuth();
  const axios = useAxios();
  const [versionCode,setVersionCode] = React.useState<string>("");
  const [Appversion,setAppversion] = React.useState<boolean>(false);

  const checkAppVersion = async () => {
    try {
      const version = info.manifest?.version;
      const loadConnectionList = async () => {
        
        await axios.privateAxios .get<Appversion>("/app/Common/GetAPPversion?VersionCode="+version)
            .then((response) => {
              
              setVersionCode(response.data.versionCode)
              if(version === response.data.versionCode){
                setAppversion(false);
              }
                else {
                  setAppversion(true);
                }
            })
            .catch((error) => {
                console.log(error.response.data);
            });
          }
          loadConnectionList()
    } catch (error) {
      console.error("Error checking app version:", error);
    }
  };
  const loggedInRole = (role: string) => {
    checkAppVersion()
    debugger;
    if (Appversion == true) {
      alert("This Version Of APK is Expired.Please Download the New APK.")
      return <AuthStack />
    }
    if (role === Roles.Employee)
      return <EmployeeStack />
    if (role === Roles.Admin)
      return <AdminStack />
    else
      return <AuthStack />
  };
  return (
    <NavigationContainer>
      {loginData ? loggedInRole(loginData.userRoles) : <AuthStack />}
      {loginData ? <Footer /> :""}
    </NavigationContainer>
  );
};
