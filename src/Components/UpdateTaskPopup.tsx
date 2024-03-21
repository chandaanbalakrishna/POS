import React, { useState,useEffect  } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, KeyboardAvoidingView, Vibration, ScrollView } from 'react-native';
import PODateTimePicker from './PODateTimePicker';
import POInputField from './POSInputField';
import POInputBoxField from './POInputBoxField';
import POButton from './POButton';
import { FontAwesome } from '@expo/vector-icons';
import DraggableProgressBar from './DraggableProgressBar';
import LottieAnimation from './Animation';
import FloatingButton from './FloatingButton';
import { ProgressBar } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface TaskDetailsPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (estStartDate: string, estTime: string, comments: string, estEndDate: string, percentage: number) => void;
  initialPercentage: number;
}

const UpdateTaskPopup: React.FC<TaskDetailsPopupProps> = ({
  isVisible,
  onClose,
  onSubmit,
  initialPercentage,
}) => {
  const [actStartDate, setActStartDate] = useState('');
  const [actEndDate, setActEndDate] = useState('');
  const [actTime, setActTime] = useState('');
  const [comments, setComments] = useState('');
  const [percentageValue, setPercentageValue] = useState(0);
  const [actStartDateError, setActStartDateError] = useState("");
  const [actEndDateError, setActEndDateError] = useState("");
  const [actTimeError, setActTimeError] = useState("");
  const [commentsError, setCommentsError] = useState("");
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState<number>();
  const [PercentageError, setPercentageError] = useState("");

  const handleActStartDateChange = (text: string) => {
    setActStartDate(text);
    validateEstimationDates(text, actEndDate);
  };

  const handleActEndDateChange = (text: string) => {
    setActEndDate(text);
    validateEstimationDates(actStartDate, text);
  };

  const validateEstimationDates = (startDate: string, endDate: string) => {
    const today = new Date();
    const selectedStartDate = new Date(startDate);
    const selectedEndDate = new Date(endDate);

    if (selectedStartDate > today) {
      // Start date is in the future, invalid
      setActStartDateError("Estimation Start Date cannot be in the future");
      Vibration.vibrate();
    } else if (selectedStartDate > selectedEndDate) {
      // Start date is after end date, invalid
      setActStartDateError("Estimation Start Date cannot be after Estimation End Date");
      Vibration.vibrate();
    } else {
      setActStartDateError("");
    }
  };
  useEffect(() => {
    setPercentage(initialPercentage);
  }, [initialPercentage]);

  const handleActTimeChange = (text: string) => {
    setActTime(text);
  };

  const handleTextareaChange = (text: string) => {
    setComments(text);
  };

  const handleSubmit = () => {
    setActStartDateError("Please Select Actual Start Date");
    setActEndDateError("Please Select Actual End Date");
    setActTimeError("Please Enter Actual Time");
    setCommentsError("Please Enter Comments");
    setPercentageError("Percentage cannot be more than 100");
    Vibration.vibrate();

    if (
      actStartDate.length === 0 ||
      actEndDate.length === 0 ||
      actTime.length === 0 ||
      comments.length === 0 || percentage>100
    ) {
      return;
    }
    if (percentage > 100) {
      setPercentageError("Percentage cannot be more than 100");
      return;
    }

    setLoading(true);
    onSubmit(actStartDate, actTime, comments, actEndDate, percentage);
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 0 && progress < 25) {
      return 'red';
    } else if (progress >= 25 && progress < 50) {
      return 'yellow';
    } else if (progress >= 50 && progress < 95) {
      return 'orange';
    } else if (progress >= 95 && progress <= 100) {
      return 'green';
    } else {
      return '#4287f5'; // Default color
    }
  };

  const handlePercentageChange = (value: number) => {
      setPercentage(value);
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
          <Text style={styles.popupTitle}>Update Task Details</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <PODateTimePicker
              label={'Actual Start Date'}
              placeholder='Actual Start Date'
              value={actStartDate}
              onChangeText={handleActStartDateChange}
              minimumDate={new Date()}
            />
            {actStartDate.length === 0 && <Text style={{ color: 'red' }}>{actStartDateError}</Text>}
            <PODateTimePicker
              label={'Actual End Date'}
              placeholder='Actual End Date'
              value={actEndDate}
              onChangeText={handleActEndDateChange}
              minimumDate={new Date(actStartDate)}
            />
            {actEndDate.length === 0 && <Text style={{ color: 'red' }}>{actEndDateError}</Text>}
            <POInputField
              label={'Actual Time'}
              placeholder={'Actual Time'}
              value={actTime}
              onChangeText={handleActTimeChange}
              secureTextEntry={false}
            />
            {actTime.length === 0 && <Text style={{ color: 'red' }}>{actTimeError}</Text>}

            <POInputField
              label={'Percentage'}
              placeholder={'Percentage'}
              value={percentage}
              onChangeText={handlePercentageChange}
              secureTextEntry={false}
            />
            {percentage >100 &&(
          <Text style={{ color: 'red' }}>{PercentageError}</Text>
        )}
            <View style={{ marginBottom: 55 }}>
              <View style={styles.progressContainer}>
                <Text style={styles.percentageText}>Percentage</Text>
                <ProgressBar
                  progress={percentage !== null ? percentage / 100 : 0}
                  color={getProgressColor(percentage)}
                  style={[styles.progress, styles.progressBar]}
                />

                <Text style={styles.percentageText}>{percentage}%</Text>
              </View>
            </View>


            <POInputBoxField
              label={'Comments'}
              placeholder={'Comments'}
              value={comments}
              onChangeText={handleTextareaChange}
              multiline={true}
            />
            {comments.length === 0 && <Text style={{ color: 'red' }}>{commentsError}</Text>}
            <View style={styles.popupButtonContainer}>
              <FloatingButton
                title="Cancel"
                variant='outlined'
                onPress={onClose}
                style={styles.cancelPopupButton}
                titleStyle={styles.cancelPopupButtonText}
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
//     marginRight: -20,
//   },
//   popupButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   cancelPopupButton: {
//     height: 50,
//     borderRadius: 25,
//     alignItems: 'center',
//     justifyContent: 'center',
//     right: 20,
//   },
//   cancelPopupButtonText: {
//     color: '#35A2C1',
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
//   progress: {
//     height: 5,
//     borderRadius: 5,
//   },
//   progressContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   percentageText: {
//     color: '#256D85',
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   progressBar: {
//     flex: 1,
//     borderRadius: 5,
//     backgroundColor: '#E0E0E0',
//     marginLeft: 20,
//     width: 180,
//   },
// });

const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal:wp('1%')
  },
  popupContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('4%'),
    borderTopRightRadius: wp('4%'),
    padding: wp('7%'),
    paddingTop: hp('5%'), // Add top padding for close button
    height: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popupTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
  },
  popupButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  popupButton: {
    backgroundColor: '#35A2C1',
    height: hp('6.5%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -wp('5%'),
  },
  popupButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: wp('3.5%'),
  },
  cancelPopupButton: {
    height: hp('6.5%'),
    borderRadius: wp('12.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    right: wp('5%'),
  },
  cancelPopupButtonText: {
    color: '#35A2C1',
    fontWeight: 'bold',
    fontSize: wp('3.5%'),
  },
  errorText: {
    color: 'red',
    marginBottom: hp('2%'),
  },
  closeButton: {
    position: 'absolute',
    top: hp('1.5%'),
    right: wp('5%'),
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
  progress: {
    height: hp('0.35%'),
    borderRadius: hp('0.35%'),
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:hp('2%')
  },
  percentageText: {
    color: '#256D85',
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    marginLeft: wp('2%'),
  },
  progressBar: {
    flex: 1,
    borderRadius: hp('0.7%'),
    backgroundColor: '#E0E0E0',
    marginLeft: wp('5%'),
    width: wp('45%'),
  },
  Submit:{
   height:hp('1%')
  },
});

export default UpdateTaskPopup;
