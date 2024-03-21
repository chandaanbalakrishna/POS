import axios, { AxiosInstance } from "axios";
import { createContext, useContext } from "react";
import { Constants } from "../Constants/Constants";
import { useAuth } from "./Auth";

type AxiosContextData = {
  publicAxios: AxiosInstance;
  privateAxios: AxiosInstance;
};

const AxiosContext = createContext<AxiosContextData>({} as AxiosContextData);

const AxiosProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const auth = useAuth();

  const publicAxios = axios.create({
    baseURL: Constants.BASE_URL,
    headers: {
      "Content-type": "application/json",
    },
  });

  const privateAxios = axios.create({
    baseURL: Constants.BASE_URL,
    headers: {
      "Content-type": "application/json",
    },
  });

  privateAxios.interceptors.request.use(
    (config) => {
      if (!config.headers!.Authorization) {
        config.headers!.Authorization = `Bearer ${auth.loginData?.token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return (
    //This component will be used to encapsulate the whole App,
    //so all components will have access to the Context
    <AxiosContext.Provider value={{ publicAxios, privateAxios }}>
      {children}
    </AxiosContext.Provider>
  );
};

function useAxios(): AxiosContextData {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error("useAxios must be used within an AxiosProvider");
  }

  return context;
}

export { AxiosContext, AxiosProvider, useAxios };
