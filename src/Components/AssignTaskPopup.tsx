import React, { useState,useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, KeyboardAvoidingView, Vibration, ScrollView } from 'react-native';
import PODateTimePicker from './PODateTimePicker';
import POInputField from './POSInputField';
import POInputBoxField from './POInputBoxField';
import POButton from './POButton';
import { FontAwesome } from '@expo/vector-icons';
import DropDown from './DropDown';
import { CommonMaster } from '../Models/CommonMaster';
import { useAxios } from '../Contexts/Axios';
import DatePickerWeekEndingDate from './DatePickerWeekEndingDate';
import LottieAnimation from './Animation';
import FloatingButton from './FloatingButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface TaskDetailsPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (estStartDate: string, estTime: string, comments: string, estEndDate: string,weekEndDate:string) => void;
}

const AssignTaskPopup: React.FC<TaskDetailsPopupProps> = ({
  
  isVisible,
  onClose,
  onSubmit,
}) => {
debugger
  const axios = useAxios();
  const [estStartDate, setEstStartDate] = useState('');
  const [estEndDate, setEstEndDate] = useState('');
  const [weekEndDate, setWeekEstEndDate] = useState('');
  const [estTime, setEstTime] = useState('');
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [estStartDateerror, setEstStartDateError] = React.useState<string>("");
  const [estEndDateerror, setEstEndDateError] = React.useState<string>("");
  const [EstTimeerror, setEstTimeError] = React.useState<string>("");
  const [Commentserror, setCommentsError] = React.useState<string>("");
  const [weekEndDateerror, setWeekEstEndDateError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEstStartDateChange = (text: string) => {
    setEstStartDate(text);
    validateEstimationDates(text, estEndDate);
  };

  const handleEstEndDateChange = (text: string) => {
    setEstEndDate(text);
    validateEstimationDates(estStartDate, text);
  };

  const handleWeekEndDateChange = (text: string) => {
    setWeekEstEndDate(text);
  };

  const validateEstimationDates = (startDate: string, endDate: string) => {
    const today = new Date();
    const selectedStartDate = new Date(startDate);
    const selectedEndDate = new Date(endDate);

    if (selectedStartDate > today) {
      // Start date is in the future, invalid
      setError("Estimation Start Date cannot be in the future");
      Vibration.vibrate();
    } else if (selectedStartDate > selectedEndDate) {
      // Start date is after end date, invalid
      setError("Estimation Start Date cannot be after Estimation End Date");
      Vibration.vibrate();
    } else {
      setError("");
    }
  };

  const handleEstTimeChange = (text: string) => {
    setEstTime(text);
  };

  const handleTextareaChange = (text: string) => {
    setComments(text);
  };

  
  

  const handleSubmit = () => {
    // if (estTime === '' || estTime === undefined) {
    //   setError('Please enter an estimation time.');
    //   Vibration.vibrate();
    // } else if (error === '') {
    //   onSubmit(estStartDate, estTime, comments, estEndDate,weekEndDate);
    // } else {
    //   Vibration.vibrate();
    // }
    setEstStartDateError("Please Select Estimation Start Date");
    setEstEndDateError("Please Select Estimation End Date");
    setEstTimeError("Please Enter Estimation Time");
    setCommentsError("Please Enter Comments");
    setWeekEstEndDateError("Please Select Week Ending Date");
    Vibration.vibrate();

    if (
      estStartDate.length === 0 ||
      estEndDate.length === 0 ||
      estTime.length === 0 ||
      comments.length === 0
    ) {
      return;
    }
    setLoading(true);
    onSubmit(estStartDate, estTime, comments, estEndDate,weekEndDate);
  };

 

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
     
      <KeyboardAvoidingView behavior="height" style={styles.popupContainer}>
   
        <View style={styles.popupContent}>
        {loading && (
          <View style={styles.loadingContainer}>
            <LottieAnimation
              source={require('../../assets/icons/Loading.json')}
              autoPlay={true}
              loop={false}
              visible={loading}
            />
          </View>
        )}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="close" size={24} color="#999" />
          </TouchableOpacity>
          <Text style={styles.popupTitle}>Task Details</Text>
          <ScrollView showsVerticalScrollIndicator={false}> 
          <PODateTimePicker
            label={'Estimation Start Date'}
            placeholder='Estimation Start Date'
            value={estStartDate}
            onChangeText={handleEstStartDateChange}
            minimumDate={new Date()}
          />
           {estStartDate.length === 0 && <Text style={{ color: 'red' }}>{estStartDateerror}</Text>}
          <PODateTimePicker
            label={'Estimation End Date'}
            placeholder='Estimation End Date'
            value={estEndDate}
            onChangeText={handleEstEndDateChange}
            minimumDate={new Date(estStartDate)}
            
          />
           {estEndDate.length === 0 && <Text style={{ color: 'red' }}>{estEndDateerror}</Text>}
          <POInputField
            label={'Estimation Time'}
            placeholder={'Estimation Time'}
            value={estTime}
            onChangeText={handleEstTimeChange}
            secureTextEntry={false}
            maxLength={3}
            keyboardType='number-pad'
          />
           {estTime.length === 0 && <Text style={{ color: 'red' }}>{EstTimeerror}</Text>}
          <DatePickerWeekEndingDate 
           label={'Week Ending Date'}
           placeholder='Week Ending Date'
           value={estEndDate}
           onChangeText={handleWeekEndDateChange}
           />
            {weekEndDate.length === 0 && <Text style={{ color: 'red' }}>{Commentserror}</Text>}
       
          <POInputBoxField
            label={'Comments'}
            placeholder={'Comments'}
            value={comments}
            onChangeText={handleTextareaChange}
            multiline={true}
          />
           {comments.length === 0 && <Text style={{ color: 'red' }}>{weekEndDateerror}</Text>}
          <View style={styles.popupButtonContainer}>
          <FloatingButton
                title="Cancel"
                variant='outlined'
                onPress={onClose}
                style={styles.CancelpopupButton}
                titleStyle={styles.CancelpopupButtonText}
                icon='cancel'
              />
              <FloatingButton
              title="Submit"
              variant='contained'
              onPress={handleSubmit}
              style={styles.popupButton}
              titleStyle={styles.popupButtonText}
              icon='arrow-right-bold-circle'
              />
          </View>
          </ScrollView>
        </View>
            
      </KeyboardAvoidingView>

    </Modal>
  );
};

// const styles = StyleSheet.create({
//   popupContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   popupContent: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 15,
//     borderTopRightRadius: 15,
//     padding: 30,
//     paddingTop: 40, // Add top padding for close button
//     height: '85%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   popupTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   popupButtonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   popupButton: {
//     backgroundColor: '#35A2C1',
//     height: 50,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     left:20
//   },
//   popupButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   errorText: {
//     color: 'red',
//     marginBottom: 10,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 999,
//   },
//   loadingContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(255, 255, 255, 1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 999,
//   },
//   CancelpopupButton: {
//     height: 50,
//     borderRadius:25,
//     alignItems: 'center',
//     justifyContent: 'center',
//     right:20
//   },
//   CancelpopupButtonText: {
//     color: '#35A2C1',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
// });
const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  popupContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('3%'), 
    borderTopRightRadius: wp('3%'), 
    padding: wp('8%'),
    paddingTop: hp('10%'), 
    height: hp('85%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popupTitle: {
    fontSize: wp('4.5%'), 
    fontWeight: 'bold',
    marginBottom: hp('1.5%'), 
  },
  popupButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  popupButton: {
    backgroundColor: '#35A2C1',
    height: hp('6.25%'), 
    borderRadius: wp('4%'), 
    alignItems: 'center',
    justifyContent: 'center',
    left: wp('5%'), 
  },
  popupButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: wp('3.5%'), 
  },
  errorText: {
    color: 'red',
    marginBottom: hp('2.5%'), 
  },
  closeButton: {
    position: 'absolute',
    top: hp('1.25%'), 
    right: wp('1.25%'), 
    zIndex: 999,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  CancelpopupButton: {
    height: hp('6.25%'), 
    borderRadius: wp('12.5%'), 
    alignItems: 'center',
    justifyContent: 'center',
    right: wp('5%'), 
  },
  CancelpopupButtonText: {
    color: '#35A2C1',
    fontWeight: 'bold',
    fontSize: wp('3.5%'), 
  },
});

export default AssignTaskPopup;
