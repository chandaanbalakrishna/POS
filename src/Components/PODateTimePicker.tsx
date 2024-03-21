// import React, { useState } from 'react';
// import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
// import DateTimePicker, { Event as DateTimePickerEvent } from '@react-native-community/datetimepicker';
// import { Ionicons } from '@expo/vector-icons';
// import { TextInput } from "@react-native-material/core";

// interface PODateTimePickerProps {
//   label: string;
//   value: string;
//   onChangeText: (text: string) => void;
//   placeholder: string;
//   minimumDate?: Date;
// }

// const PODateTimePicker: React.FC<PODateTimePickerProps> = ({
//   label,
//   value,
//   onChangeText,
//   placeholder,
//   minimumDate,
// }) => {
//   const [date, setDate] = useState<Date | undefined>(undefined);
//   const [mode, setMode] = useState<'date' | 'time'>('date');
//   const [show, setShow] = useState<boolean>(false);
//   const [text, setText] = useState<string>(value || placeholder);

//   const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
//     const currentDate = selectedDate || date;
//     setShow(Platform.OS === 'ios');
//     if (event.type === 'set') {
//       // User pressed "OK"
//       setDate(currentDate);
//       if (currentDate) {
//         const formattedDate = currentDate.toISOString().split('T')[0]; // Extracting the date portion
//         setText(formattedDate);
//         onChangeText(formattedDate); // Call the onChangeText callback to update the value
//       }
//     } else {
//       // User pressed "Cancel" or dismissed the picker
//       setDate(undefined);
//     }
//   };

//   const showMode = (currentMode: 'date' | 'time') => {
//     setShow(true);
//     setMode(currentMode);
//   };

//   return (
//     <View style={styles.container}>
//       {/* <Text style={styles.label}>{label}</Text> */}
//       <TouchableOpacity onPress={() => showMode('date')} style={styles.inputContainer}>
//         <TextInput
//           variant="standard"
//           label={label}
//           value={text}
//           editable={false}
//           style={styles.input}
//           color="#3A9EC2"
//           trailing={<Ionicons name="calendar" size={22} color="black" />}
//         />
//       </TouchableOpacity>
//       {show && (
//         <DateTimePicker
//           testID="dateTimePicker"
//           value={date || new Date()} // Use current date if date is undefined
//           mode={mode}
//           is24Hour={true}
//           display="default"
//           minimumDate={minimumDate} // Set minimum date to current date
//           onChange={onChange}
//         />
//       )}
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
//     fontSize: 14,
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
//   textInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
// });

// export default PODateTimePicker;

import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import DateTimePicker, { Event as DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from '@react-native-material/core';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
interface PODateTimePickerProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  minimumDate?: Date;
}
const PODateTimePicker: React.FC<PODateTimePickerProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  minimumDate,
}) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [show, setShow] = useState<boolean>(false);
  const [text, setText] = useState<string>(value || placeholder);
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
  }
  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    setText(formattedDate);
    onChangeText(formattedDate);
    hideDatePicker();
  };
    const showMode = (currentMode: 'date' | 'time') => {
      setShow(true);
      setMode(currentMode);
    }

  const hideDatePicker = () => {
    setShow(false);
  };
  return (
    <View style={styles.container}>
      {/* <Text style={styles.label}>{label}</Text> */}
      <TouchableOpacity onPress={() => showMode('date')} style={styles.inputContainer}>
      
        <TextInput
          variant="standard"
          label={label}
          value={text}
          editable={false}
          style={styles.input}
          color="#3A9EC2"
          trailing={<Ionicons name="calendar" size={22} color="black" />}
        />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date || new Date()} // Use current date if date is undefined
          mode={mode}
          is24Hour={true}
          display="default"
          minimumDate={minimumDate} // Set minimum date to current date
          onChange={onChange}
        />
      )}
      <DateTimePickerModal
        isVisible={show}
        mode="date"
        date={date || new Date()}
        minimumDate={minimumDate || undefined}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
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
//     fontSize: 14,
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
//   textInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
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
    marginTop:hp('2%'),
  },
  input: {
    flex: 1,
    color: 'gray',
    fontSize: wp('4%'),
    padding: wp('0.5%')
  
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PODateTimePicker;
