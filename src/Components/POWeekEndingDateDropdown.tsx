import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const getWeekEndingDatesForMonth = (startOfMonth, endOfMonth) => {
  const weekEndingDates = [];

  let currentFriday = startOfMonth.clone().startOf('isoWeek').day(5); // Start from the first Friday of the month
  while (currentFriday.isSameOrBefore(endOfMonth)) {
    weekEndingDates.push({
      label: currentFriday.format('YYYY-MM-DD'),
      value: currentFriday.format('YYYY-MM-DD'),
    });
    currentFriday.add(7, 'days'); // Move to the next Friday
  }

  return weekEndingDates;
};

interface PODateTimePickerProps {
    value: string;
    onChangeText: (text: string) => void;
  }

const WeekEndingDropdown: React.FC<PODateTimePickerProps> = ({
    value,
    onChangeText,
  })=> {

    const [selectedDate, setSelectedDate] = useState<string>(value);

  const currentDate = moment();
  const startOfMonth = moment(currentDate).startOf('month');
  const endOfMonth = moment(currentDate).endOf('month');
  const weekEndingDates = getWeekEndingDatesForMonth(startOfMonth, endOfMonth);

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedDate}
        onValueChange={(itemValue) => {
            setSelectedDate(itemValue);
            onChangeText(itemValue);
          }}
        style={styles.dropdownStyle}
      >
        <Picker.Item label="Select" value="" />
        {weekEndingDates.map((date) => (
          <Picker.Item key={date.value} label={date.label} value={date.value} />
        ))}
      </Picker>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dropdownStyle: {
//     height: 20,
//     width: 150,
//     backgroundColor: '#f2f2f2',
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 4,
//     marginLeft:90,
//     marginBottom:15
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownStyle: {
    height: hp('2.5%'), 
    width: wp('40%'),   
    backgroundColor: '#f2f2f2',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: wp('2%'), 
    marginLeft: wp('18%'),  
    marginBottom: hp('1.5%'), 
  },
});

export default WeekEndingDropdown;