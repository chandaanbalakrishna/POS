import React, { useState } from "react";
import { KeyboardTypeOptions, StyleSheet, Text, View } from "react-native";
import { TextInput } from "@react-native-material/core";
import { Ionicons } from "@expo/vector-icons";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface Props {
  label: string;
  placeholder: string;
  value: string | number;
  onChangeText: (text: string) => void;
  secureTextEntry: boolean;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  editable?: boolean;
  autoFocus?: boolean;
  mandatory?: boolean;
  NonEditablelabel: string;
  icon?: string;
}

const POInputField: React.FC<Props> = ({
  label = "",
  placeholder = "",
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  maxLength = 20000,
  editable = true,
  autoFocus = false,
  mandatory = false,
  NonEditablelabel = "",
  icon = "",
}) => {
  const formattedValue = (value: any) => {
    return value ? value.toString() : "";
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderTrailingIcon = () => {
    if (icon === "eye") {
      const iconName = showPassword ? "eye-off" : "eye";
      return (
        <Ionicons
          name={iconName}
          size={22}
          color="black"
          onPress={togglePasswordVisibility}
        />
      );
      
    }
    else if (icon) {
      return (
        <Ionicons
          name={icon}
          size={22}
          color="black"
        />
      );
  };
}
  

  return (
    <View style={styles.container}>
      {/* {mandatory && <Text style={styles.mandatory}> *</Text>} */}
      <TextInput
        variant="standard"
        label={editable ? label : <Text style={styles.label}>{NonEditablelabel}</Text>}
        value={formattedValue(value)}
        onChangeText={onChangeText}
        //placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry && !showPassword}
        maxLength={maxLength}
        editable={editable}
        autoFocus={autoFocus}
        style={styles.input}
        color="#3A9EC2"
        trailing={renderTrailingIcon()}
        helperText=""
      />
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 10,
//   },
//   label: {
//     marginBottom: 0.5,
//     paddingBottom: 3.5,
//     fontWeight: "bold",
//     color: "#256D85",
//     fontSize: 14,
//     marginTop: 20,
//   },
//   inputContainer: {
//     borderRadius: 15,
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#256D85",
//     paddingHorizontal: 10,
//   },
//   input: {
//     //height: 55,
//     padding: 10,
//   },
//   mandatory: {
//     color: "red",
//   },
//   isReadonly: {
//     backgroundColor: "#B1B1B1",
//     //color: "black",
//   },
// });

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('1%'),
  },
  label: {
    marginBottom: hp('0.5%'),
    paddingBottom: hp('3.5%'),
    fontWeight: 'bold',
    color: '#256D85',
    fontSize: wp('4%'),
    marginTop: hp('2.5%'),
  },
  inputContainer: {
    borderRadius: wp('7%'),
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#256D85',
    paddingHorizontal: wp('2.5%'),
    marginTop: hp('0.5%'),
  },
  input: {
    padding: wp('0%'),
    marginTop:hp('1.2%'),
    marginLeft:wp('0.5%')
  },
  mandatory: {
    color: 'red',
  },
  isReadonly: {
    backgroundColor: '#B1B1B1',
  },
});
export default POInputField;
