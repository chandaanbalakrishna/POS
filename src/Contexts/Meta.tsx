
import { createContext, useContext, useEffect, useState } from "react";
import {
  Alert, Platform,
} from "react-native";
import { useAxios } from "./Axios";
import i18n from "i18n-js";
import { useAuth } from "./Auth";

type MetaContextData = {
  loading: boolean;
  error?: string;
};

const MetaContext = createContext<MetaContextData>({} as MetaContextData);

const MetaProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const axios = useAxios();
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  

  const refresh = () => {
    // loadApplicationDetails();
    // loadOffices();
  };

  


  return (
    <MetaContext.Provider
      value={{loading, error}}
    >
      {children}
    </MetaContext.Provider>
  );
};

function useMeta(): MetaContextData {
  const context = useContext(MetaContext);

  if (!context) {
    throw new Error("useMeta must be used within an MetaProvider");
  }

  return context;
}

export { MetaContext, MetaProvider, useMeta };
