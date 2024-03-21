import React from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, Modal, KeyboardAvoidingView, TouchableOpacity,Vibration,SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAxios } from '../../Contexts/Axios';
import { TaskModel } from '../../Models/TaskModel';
import { RouteProp, useRoute } from '@react-navigation/native';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import POInputField from '../../Components/POSInputField';
import POButton from '../../Components/POButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DayPlanModel } from '../../Models/DayPlanModel';
import { useAuth } from '../../Contexts/Auth';
import TaskDetailsPopup from '../../Components/CreateTaskPopup';
import POInputBoxField from '../../Components/POInputBoxField';
import LottieAnimation from '../../Components/Animation';
import EmployeeProgressTracker from '../../Components/EmployeeProgressTracker';
import { EmployeeTask } from '../../Models/EmployeeTask';
import AssignTaskPopup from '../../Components/AssignTaskPopup';
import FloatingButton from '../../Components/FloatingButton';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import PODateTimePicker from '../../Components/PODateTimePicker';
import { EmployeeDailyTask } from '../../Models/EmployeeDailyTask';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type AddDayPlanScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "AddDayPlanTaskDetails">;

type TaskListRouteProps = RouteProp<EmployeeStackParamList, "AddDayPlanTaskDetails">;

const AddDayPlanTaskDetailsScreen: React.FC = () => {

    const axios = useAxios();
    const auth = useAuth();
    const route = useRoute<TaskListRouteProps>();
    const navigation = useNavigation<AddDayPlanScreenProp>();


    const [loading, setLoading] = React.useState(false);
    const [list, setList] = React.useState<TaskModel[]>([]);
    const [ProjectId] = React.useState(route.params?.ProjectId);
    const [isPopupVisible, setIsPopupVisible] = React.useState(false);
    const employeeId = auth.loginData.employeeId;
    const [Assignedtask, setAssigendTask] = React.useState<boolean>();
    const [date, setDate] = React.useState(new Date);
    const [DateError, setEndDateError] = React.useState<string>("");
    const [estTime, setEstTime] = React.useState('');
    const [EstTimeerror, setEstTimeError] = React.useState<string>("");
    const [description, setDescription] = React.useState('');
    const [Descriptionerror, setDescriptionError] = React.useState<string>("");
    const [EmployeeTaskId] = React.useState(route.params.employeeTaskId);
    const [Priority] = React.useState(route.params.priority)
    const [TaskName] = React.useState(route.params.taskName);
    const [TaskId] = React.useState(route.params.taskId);
    React.useEffect(() => {
       
    }, []);

    
    

    const CreateTask = () => {
        setIsPopupVisible(true)
    };
    const CreateDayPlan = () => {
        debugger
        setLoading(true);
        const DayPlanRequest: EmployeeDailyTask = {
            employeeId: employeeId,
            taskId: TaskId,
            employeeTaskId: EmployeeTaskId,
            projectObjectiveId: 1,
            projectId: ProjectId,
            name: TaskName,
            employeeName : "",
            projectName: "",
            comment : "",
            status:"In-Progress",
            description: description,
            estTime: Number(estTime),
            weekEndingDate: undefined,
            priority: Priority,
            workedOn:date
        };
        axios.privateAxios
            .post<EmployeeDailyTask>("/app/EmployeeDailyTask/AddEmployeeDayPlan", DayPlanRequest)
            .then((response) => {
                console.log(response.data);
                setLoading(false);
                showMessage({
                    message: 'Day Plan Added Successfully!',
                    type: 'success',
                    duration: 3000,
                    floating: true,
                    icon: () => (
                        <Ionicons name="checkmark-circle-outline" size={20} />
                    ),
                });
                navigation.navigate('Plan')
            })
            .catch((error) => {
                debugger;
                setLoading(false);
                showMessage({
                    message: 'error occured',
                    type: 'danger',
                    duration: 3000,
                    floating: true,
                    icon: () => (
                        <Ionicons name="alert-circle-outline" size={20} />
                    ),
                });
            });
    };
    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };
    const handleBackPress = () => {
        navigation.goBack();
    };
    return (
        <View style={styles.container}>
             <FlashMessage position="top" style ={{height:60,marginTop:40}} textStyle ={{marginTop:10,fontSize:18}}/>
            <View style={[styles.topView]}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons
                        name="chevron-back"
                        size={30}
                        color="#fff"
                        style={styles.backButton}
                        onPress={handleBackPress}
                    />
                </TouchableOpacity>

                <Text style={styles.headingText}>Add Daily Task</Text>
            </View>

            <View style={styles.bottomView}>
            <SafeAreaView style={styles.progress}>
    <EmployeeProgressTracker></EmployeeProgressTracker>
      
  </SafeAreaView>
                <Text style={styles.titleText}>Task Details</Text>
                {loading && (
                    <LottieAnimation
                        source={require('../../../assets/icons//Loading.json')}
                        autoPlay={true}
                        loop={true}
                        visible={loading}
                    />
                )}
                
                <ScrollView >
                    <View style={styles.input}>
                        <PODateTimePicker
                            label={'Date'}
                            placeholder={'Date'}
                            value={date}
                            onChangeText={setDate}
                            minimumDate={new Date()}
                        />
                        {!date && <Text style={{ color: 'red',left:10 }}>{DateError}</Text>}
                        <POInputField
                            label={'Estimation Time'}
                            placeholder={'Estimation Time'}
                            value={estTime}
                            onChangeText={setEstTime}
                            secureTextEntry={false}
                            maxLength={3}
                            keyboardType='number-pad'
                        />
                        {estTime.length === 0 && <Text style={{ color: 'red' }}>{EstTimeerror}</Text>}

                        <POInputBoxField
                            label={' Task Description'}
                            placeholder={'Task Description'}
                            value={description}
                            onChangeText={setDescription}
                            multiline={true}
                        />
                        {description.length === 0 && <Text style={{ color: 'red' }}>{Descriptionerror}</Text>}
                        <View style={styles.popupButtonContainer}>
              
              
            </View>
            </View>
            <FloatingButton
                title="save"
                variant='contained'
                onPress={CreateDayPlan}
                style={styles.popupButton}
                titleStyle={styles.popupButtonText}
                icon='arrow-right-bold-circle'
              />
                    </ScrollView>
                    <View style={styles.scroll}>

                    </View>
                    
            </View>
           
        </View>
    );
};

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#3A9EC2',
//     },
//     topView: {
//         marginTop: 30,
//         marginHorizontal: 24,
//         backgroundColor: '#3A9EC2',
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     headingText: {
//         position: 'absolute',
//         top: 15,
//         textAlign: 'center',
//         fontSize: 30,
//         color: '#fff',
//         fontWeight: 'bold',
//     },
//     bottomView: {
//         flex: 6,
//         backgroundColor: '#fff',
//         borderTopLeftRadius: 50,
//         borderTopRightRadius: 50,
//         Padding: 20,
//     },
//     title: {
//         marginHorizontal: 26,
//         marginVertical: 16,
//         fontWeight: 'bold',
//         fontSize: 20,
//     },

//     titleText: {
//         marginHorizontal: 26,
//         marginVertical: 20,
//         fontWeight: 'bold',
//         fontSize: 20,
//     },

//     input: {
//             paddingHorizontal: 20,
//             bottom: -10
//     },
//     AssignButton: {
//         backgroundColor: '#35A2C1',
//         height: 50,
//         borderRadius: 8,
//         alignItems: 'center',
//         justifyContent: 'center',
//         top: 30,
//         margin: 20
//     },
//     buttonText: {
//         color: '#FFFFFF',
//         fontWeight: 'bold',
//         fontSize: 18,
//     },
//     popupContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     popupContent: {
//         backgroundColor: '#fff',
//         borderRadius: 15,
//         padding: 50,
//         marginHorizontal: 20,
//         alignSelf: 'stretch',
//         height: 500,
//         width: "90%"
//     },
//     popupTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 15,
//     },
//     textarea: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 8,
//         padding: 8,
//         height: 100,
//         marginBottom: 10,
//     },
//     popupButtonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',

//     },
//     popupButton: {
//         backgroundColor: '#35A2C1',
//         height: 50,
//         borderRadius: 8,
//         alignItems: 'center',
//         justifyContent: 'center',
//         flex: 1,
//         marginRight: 10,
//         width:"70%",
//     },
//     popupButtonText: {
//         color: '#FFFFFF',
//         fontWeight: 'bold',
//         fontSize: 14,
//     },
//     loginButton: {
//         backgroundColor: '#35A2C1',
//         height: 45,
//         width: "80%",
//         borderRadius: 10,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: 20,
//         left: 30,
//         bottom:20
//     },
//     heading: {
//         fontWeight: 'bold',
//         fontSize: 20,
//         marginLeft: 20,
//         marginTop: 10,
//     },
//     backButton: {
//         position: 'absolute',
//         left: 0,
//         bottom: 28,
//     },
//     animation: {
//         position: 'absolute',
//         width: '140%',
//         height: '140%',
//     },
//     StickyButton: {
//         position: 'absolute',
//         bottom:70,
//         right: 20,
//         width: 130,
//         height: 40,
//         backgroundColor: '#35A2C1',
//         justifyContent: 'center',
//         alignItems: 'center',
//       },
//       cancelPopupButton: {
//         height: 50,
//         borderRadius: 25,
//         alignItems: 'center',
//         justifyContent: 'center',
//         right: 20,
//       },
//       cancelPopupButtonText: {
//         color: '#35A2C1',
//         fontWeight: 'bold',
//         fontSize: 14,
//       },
// });
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3A9EC2',
    },
    topView: {
        marginTop: hp('5%'),
        marginHorizontal: wp('5%'),
        backgroundColor: '#3A9EC2',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headingText: {
        position: 'absolute',
        top: hp('2.8%'), // Adjust the value as needed
        textAlign: 'center',
        fontSize: hp('3.5%'), // Adjust the value as needed
        color: '#fff',
        fontWeight: 'bold',
    },
    bottomView: {
        flex: 6,
        backgroundColor: '#fff',
        borderTopLeftRadius: wp('12%'),
        borderTopRightRadius: wp('12%'),
        padding: wp('5%'),
    },
    title: {
        marginHorizontal: wp('8%'),
        marginVertical: hp('2%'),
        fontWeight: 'bold',
        fontSize: hp('2.5%'),
    },
    titleText: {
        marginHorizontal: wp('6%'),
        marginVertical: hp('2.5%'),
        fontWeight: 'bold',
        fontSize: hp('2.5%'),
    },
    input: {
        paddingHorizontal: wp('4%'),
        marginBottom: hp('-1%')
    },
    AssignButton: {
        backgroundColor: '#35A2C1',
        height: hp('7%'),
        borderRadius: wp('4%'),
        alignItems: 'center',
        justifyContent: 'center',
        top: hp('5%'),
        marginHorizontal: wp('5%')
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: hp('2%'),
    },
    popupContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popupContent: {
        backgroundColor: '#fff',
        borderRadius: wp('3%'),
        padding: wp('10%'),
        marginHorizontal: wp('5%'),
        alignSelf: 'stretch',
        height: hp('50%'),
        width: wp('90%')
    },
    popupTitle: {
        fontSize: hp('2%'),
        fontWeight: 'bold',
        marginBottom: hp('2%'),
    },
    textarea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: wp('2%'),
        padding: wp('2%'),
        height: hp('8%'),
        marginBottom: hp('1%'),
    },
    popupButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    popupButton: {
        backgroundColor: '#35A2C1',
        height: hp('6%'),
        borderRadius: wp('4%'),
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginRight: wp('4%'),
        marginBottom:hp('0.5%'),
    },
    popupButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: hp('1.5%'),
    },
    loginButton: {
        backgroundColor: '#35A2C1',
        height: hp('5%'),
        width: wp('80%'),
        borderRadius: wp('3%'),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp('4%'),
        left: wp('15%'),
        bottom: hp('4%')
    },
    heading: {
        fontWeight: 'bold',
        fontSize: hp('2.5%'),
        marginLeft: wp('5%'),
        marginTop: hp('2%'),
    },
    backButton: {
        position: 'absolute',
        left: wp('0'),
        bottom: hp('2.5%'),
    },
    animation: {
        position: 'absolute',
        width: wp('140%'),
        height: hp('140%'),
    },
    StickyButton: {
        position: 'absolute',
        bottom: hp('10%'),
        right: wp('5%'),
        width: wp('40%'),
        height: hp('8%'),
        backgroundColor: '#35A2C1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelPopupButton: {
        height: hp('7%'),
        borderRadius: wp('6.5%'),
        alignItems: 'center',
        justifyContent: 'center',
        right: wp('5%'),
    },
    cancelPopupButtonText: {
        color: '#35A2C1',
        fontWeight: 'bold',
        fontSize: hp('1.5%'),
    },
    progress:{
        marginTop: -hp('2.1%')
      },
    Save:{
      height:hp('10%')
   },
   scroll:{
    height:hp('10%')
}
});

export default AddDayPlanTaskDetailsScreen;
