import React, { useEffect, useState } from 'react';
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
import { TaskClassification } from '../Models/TaskClassification';
import { RadioButton } from 'react-native-paper';

interface CategoryPopupProps {
  isVisible: boolean;
  categoryId:number;
  onClose: () => void;
  onSubmit: (estStartDate: string, estTime: string, comments: string, estEndDate: string, name: string, description: string, taskType: string, classification: string,weekEndDate:string,TaskDescription:string,Priority:string,assignTaskForMyself:boolean,addDayPlan:boolean) => void;
}

const CategoryPopup: React.FC<CategoryPopupProps> = ({
  isVisible,
  onClose,
  categoryId,
  onSubmit,
}) => {
  const axios = useAxios();
  const [estStartDate, setEstStartDate] = useState('');
  const [estEndDate, setEstEndDate] = useState('');
  const [estTime, setEstTime] = useState('');
  const [comments, setComments] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  interface Option {
    label: string;
    value: string;
  }
  const [TaskTypeOptions, setTaskTypeOptions] = useState<Option[]>([]);
  const [PriorityOptions, setPriorityOptions] = useState<Option[]>([]);
  const [TaskTypeValue, setTaskTypeValue] = useState('');
  const [ClassificationOptions, setClassificationOptions] = useState<Option[]>([]);
  const [ClassificationValue, setClassificationValue] = useState('');
  const [StartDateerror, setEstStartDateError] = React.useState<string>("");
  const [EndDateerror, setEstEndDateError] = React.useState<string>("");
  const [EstTimeerror, setEstTimeError] = React.useState<string>("");
  const [tasktypeerror, setTaskTypeError] = React.useState<string>("");
  const [Classificationerror, setClassificationError] = React.useState<string>("");
  const [Commentserror, setCommentsError] = React.useState<string>("");
  const [Nameerror, setNameError] = React.useState<string>("");
  const [Descriptionerror, setDescriptionError] = React.useState<string>("");
  const [weekEndDate, setWeekEstEndDate] = useState('');
  const [weekEndDateerror, setWeekEstEndDateError] = useState('');
  const [loading, setLoading] = useState(false);
  const [TaskDescription, setTaskDescription] = React.useState<string>("");
  const [TaskDescriptionerror, setTaskDescriptionerror] = React.useState<string>("");
  const [PriorityValue, setPriorityValue] = useState('');
  const [Priorityerror, setPriorityerror] = React.useState<string>("");
  const [assignTaskForMyself, setAssignTaskForMyself] = useState(false);
  const [addDayPlan, setAddDayPlan] = useState(false);

  const handleEstStartDateChange = (text: string) => {
    setEstStartDate(text);
  };
  const handleEstEndDateChange = (text: string) => {
    setEstEndDate(text);
  };
  const handleNameChange = (text: string) => {
    setName(text);
  };
  const handleDescriptionChange = (text: string) => {
    setDescription(text);
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

  const handlePrioritySelect = (text: string) => {
    setPriorityValue(text);
};

  const handleSubmit = () => {
    setEstStartDateError("Please Select Start Date");
    setEstEndDateError("Please Select End Date");
    setEstTimeError("Please Enter Estimation Time");
    setTaskTypeError("Please Select Task Type");
    setClassificationError("Please Select Classification");
    setPriorityerror("Please Select Priority");
    setCommentsError("Please Enter Comments");
    setNameError("Please Enter The Task Name")
    setDescriptionError("Please Add Description For The task");
    setWeekEstEndDateError("Please Select Week Ending Date");
    Vibration.vibrate();
    if (
      estStartDate.length === 0 ||
      estEndDate.length === 0 ||
      estTime.length === 0 ||
      (TaskTypeOptions.length != 0 && TaskTypeValue.length === 0 )||
      (ClassificationOptions.length != 0 && ClassificationValue.length === 0) ||
      (PriorityOptions.length != 0 && PriorityValue.length === 0) ||
      comments.length === 0 || name.length === 0 || description.length === 0
    ) {
      return;
    }
    setLoading(true);
    onSubmit(estStartDate, estTime, comments, estEndDate, name, description, TaskTypeValue, ClassificationValue,weekEndDate,TaskDescription,PriorityValue,assignTaskForMyself,addDayPlan);
  };

  useEffect(() => {
    loadConnectionList();
    PriorityList();
  }, []);

  const PriorityList = async () => {
    debugger
      try {
        const response = await axios.privateAxios.get<CommonMaster[]>("/app/CommonMaster/GetCodeTableList");
    
        const priorityTypeSet = new Set<string>();
    
        response.data.forEach((item) => {
          if (item.codeName === "PriorityType") {
            priorityTypeSet.add(item.codeValue);
          } 
        });
    
        const PriorityOptions: Option[] = Array.from(priorityTypeSet).map((codeValue) => ({
          label: codeValue,
          value: codeValue,
        }));
        setPriorityOptions(PriorityOptions);
        
      } catch (error) {
        console.log(error.response?.data);
      }
    };

  const loadConnectionList = async () => {
    debugger
    try {
      const response = await axios.privateAxios.get<TaskClassification[]>("/app/Common/GetTaskTypeClassification")
      const taskTypeSet = new Set();
      response.data.forEach((item) => {
        if (item.categoryId === categoryId) {
          taskTypeSet.add(item.taskType);
        }
      });
      const taskType = Array.from(taskTypeSet).map((codeValue) => ({
        label: codeValue,
        value: codeValue,
      }));

      const classificationSet = new Set();
      response.data.forEach((item) => {
        if (item.categoryId === categoryId) {
          classificationSet.add(item.taskclassification);
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
            {estStartDate.length === 0 && <Text style={{ color: 'red' }}>{StartDateerror}</Text>}
            <PODateTimePicker
              label={'Estimation End Date'}
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
            <POInputField
              label={'Task Name'}
              placeholder={'Task Name'}
              value={name}
              onChangeText={handleNameChange}
              secureTextEntry={false}
            />
            {name.length === 0 && <Text style={{ color: 'red' }}>{Nameerror}</Text>}
            <POInputBoxField
              label={' Task Description'}
              placeholder={'Task Description'}
              value={description}
              onChangeText={handleDescriptionChange}
              multiline={true}
            />
            {description.length === 0 && <Text style={{ color: 'red' }}>{Descriptionerror}</Text>}
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
              label="Task Type:"
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

            {PriorityOptions.length != 0 ?
                  <>
                    <DropDown
                      label="Priority"
                      placeholder="Select an option"
                      data={PriorityOptions}
                      value={PriorityValue}
                      disable={false}
                      setValue={setPriorityValue}
                      onChange={handlePrioritySelect}
                    />
                    {PriorityValue.length === 0 && <Text style={{ color: 'red', left: hp('0.5%') }}>{Priorityerror}</Text>}
                  </> : ""}
            <POInputBoxField
              label={'Comments'}
              placeholder={'Comments'}
              value={comments}
              onChangeText={handleTextareaChange}
              multiline={true}
            />
            {comments.length === 0 && <Text style={{ color: 'red' }}>{Commentserror}</Text>}

            <View style={styles.radioContainer}>
  <View style={styles.radioButtonContainer}>
    <RadioButton
      value="myself"
      status={assignTaskForMyself ? 'checked' : 'unchecked'}
      onPress={() => {
        setAssignTaskForMyself((prevState) => !prevState);
        // Add any additional logic if needed
      }}
    />
    <Text style={styles.radioText}>Assign Task for Myself</Text>
  </View>
  <View style={styles.radioButtonContainer}>
    <RadioButton
      value="dayPlan"
      status={addDayPlan ? 'checked' : 'unchecked'}
      onPress={() => {
        setAddDayPlan((prevState) => !prevState);
        // Add any additional logic if needed
      }}
    />
    <Text style={styles.radioText}>Add to Day Plan</Text>
  </View>
</View>
          </ScrollView>

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
//     borderRadius:25,
//     alignItems: 'center',
//     justifyContent: 'center',
//     //bottom: 20,
//     marginRight: -20,
//   },
//   popupButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 14,
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
  radioContainer: {
    justifyContent: 'space-around',
    marginTop:-hp('5%'),
    marginBottom: hp('3%'),
},
radioButtonContainer: {
  flexDirection:'row',
  alignItems: 'center',
  marginTop:hp('2%')
},
radioText: {
    marginLeft: wp('2%'),
    fontSize: hp('2.2%'),
},
  popupContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('4%'), // Adjusted for responsiveness
    borderTopRightRadius: wp('4%'), // Adjusted for responsiveness
    padding: wp('8%'), // Adjusted for responsiveness
    paddingTop: hp('5%'), // Add top padding for close button, Adjusted for responsiveness
    height: hp('85%'), // Adjusted for responsiveness
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popupTitle: {
    fontSize: wp('4.5%'), // Adjusted for responsiveness
    fontWeight: 'bold',
    marginBottom: hp('1.5%'), // Adjusted for responsiveness
  },
  popupButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  popupButton: {
    backgroundColor: '#35A2C1',
    height: hp('7.5%'), // Adjusted for responsiveness
    borderRadius: wp('12.5%'), // Adjusted for responsiveness
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('-4%'), // Adjusted for responsiveness
  },
  popupButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: wp('3.5%'), // Adjusted for responsiveness
  },
  CancelpopupButton: {
    height: hp('7.5%'), // Adjusted for responsiveness
    borderRadius: wp('12.5%'), // Adjusted for responsiveness
    alignItems: 'center',
    justifyContent: 'center',
    right: wp('4%'), // Adjusted for responsiveness
  },
  CancelpopupButtonText: {
    color: '#35A2C1',
    fontWeight: 'bold',
    fontSize: wp('3.5%'), // Adjusted for responsiveness
  },
  errorText: {
    color: 'red',
    marginBottom: hp('1.5%'), // Adjusted for responsiveness
  },
  closeButton: {
    position: 'absolute',
    top: hp('1.5%'), // Adjusted for responsiveness
    right: wp('2.5%'), // Adjusted for responsiveness
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


export default CategoryPopup;
