import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from '@react-native-material/core';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface POLeaveDatePickerProps {
  label: string;
  selectedDates: Date[];
  onSelectDates: (dates: Date[]) => void;
  placeholder: string;
  minimumDate?: Date;
}

const POLeaveDatePicker: React.FC<POLeaveDatePickerProps> = ({
  label,
  selectedDates,
  onSelectDates,
  placeholder,
  minimumDate,
}) => {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const handleDatePickerToggle = () => {
    setShowDatePicker(!showDatePicker); // Toggle the DatePicker visibility
  };

  const handleDateChange = (event: Event, selectedDate?: Date) => {
    setShowDatePicker(false); // Close the DatePicker
    if (selectedDate) {
      const updatedDates = [...selectedDates, selectedDate];
      onSelectDates(updatedDates);
    }
  };

  const handleCancelDate = (dateToRemove: Date) => {
    const updatedDates = selectedDates.filter((date) => date !== dateToRemove);
    onSelectDates(updatedDates);
  };

  const renderDateRows = () => {
    const dateRows = [];
    for (let i = 0; i < selectedDates.length; i += 2) {
      const dateRow = (
        <View key={i} style={styles.dateRow}>
          {selectedDates[i] && (
            <View style={styles.selectedDateContainer}>
              <Text style={styles.selectedDateText}>
                {selectedDates[i].toDateString()}
              </Text>
              <TouchableOpacity
                onPress={() => handleCancelDate(selectedDates[i])}
                style={styles.cancelButton}
              >
                <Ionicons name="close-circle" size={22} color="red" />
              </TouchableOpacity>
            </View>
          )}
          {selectedDates[i + 1] && (
            <View style={styles.selectedDateContainer}>
              <Text style={styles.selectedDateText}>
                {selectedDates[i + 1].toDateString()}
              </Text>
              <TouchableOpacity
                onPress={() => handleCancelDate(selectedDates[i + 1])}
                style={styles.cancelButton}
              >
                <Ionicons name="close-circle" size={22} color="red" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
      dateRows.push(dateRow);
    }
    return dateRows;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleDatePickerToggle} style={styles.inputContainer}>
        <TextInput
          variant="standard"
          label={label}
          value={placeholder} // Always show the placeholder text in the input field
          editable={false}
          style={styles.input}
          color="#3A9EC2"
          trailing={<Ionicons name="calendar" size={22} color="black" />}
        />
      </TouchableOpacity>

      {/* Render selected dates in rows */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderDateRows()}
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          mode="date"
          is24Hour={true}
          display="default"
          minimumDate={minimumDate}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('1%'),
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
    padding: 0,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  selectedDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16, // Adjust the spacing between dates
  },
  selectedDateText: {
    backgroundColor: '#3A9EC2',
    color: 'white',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginRight: 6,
  },
  cancelButton: {
    marginRight: 6, // Adjust the spacing as needed
  },
});

export default POLeaveDatePicker;
