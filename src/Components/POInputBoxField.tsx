import * as React from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  View,
  
} from "react-native";
import { TextInput } from "@react-native-material/core";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard';
import { ToastAndroid } from 'react-native';


interface Props {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: any;
  numberOfLines: number;
  multiline: boolean;
  secureTextEntry: boolean;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  editable?: boolean;
  autoFocus?: boolean;
  mandatory?: boolean;
  NonEditablelabel:string;
  icon?: string;
}

const POInputBoxField: React.FC<Props> = ({
  label = "",
  placeholder = "",
  value,
  onChangeText,
  numberOfLines = 4,
  multiline = true,
  secureTextEntry = false,
  keyboardType = "default",
  maxLength = 20000,
  editable = true,
  autoFocus = false,
  mandatory = false,
  NonEditablelabel ="",
  icon = "",
}) => {
  const formattedValue = (value: any) => {
    return value ? value.toString() : "";
  };

  const handleCopyToClipboard = () => {
    Clipboard.setStringAsync(value);
    ToastAndroid.showWithGravity(
      'Copied to Clipboard',
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );
  };

const renderTrailingIcon = () => {
    if (icon === "copy") {
      return (
        <Ionicons
        name={icon}
        size={24}
        color="black"
        onPress={handleCopyToClipboard}
        />
      );
      
    }
}

  return (
    <View style={styles.container}>

        {/* <Text style={mandatory ? styles.mandatory : styles.notMandatory}> *</Text> */}
      <TextInput
        variant="standard"
        label={editable ?label :<Text style={styles.label}>{NonEditablelabel}</Text>}
        style={styles.input}
        onChangeText={onChangeText}
        numberOfLines={numberOfLines}
        multiline={multiline}
        value={formattedValue(value)}
        //placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        editable={editable}
        autoFocus={autoFocus}
        color={"#3A9EC2"}
        trailing={renderTrailingIcon()}
      />
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 10,
//   },
//   label: {
//     marginBottom: 2,
//     paddingBottom: 5,
//     fontWeight: "bold",
//     color: "#256D85",
//     fontSize:14
//   },
//   input: {
//     padding: 10,
//   },
//   mandatory: {
//     color: "red",
//   },
//   notMandatory: {
//     color: "white",
//   },
//   isReadonly: {
//     borderWidth: 1,
//     borderColor: "#256D85",
//     padding: 10,
//     borderRadius: 15,
//     backgroundColor: "#B1B1B1",
//     color: "black",
//   }
// });

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('1.3%'),
  },
  label: {
    marginBottom: hp('0.5%'),
    paddingBottom: hp('1%'),
    fontWeight: 'bold',
    color: '#256D85',
    fontSize: wp('3.6%'),
  },
  input: {
    padding: wp('0.5%'),
    marginBottom: hp('1%'),
  },
  mandatory: {
    color: 'red',
  },
  notMandatory: {
    color: 'white',
  },
  isReadonly: {
    borderWidth: 1,
    borderColor: '#256D85',
    padding: wp('2.5%'),
    borderRadius: wp('3%'),
    backgroundColor: '#B1B1B1',
    color: 'black',
  },
});

export default POInputBoxField;
