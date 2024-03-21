import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from '@react-native-material/core';
import { Ionicons } from '@expo/vector-icons';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  label: string;
  placeholder?: string;
  data: Option[];
  value: string | number;
  disable: boolean;
  open: boolean;
  setValue: React.Dispatch<React.SetStateAction<string | number>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onChange?: (value: string | number) => void;
  mandatory?: boolean;
}

const DropDown: React.FC<Props> = ({
  label = '',
  placeholder = '',
  data,
  disable = false,
  setValue,
  value,
  open,
  onChange,
  mandatory = false,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionSelection = (option: Option) => {
    setValue(option.value);
    setShowOptions(false);
    if (onChange) {
      onChange(option.value);
    }
  };

  return (
    <>
      {/* <Text style={styles.label}>
        {label} */}
        <Text style={mandatory ? styles.mandatory : styles.notMandatory}> *</Text>
      {/* </Text> */}

      <TouchableOpacity onPress={toggleOptions}>
          <TextInput
            variant="standard"
            label={label}
            value={value.toString()}
            editable={false}
            style={styles.input}
            color="#3A9EC2"
            trailing={<Ionicons name="caret-down-outline" size={22} color="black"/>}
          />
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.optionsContainer}>
            <ScrollView style={styles.optionsScrollView}   nestedScrollEnabled={!open}>
          {data.map((item) => (
            <TouchableOpacity
              key={item.value.toString()}
              style={styles.option}
              onPress={() => handleOptionSelection(item)}
            >
              <Text>{item.label}</Text>
            </TouchableOpacity>
          ))}
          </ScrollView>
        </View>
      )}
    </>
  );
};

// const styles = StyleSheet.create({
//   label: {
//     marginBottom: 0.5,
//     paddingBottom: 3.5,
//     fontWeight: 'bold',
//     color: '#256D85',
//   },
//   mandatory: {
//     color: 'red',
//   },
//   notMandatory: {
//     color: '#f0f0f0',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#256D85',
//     borderRadius: 15,
//     paddingHorizontal: 10,
//     marginTop: 6,
//     marginBottom: 10,
//   },
//   input: {
//     flex: 1,
//     color: 'gray',
//     fontSize: 16,
//     padding: 10,
//   },
//   optionsContainer: {
//     backgroundColor: '#fff', // Set the background color to black
//     borderRadius: 10,
//     marginTop: 6,
//     maxHeight: 200,
//     elevation: 2,
//     borderColor: '#000', // Set the border color to black
//     borderWidth: 1, // Set the width of the border (optional)
//   },
  
//   option: {
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//   },
// });
const styles = StyleSheet.create({
  label: {
    marginBottom: hp('0.5%'),
    paddingBottom: hp('3.5%'),
    fontWeight: 'bold',
    color: '#256D85',
    fontSize: wp('3.5%'),
  },
  mandatory: {
    color: 'red',
  },
  notMandatory: {
    color: '#f0f0f0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#256D85',
    borderRadius: wp('5%'),
    paddingHorizontal: wp('2.5%'),
    marginTop: hp('0.6%'),
    marginBottom: hp('1%'),
  },
  input: {
    flex: 1,
    color: 'gray',
    fontSize: wp('4%'),
    padding: wp('0.5%'),
  },
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: wp('5%'),
    marginTop: hp('0.6%'),
    maxHeight: hp('20%'),
    elevation: 2,
    borderColor: '#000',
    borderWidth: 1,
  },
  option: {
    paddingVertical: hp('1.3%'),
    paddingHorizontal: wp('2.5%'),
  },
  optionsScrollView: {
    maxHeight: hp('20%'), 
    overflow:"scroll"
    
  },
});
export default DropDown;
