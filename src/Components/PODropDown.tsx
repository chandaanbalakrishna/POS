import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { TextInput } from '@react-native-material/core';
import { Ionicons } from '@expo/vector-icons';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import DropDownPicker, { ValueType } from 'react-native-dropdown-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Option {
  label: string;
  value: string | number;
}

interface Props<T> {
  title?: string;
  placeholder?: string;
  data: Option[];
  value: T | ValueType;
  disable: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setValue: React.Dispatch<React.SetStateAction<T | ValueType>>;
  onChange?: (value: T | ValueType) => void;
  style?: StyleProp<ViewStyle>;
  optionStyle?:StyleProp<ViewStyle>;
}

const PODropDown = <T extends string | number>({
  title = '',
  placeholder = '',
  data,
  disable = false,
  setValue,
  value,
  onChange,
  style,
  optionStyle,
}: Props<T>) => {
  const [open, setOpen] = useState(false);

  const toggleOptions = () => {
    if (!disable) {
      setOpen(!open);
    }
  };

  const handleOptionSelection = (item: Option) => {
    setValue(item.value);
    setOpen(false);
    if (onChange) {
      onChange(item.value);
    }
  };

  const getSelectedOptionLabel = (value: T | ValueType) => {
    const selectedOption = data.find((option) => option.value === value);
    return selectedOption ? selectedOption.label : '';
  };

  return (
    <>
      <TouchableOpacity onPress={toggleOptions} disabled={disable}>
        <TextInput
          variant="standard"
          label={title}
          value={getSelectedOptionLabel(value)}
          editable={false}
          style={[styles.dropdown, style]}
          trailing={<Ionicons name="caret-down-outline" size={22} color="black"/>}
        />
      </TouchableOpacity>
      {open && (
        <View style={[styles.optionsContainer,optionStyle]}>
            <ScrollView style={styles.optionsScrollView}   nestedScrollEnabled={open}>
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
//   dropdown: {
//     backgroundColor: '#fff',
//     padding: 10,
//     margin: 20,
//   },
//   optionsContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     maxHeight: 200,
//     elevation: 2,
//     borderColor: '#000',
//     borderWidth: 1,
//     margin: 20,
//     bottom: 40,
//   },
//   optionsScrollView: {
//     maxHeight: 200,
//   },
//   option: {
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//   },
// });

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: '#fff',
    padding: wp('2%'),  // Responsive padding
    margin: wp('5%'),   // Responsive margin
  },
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: hp('25%'),  // Responsive maxHeight
    elevation: 2,
    borderColor: '#000',
    borderWidth: 1,
    margin: wp('5%'),       // Responsive margin
    bottom: hp('5%'),       // Responsive bottom
  },
  optionsScrollView: {
    maxHeight: hp('20%'),  // Responsive maxHeight
  },
  option: {
    paddingVertical: hp('1.5%'),  // Responsive paddingVertical
    paddingHorizontal: wp('2%'),  // Responsive paddingHorizontal
  },
});

export default PODropDown;
