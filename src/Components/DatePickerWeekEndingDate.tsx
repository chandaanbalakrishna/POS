// import React, { useState } from 'react';
// import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
// import DateTimePicker, { Event as DateTimePickerEvent } from '@react-native-community/datetimepicker';
// import { Ionicons } from '@expo/vector-icons';
// import { TextInput } from "@react-native-material/core";
// import DateTimePickerModal from 'react-native-modal-datetime-picker';

// interface PODateTimePickerProps {
//   label: string;
//   value: string;
//   onChangeText: (text: string) => void;
//   placeholder: string;
// }

// const DatePickerWeekEndingDate: React.FC<PODateTimePickerProps> = ({
//   label,
//   value,
//   onChangeText,
//   placeholder,

// }) => {
//   const [date, setDate] = useState<Date | undefined>(undefined);
//   const [mode, setMode] = useState<'date' | 'time'>('date');
//   const [show, setShow] = useState<boolean>(false);
//   const [text, setText] = useState<string>(value || placeholder);
//   const [minimumDate, setMinimumDate] = useState<Date>(new Date());

  // const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
  //   const currentDate = selectedDate || date;
  //   setShow(Platform.OS === 'ios');
  //   if (event.type === 'set') {
  //     // User pressed "OK"
  //     setDate(currentDate);
  //     if (currentDate) {
  //       const formattedDate = currentDate.toISOString().split('T')[0]; // Extracting the date portion
  //       setText(formattedDate);
  //       onChangeText(formattedDate); // Call the onChangeText callback to update the value
  //     }
  //   } else {
  //     // User pressed "Cancel" or dismissed the picker
  //     setDate(undefined);
  //   }
  // };


 

  // const onchange = (selectedDate: Date) => {
  //   debugger
  //   if (selectedDate.getDay() === 5) {
  //     setShow(false); // Close the modal
  //     const formattedDate = selectedDate.toISOString().split('T')[0]; // Extracting the date portion
  //     setDate(selectedDate);
  //     setText(formattedDate);
  //     onChangeText(formattedDate); // Call the onChangeText callback to update the value
  //   }
  // };
  // const handleConfirm = (selectedDate: Date) => {
  //   debugger
  //   if (selectedDate.getDay() === 5) {
  //     const formattedDate = selectedDate.toISOString().split('T')[0];
  //     setDate(selectedDate);
  //     setText(formattedDate); // Update the text state with the formatted date
  //     onChangeText(formattedDate); // Call the onChangeText callback to update the value
  //     console.log('Selected Date:', formattedDate);
  //   }
  //   hideDatePicker();
  // };
  
  // const hideDatePicker = () => {
  //   setShow(false);
  // };
  
  // const showDatePicker = () => {
  //   setShow(true)
  // };

  // const showMode = (currentMode: 'date' | 'time') => {
  //   debugger
  //   setShow(true);
  //   setMode(currentMode);
  //   if (currentMode === 'date') {
  //     const today = new Date();
  //     let nextFriday = new Date(today.getTime());
  //     nextFriday.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7)); // Find the next Friday
  //     setMinimumDate(nextFriday);
  //   }
  // };
 
  // const isDisabledDay = (date: Date) => {
  //   const today = new Date();
  //   const day = date.getDay();
  //   const isTodayFriday = today.getDay() === 5;
  //   const isBeforeNextFriday = date.getTime() < minimumDate.getTime();
  //   const isAfterToday = date.getTime() > today.getTime();
  //   return (day !== 5 || isTodayFriday) || (isTodayFriday && isBeforeNextFriday) || !isAfterToday;
  // };




//   return (
//     <View style={styles.container}>
//       {/* <Text style={styles.label}>{label}</Text> */}
//       <TouchableOpacity onPress={showMode} style={styles.inputContainer}>
//       <TextInput
//           variant="standard"
//           label=""
//           value={text}
//           editable={false}
//           style={styles.input}
//           color="#3A9EC2"
//           trailing={<Ionicons name="calendar" size={22} color="black"/>}
//         />
//       </TouchableOpacity>
//       {/* {show && (
//         <DateTimePicker
//           testID="dateTimePicker"
//           value={date || new Date()} // Use current date if date is undefined
//           mode={mode}
//           is24Hour={true}
//           display="default"
//           minimumDate={minimumDate} // Set minimum date to the next Friday
//           onChange={onChange}
//           disabled={isDisabledDay} // Disable days other than future Fridays and current Friday
//         />
//       )} */}
//        <DateTimePickerModal
//         isVisible={show}
//         mode="date"
//         date={date} 
//         minimumDate={minimumDate} 
//         onCancel={hideDatePicker} 
//         onConfirm={handleConfirm} 
//         disabled={isDisabledDay} 

//       />
//     </View>
//   );
// };

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
//     backgroundColor: '#fff',
//   },
//   input: {
//     flex: 1,
//     color: 'gray',
//     fontSize: 16,
//     padding:10
//   },
//   placeholder: {
//     color: 'lightgray',
//   },
// });

// export default DatePickerWeekEndingDate;



import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from "@react-native-material/core";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface PODateTimePickerProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

const DatePickerWeekEndingDate: React.FC<PODateTimePickerProps> = ({
  value,
  onChangeText,
  placeholder,
}) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [show, setShow] = useState<boolean>(false);
  const [text, setText] = useState<string>(value || placeholder);

  const handleConfirm = (selectedDate: Date) => {
    if (selectedDate.getDay() === 5) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDate(selectedDate);
      setText(formattedDate);
      onChangeText(formattedDate);
    }
    hideDatePicker();
  };
  
  const hideDatePicker = () => {
    setShow(false);
  };
  
  const showDatePicker = () => {
    setShow(true)
  };

  const isFriday = (date: Date) => {
    return date.getDay() === 5;
  };

  const getNextFriday = () => {
    const today = new Date();
    let nextFriday = new Date(today.getTime());
    nextFriday.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7)); // Find the next Friday
    return nextFriday;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showDatePicker} style={styles.inputContainer}>
        <TextInput
          variant="standard"
          label=""
          value={text}
          editable={false}
          style={styles.input}
          color="#3A9EC2"
          trailing={<Ionicons name="calendar" size={22} color="black"/>}
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={show}
        mode="date"
        date={date || getNextFriday()} 
        minimumDate={getNextFriday()} 
        onCancel={hideDatePicker} 
        onConfirm={handleConfirm} 
        disabled={!isFriday} 
      />
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
//     backgroundColor: '#fff',
//   },
//   input: {
//     flex: 1,
//     color: 'gray',
//     fontSize: 16,
//     padding:10
//   },
//   placeholder: {
//     color: 'lightgray',
//   },
// });
const styles = StyleSheet.create({
  container: {
    marginBottom: hp('1%'),
  },
  label: {
    marginBottom: hp('0.5%'),
    fontWeight: 'bold',
    color: '#256D85',
    fontSize: wp('3.5%'),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    color: 'gray',
    fontSize: wp('4%'),
    padding: wp('0.5%'),
  },
  placeholder: {
    color: 'lightgray',
  },
});
export default DatePickerWeekEndingDate;
