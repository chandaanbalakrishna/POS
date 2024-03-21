import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, KeyboardAvoidingView, Vibration, ScrollView, Image } from 'react-native';
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
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface TaskDetailsPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (estStartDate: string, estTime: string, comments: string, estEndDate: string, taskType: string, classification: string, weekEndDate: string, TaskDescription: string, checkListDescriptions: string[]) => void;
}

const CheckListCreateTask: React.FC<TaskDetailsPopupProps> = ({
  isVisible,
  onClose,
  onSubmit,
}) => {

  const axios = useAxios();
  const navigation = useNavigation();
  const [estStartDate, setEstStartDate] = useState('');
  const [estEndDate, setEstEndDate] = useState('');
  const [estTime, setEstTime] = useState('');
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  interface Option {
    label: string;
    value: string;
  }
  const [TaskTypeOptions, setTaskTypeOptions] = useState<Option[]>([]);
  const [TaskTypeValue, setTaskTypeValue] = useState('');
  const [ClassificationOptions, setClassificationOptions] = useState<Option[]>([]);
  const [ClassificationValue, setClassificationValue] = useState('');
  const [StartDateerror, setEstStartDateError] = React.useState<string>("");
  const [EndDateerror, setEstEndDateError] = React.useState<string>("");
  const [EstTimeerror, setEstTimeError] = React.useState<string>("");
  const [tasktypeerror, setTaskTypeError] = React.useState<string>("");
  const [Classificationerror, setClassificationError] = React.useState<string>("");
  const [Commentserror, setCommentsError] = React.useState<string>("");
  const [weekEndDate, setWeekEstEndDate] = useState('');
  const [weekEndDateerror, setWeekEstEndDateError] = useState('');
  const [loading, setLoading] = useState(false);
  const [TaskDescription, setTaskDescription] = React.useState<string>("");
  const [TaskDescriptionerror, setTaskDescriptionerror] = React.useState<string>("");
  const [CheckListDesc, setCheckListDesc] = React.useState<string>("");
  const [showChecklist, setShowChecklist] = useState(false);
  const [checkList, setCheckList] = useState(['']);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);

  const handleEstStartDateChange = (text: string) => {
    setEstStartDate(text);
  };

  const handleEstEndDateChange = (text: string) => {
    setEstEndDate(text);
  };

  const handleEstTimeChange = (text: string) => {
    setEstTime(text);
  };

  const handleTextareaChange = (text: string) => {
    setComments(text);
  };


  const handleTaskTypeSelect = (text: string) => {
    setTaskTypeValue(text);
  };

  const handleClassificationSelect = (text: string) => {
    setClassificationValue(text);
  };

  const handleWeekEndDateChange = (text: string) => {
    setWeekEstEndDate(text);
  };
  const handleTaskareaChange = (text: string) => {
    setTaskDescription(text);
  };

  const handleSubmit = () => {
    setEstStartDateError("Please Select Start Date");
    setEstEndDateError("Please Select End Date");
    setEstTimeError("Please Enter Estimation Time");
    setTaskTypeError("Please Select Task Type");
    setClassificationError("Please Select Classification");
    setCommentsError("Please Enter Comments");
    setWeekEstEndDateError("Please Select Week Ending Date");
    setTaskDescriptionerror("Please Enter The Task Description");

    if (
      estStartDate.length === 0 ||
      estEndDate.length === 0 ||
      estTime.length === 0 ||
      (TaskTypeOptions.length != 0 && TaskTypeValue.length === 0 )||
      (ClassificationOptions.length != 0 && ClassificationValue.length === 0) ||
      comments.length === 0 ||
      weekEndDate.length === 0 ||
      TaskDescription.length === 0
    ) {
      return;
    }

    setLoading(true);
    Vibration.vibrate();
    onSubmit(estStartDate, estTime, comments, estEndDate, TaskTypeValue, ClassificationValue, weekEndDate, TaskDescription, checkList.filter(item => item !== ''));
  };
  useEffect(() => {
    loadConnectionList();
  }, []);

  const loadConnectionList = async () => {
    try {
      const response = await axios.privateAxios.get<CommonMaster[]>("/app/CommonMaster/GetCodeTableList")
      const taskTypeSet = new Set();
      response.data.forEach((item) => {
        if (item.codeName === "TaskType") {
          taskTypeSet.add(item.codeValue);
        }
      });
      const taskType = Array.from(taskTypeSet).map((codeValue) => ({
        label: codeValue,
        value: codeValue,
      }));

      const classificationSet = new Set();
      response.data.forEach((item) => {
        if (item.codeName === "TaskClassification") {
          classificationSet.add(item.codeValue);
        }
      });
      const classification = Array.from(classificationSet).map((codeValue) => ({
        label: codeValue,
        value: codeValue,
      }));

      setTaskTypeOptions(taskType);
      setClassificationOptions(classification);

    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleCheckListareaChange = (index: number, text: string) => {
    const updatedCheckList = [...checkList];
    updatedCheckList[index] = text;
    setCheckList(updatedCheckList);
  };

  const handlePlusImageClick = () => {
    setShowChecklist(true); // Show CheckList Description items
    setCheckList((prevCheckList) => [...prevCheckList, '']); // Add an empty CheckList Description field
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDeleteItem = (index) => {
    const updatedCheckList = [...checkList];
    updatedCheckList.splice(index, 1);
    setCheckList(updatedCheckList);

    if (updatedCheckList.length === 0) {
      setShowDeleteIcon(false);
    }
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
          <Text style={styles.popupTitle}>Task CheckList Details</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <PODateTimePicker
              label={'Estimation Start Date'}
              placeholder='Estimation Start Date'
              value={estStartDate}
              onChangeText={handleEstStartDateChange}
              minimumDate={new Date()}
            />
            {estStartDate.length === 0 && <Text style={{ color: 'red' }}>{StartDateerror}</Text>}
            <PODateTimePicker
              label={'Estimation End Date:'}
              placeholder='Estimation End Date'
              value={estEndDate}
              onChangeText={handleEstEndDateChange}
              minimumDate={new Date(estStartDate)}
            />
            {estEndDate.length === 0 && <Text style={{ color: 'red' }}>{EndDateerror}</Text>}
            {estEndDate.length > 0 && estEndDate < estStartDate && (<Text style={{ color: 'red' }}>Estimation End Date Cannot Be Earlier than Start Date</Text>)}
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
            {weekEndDate.length === 0 && <Text style={{ color: 'red' }}>{weekEndDateerror}</Text>}
            {TaskTypeOptions.length != 0 ?
            <>
            <DropDown
              label="Task Type"
              placeholder="Select an option"
              data={TaskTypeOptions}
              value={TaskTypeValue}
              disable={false}
              setValue={setTaskTypeValue}
              onChange={handleTaskTypeSelect}
            />
            {TaskTypeValue.length === 0 && <Text style={{ color: 'red' }}>{tasktypeerror}</Text>}
            </>:""}
            {ClassificationOptions.length != 0 ?
            <>
            <DropDown
              label="Classification"
              placeholder="Select an option"
              data={ClassificationOptions}
              value={ClassificationValue}
              disable={false}
              setValue={setClassificationValue}
              onChange={handleClassificationSelect}
            />
            {ClassificationValue.length === 0 && <Text style={{ color: 'red' }}>{Classificationerror}</Text>}
            </>:""}
            <POInputBoxField
              label={'Task Description'}
              placeholder={'Comments'}
              value={TaskDescription}
              onChangeText={handleTaskareaChange}
              multiline={true}
            />
            {TaskDescription.length === 0 && <Text style={{ color: 'red' }}>{TaskDescriptionerror}</Text>}


            <View>
              {checkList.map((item, index) => (
                <View key={index}>
                  <POInputBoxField
                    label={`CheckList Description ${index + 1}`}
                    placeholder="Comments"
                    value={item}
                    onChangeText={(text) => handleCheckListareaChange(index, text)}
                    multiline={true}
                  />

                  {index === checkList.length - 1 && (
                    <TouchableOpacity onPress={handlePlusImageClick}>
                      <Image
                        source={require('../../assets/icons/plus.png')}
                        style={styles.circleImage}
                      />
                    </TouchableOpacity>
                  )}
                  {index === checkList.length - 1 && index !== 0 && (
                    <TouchableOpacity onPress={() => handleDeleteItem(index)}>
                      <Ionicons
                        name='trash'
                        size={24} 
                        style={styles.iconStyle} 
                      />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            <POInputBoxField
              label={'Comments'}
              placeholder={'Comments'}
              value={comments}
              onChangeText={handleTextareaChange}
              multiline={true}
            />
            {comments.length === 0 && <Text style={{ color: 'red' }}>{Commentserror}</Text>}
            <View style={styles.popupButtonContainer}>
              <POButton
                title="Submit"
                onPress={handleSubmit}
                style={styles.popupButton}
                titleStyle={styles.popupButtonText}
              />
              <POButton
                title="Cancel"
                onPress={onClose}
                style={styles.popupButton}
                titleStyle={styles.popupButtonText}
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
//     paddingTop: 40,
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
//   iconStyle: {
//     color: 'red', // Set the desired color
//     marginTop: -25, // Set any additional desired styles
//     marginLeft: 50
//   },
//   circleImage: {
//     width: 25,
//     height: 25,
//     borderRadius: 35,
//     backgroundColor: '#fff',
//     marginLeft: 10,
//     marginTop: -10
//   },
//   popupButton: {
//     backgroundColor: '#35A2C1',
//     height: 50,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//     marginLeft: 2,
//     //bottom: 20,
//     marginRight: -1,
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
// });
const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  popupContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('4%'),
    borderTopRightRadius: wp('4%'),
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
  iconStyle: {
    color: 'red', // Set the desired color
    marginTop: -hp('2.5%'), // Use percentage of screen height
    marginLeft: wp('15%'), // Use percentage of screen width
  },
  circleImage: {
    width: wp('6.25%'), // Use percentage of screen width
    height: wp('6.25%'), // Use percentage of screen width
    borderRadius: wp('8.75%'), // Use percentage of screen width
    backgroundColor: '#fff',
    marginLeft: wp('2.5%'), // Use percentage of screen width
    marginTop: -hp('1.25%'), // Use percentage of screen height
  },
  popupButton: {
    backgroundColor: '#35A2C1',
    height: hp('6.25%'), // Use percentage of screen height
    borderRadius: wp('4%'), // Use percentage of screen width
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('5%'),
    marginLeft: wp('0.5%'), // Use percentage of screen width
    marginRight: -wp('0.25%'), // Use percentage of screen width
  },
  popupButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: wp('3.5%'),
  },
  errorText: {
    color: 'red',
    marginBottom: hp('1.25%'), // Use percentage of screen height
  },
  closeButton: {
    position: 'absolute',
    top: hp('1.25%'), // Use percentage of screen height
    right: wp('1.25%'), // Use percentage of screen width
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
});
export default CheckListCreateTask;
