
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import i18n from "i18n-js";
import * as Updates from "expo-updates";

type LocaleContextData = {
  locale: string;
  changeLocale: Function;
};

const LocaleContext = createContext<LocaleContextData>({} as LocaleContextData);

const LocaleProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    AsyncStorage.getItem("@Locale")
      .then((data) => {
        if (data === null) {
          changeLocale("en");
        } else {
          setLocale(data);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const changeLocale = (locale: string) => {
    setLocale(locale);
    i18n.locale = locale;
    AsyncStorage.setItem("@Locale", locale);
    Updates.reloadAsync();
  };

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

function useLocale(): LocaleContextData {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within an LocaleProvider");
  }

  return context;
}

export { LocaleContext, LocaleProvider, useLocale };
