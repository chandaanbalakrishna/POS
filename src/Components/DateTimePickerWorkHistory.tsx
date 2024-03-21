import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import DateTimePicker, { Event as DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface PODateTimePickerProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

const DateTimePickerWorkHistory: React.FC<PODateTimePickerProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
}) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [show, setShow] = useState<boolean>(false);
  const [text, setText] = useState<string>(value || placeholder);
  const [minimumDate, setMinimumDate] = useState<Date>(new Date());

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    if (event.type === 'set') {
      // User pressed "OK"
      setDate(currentDate);
      if (currentDate) {
        const formattedDate = currentDate.toISOString().split('T')[0]; // Extracting the date portion
        setText(formattedDate);
        onChangeText(formattedDate); // Call the onChangeText callback to update the value
      }
    } else {
      // User pressed "Cancel" or dismissed the picker
      setDate(undefined);
    }
  };

  const showMode = (currentMode: 'date' | 'time') => {
    setShow(true);
    setMode(currentMode);
  };

  // Function to set the minimum date to the first day of the current month
  const setMinimumDateToPreviousMonths = (numMonths: number) => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - numMonths);
    setMinimumDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={() => {
          setMinimumDateToPreviousMonths(6);// Set the minimum date to the first day of the current month
          showMode('date');
        }}
        style={styles.inputContainer}
      >
        <Text style={[styles.input, !text ? styles.placeholder : null]}>{text}</Text>
        <Ionicons name="calendar" size={22} color="black" style={styles.icon} />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date || new Date()} // Use current date if date is undefined
          mode={mode}
          is24Hour={true}
          display="default"
          minimumDate={minimumDate} // Set the minimum date to the first day of the current month
          onChange={onChange}
        />
      )}
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 10,
//   },
//   label: {
//     marginBottom: 5,
//     fontWeight: 'bold',
//     color: '#256D85',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#256D85',
//     borderRadius: 15,
//     backgroundColor: '#fff',
//     paddingHorizontal: 10,
//     height: 55,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   input: {
//     flex: 1,
//     color: 'gray',
//   },
//   placeholder: {
//     color: 'lightgray',
//   },
//   icon: {
//     marginLeft: 10,
//   },
// });

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('1%'), // Use percentage of screen height
  },
  label: {
    marginBottom: hp('0.625%'), // Use percentage of screen height
    fontWeight: 'bold',
    color: '#256D85',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#256D85',
    borderRadius: wp('6.25%'), 
    backgroundColor: '#fff',
    paddingHorizontal: wp('2.5%'), 
    height: hp('6.875%'), 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    color: 'gray',
  },
  placeholder: {
    color: 'lightgray',
  },
  icon: {
    marginLeft: wp('2.5%'), 
  },
});

export default DateTimePickerWorkHistory;
