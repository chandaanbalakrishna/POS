import { LoginRequest } from "../Models/Login/LoginRequest";
import { LoginResponse } from "../Models/Login/LoginResponse";
import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import http from "../Common/HttpCommon";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { Ionicons } from '@expo/vector-icons';

type AuthContextData = {
  loading: boolean;
  loginData?: LoginResponse;
  error?: string;
  loginResponse?: Response;
  signIn(loginRequest: LoginRequest): Promise<any>;
  signOut(): void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [loginData, setLoginData] = useState<LoginResponse>();
  const [applicationNumber, setApplicationNumber] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadStorageData();
    //getLoggedApplicationNumber();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      const loginDataSerialized = await AsyncStorage.getItem("@LoginData");


      if (loginDataSerialized) {
        const _authData: LoginResponse = JSON.parse(loginDataSerialized);
        setLoginData(_authData);
        // setApplicationNumber((loginData?.applicationNumber!) ? (JSON.stringify(loginData?.applicationNumber!)).replace(/['"]+/g, '') : '' );
        console.log("Auth Data : ", _authData);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (loginRequest: LoginRequest) => {
    setLoading(true);
    setError("");
    http
      .post<LoginResponse>("/Auth/Login", loginRequest)
      .then((response) => {
        debugger;
        setLoading(false);
        setLoginData(response.data);
        AsyncStorage.setItem("@LoginData", JSON.stringify(response.data));
        showMessage({
          message: 'Login Successfully!',
          type: 'success',
          duration: 3000,
          floating: true,
          icon: () => (
            <Ionicons name="checkmark-circle-outline" size={20}/>
          ),
        });
        // AsyncStorage.setItem("@GKUserApplicationNumber", JSON.stringify(verifyPhoneRequest));
      })
      .catch((error) => {
        setLoading(false);
        setError(error.response.data);
        showMessage({
          message: error.response.data,
          type: 'danger',
          duration: 3000,
          floating: true,
          icon: () => (
            <Ionicons name="alert-circle-outline" size={20} />
          ),
        });
      });
  };
  
 
 
  const signOut = async () => {
    //Remove data from context, so the App can be notified
    //and send the user to the AuthStack
    setLoginData(undefined);
    //Remove the data from Async Storage
    //to NOT be recoverede in next session.
    await AsyncStorage.removeItem("@LoginData");
    showMessage({
      message: 'Logout Successfully!',
      type: 'success',
      duration: 3000,
      floating: true,
      icon: () => (
        <Ionicons name="checkmark-circle-outline" size={20}/>
      ),
    });
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        loginData,
        error,
        signIn,
        signOut
      }}
    >
      { children }
      <FlashMessage position="top" style ={{height:60,marginTop:40}} textStyle ={{marginTop:10,fontSize:18}}/>
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { AuthContext, AuthProvider, useAuth };
