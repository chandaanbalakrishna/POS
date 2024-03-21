import React from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, Modal, KeyboardAvoidingView, TouchableOpacity, Vibration, SafeAreaView } from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
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
import { widthPercentageToDP as wp,heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { EmployeeDailyTask } from '../../Models/EmployeeDailyTask';

type PlanScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "DayPlanTaskDetails">;

type TaskListRouteProps = RouteProp<EmployeeStackParamList, "DayPlanTaskDetails">;

const DayPlanTaskDetailsScreen: React.FC = () => {

    const axios = useAxios();
    const auth = useAuth();
    const route = useRoute<TaskListRouteProps>();
    const navigation = useNavigation<PlanScreenProp>();


    const [loading, setLoading] = React.useState(false);
    const [list, setList] = React.useState<TaskModel[]>([]);
    const [selectedTaskId] = React.useState(route.params?.TaskId);
    const [TaskId] = React.useState(route.params?.taskId);
    const [TaskId1] = React.useState(route.params?.taskId1);
    const [ProjectId] = React.useState(route.params?.ProjectId);
    const [Percentage] = React.useState(route.params?.percentage);
    const [Name, setName] = React.useState<string>(route.params.Name);
    const [Descr, setDescr] = React.useState<string>(route.params.description);
    const [priority] = React.useState<string>(route.params.priority);
    const [status, setstatus] = React.useState<string>(route.params.status);
    const [isPopupVisible, setIsPopupVisible] = React.useState(false);
    const employeeId = auth.loginData.employeeId;
    const [ProjectName] = React.useState<string>(route.params.ProjectName);
    const [Assignedtask, setAssigendTask] = React.useState<boolean>();
    const [Id] = React.useState(route.params?.Id);
    const weekDate = (route.params?.weekEndDate);
    //const [employeeTaskId] = React.useState(route.params?.Id);
    const [listEmpTask, setListEmpTask] = React.useState<number>();
    const [estimate] = React.useState(route.params?.estimate); 
    const [originalList, setOriginalList] = React.useState([]);
    console.log(TaskId)
    console.log(TaskId1)
    React.useEffect(() => {
        Promise.all([
            loadConnectionList(),
            getEmployeeTask(),
            getDailytask()
        ])
    }, []);

    const currentDate = new Date();
    const daysUntilFriday = 5 - currentDate.getDay(); // Friday is day 5
    const endOfWeekDate = new Date(currentDate);
    endOfWeekDate.setDate(currentDate.getDate() + daysUntilFriday);
    const formattedEndOfWeekDate = endOfWeekDate.toISOString().split('T')[0];
    const date = weekDate.toString().split('T')[0];
   


    const loadConnectionList = async () => {
        debugger
        setLoading(true);
        axios.privateAxios
            .get<boolean>("/app/EmployeeTask/GetEmployeeTaskbyId?EmployeeId=" + employeeId + "&TaskId=" + selectedTaskId)
            .then((response) => {
                setLoading(false);
                setAssigendTask(response.data);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error.response.data);
            });
    };

    const getEmployeeTask = async () => {
        debugger
        setLoading(true);
        axios.privateAxios
            .get<DayPlanModel>("/app/EmployeeTask/GetAssignedEmployeeTaskById?projectId=" + ProjectId + "&TaskId=" + selectedTaskId)
            .then((response) => {
                debugger;
                setLoading(false);
                setListEmpTask(response.data.id);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error.response.data);
            });
    };

    const getDailytask = async () => {
        debugger
        setLoading(true);
        axios.privateAxios
            .get<EmployeeDailyTask[]>("/app/EmployeeDailyTask/GetEmployeeDailyTask?EmployeeId=" + employeeId)
            .then((response) => {
                debugger;
                setLoading(false);
                const today = new Date();
                const todayList = response.data.filter((item) => {
                    const workedOnDate = new Date(item.workedOn);
                    const formattedWorkedOn = workedOnDate.toDateString();
                    return formattedWorkedOn === today.toDateString();
                });
                const employeeTaskIds = todayList.map((item) => item.employeeTaskId);
               setOriginalList(employeeTaskIds)
            })
            .catch((error) => {
                setLoading(false);
                console.log(error.response.data);
            });
    };
    



    const CreateTask = () => {
        setIsPopupVisible(true)
    };
    const CreateDayPlan = () => {
        debugger;
        navigation.navigate('AddDayPlanTaskDetails', { employeeTaskId: listEmpTask, projectName: ProjectName, taskName: Name, ProjectId: ProjectId, taskId: selectedTaskId,priority:priority })
    };


    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };
    const handleBackPress = () => {
        navigation.goBack();
    };

    const commentsScreen = async (data: DayPlanModel) => {
        debugger
        navigation.navigate('Comments', { TaskId: selectedTaskId, EmployeeTaskId: listEmpTask, Name: Name, ProjectId: ProjectId, EmployeeDailyTaskId: undefined })
    }

    const handleSubmit = (estStartDate: Date, estTime: number, comments: string, estEndDate: Date, weekEndDate: Date) => {
        debugger
        const AssignRequest: DayPlanModel = {
            employeeId: employeeId,
            id:Id,
            taskId: selectedTaskId,
            projectId: ProjectId,
            name: Name,
            description: Descr,
            startDate: estStartDate,
            endDate: estEndDate,
            estTime: estTime,
            actTime: 0,
            weekEndingDate: weekEndDate,
            status: status,
            priority: priority,
            percentage: Percentage,
            estStartDate: estStartDate,
            estEndDate: estEndDate,
            Comment: comments,
            createdBy: employeeId.toString()
        };

        if (Percentage !== 100 && formattedEndOfWeekDate !== date && status !== "Unassigned") {
            axios.privateAxios
              .post<DayPlanModel>("/app/EmployeeTask/MoveTask", AssignRequest)
              .then((response) => { 
                debugger;
                console.log(response.data);
                showMessage({
                  message: 'Task Moved Successfully!',
                  type: 'success',
                  duration: 3000,
                  floating: true,
                  icon: () => (
                    <Ionicons name="checkmark-circle-outline" size={20} />
                  ),
                });
                navigation.navigate("DayPlanTaskScreen", { ProjectId: ProjectId, ProjectName: ProjectName });
              })
              .catch((error) => {
                console.log(error.response.data);
                showMessage({
                  message: 'Error occurred',
                  type: 'danger',
                  duration: 3000,
                  floating: true,
                  icon: () => (
                    <Ionicons name="alert-circle-outline" size={20} />
                  ),
                });
                handleClosePopup();
              });
          } else {
            axios.privateAxios
              .post<DayPlanModel>("/app/EmployeeTask/AssignEmployeeTask", AssignRequest)
              .then((response) => {
                debugger;
                console.log(response.data);
                showMessage({
                  message: 'Task Assigned Successfully!',
                  type: 'success',
                  duration: 3000,
                  floating: true,
                  icon: () => (
                    <Ionicons name="checkmark-circle-outline" size={20} />
                  ),
                });
                navigation.navigate("DayPlanTaskScreen", { ProjectId: ProjectId, ProjectName: ProjectName });
              })
              .catch((error) => {
                console.log(error.response.data);
                showMessage({
                  message: 'Error occurred',
                  type: 'danger',
                  duration: 3000,
                  floating: true,
                  icon: () => (
                    <Ionicons name="alert-circle-outline" size={20} />
                  ),
                });
                handleClosePopup();
              });
    }
 }

    return (
        <View style={styles.container}>
            <FlashMessage position="top" style={{ height: 60, marginTop: 40 }} textStyle={{ marginTop: 10, fontSize: 18 }} />
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

                <Text style={styles.headingText}>Task Assignment</Text>
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
                <ScrollView>
                    <View style={styles.input}>
                        <POInputField
                            label={"Name"}
                            placeholder={"Name"}
                            value={Name}
                            onChangeText={setName}
                            secureTextEntry={false}
                            keyboardType={"default"}
                            editable={false}
                            NonEditablelabel='Name'
                        ></POInputField>

                        <POInputBoxField
                            label="Description"
                            placeholder="Description"
                            value={Descr}
                            onChangeText={setDescr}
                            secureTextEntry={false}
                            editable={false}
                            NonEditablelabel='Description'
                            icon={"copy"}
                        ></POInputBoxField>

                        <POInputField
                            label={"Status"}
                            placeholder={"Status"}
                            value={status}
                            onChangeText={setstatus}
                            secureTextEntry={false}
                            keyboardType={"default"}
                            editable={false}
                            NonEditablelabel='Status'
                        ></POInputField>

                        <POInputField
                            label={"Estimate"}
                            placeholder={"Estimate"}
                            value={estimate}
                            onChangeText={setstatus}
                            secureTextEntry={false}
                            keyboardType={"default"}
                            editable={false}
                            NonEditablelabel='Estimate'
                        ></POInputField>
                        {/* <View>
                            {image !== "" && image !== null && image !== undefined ? (
                                <TouchableOpacity onPress={handleImagePress}>
                                    <Image
                                        source={{ uri: `data:image/png;base64,${image}` }}
                                        style={styles.popupImage}
                                    />
                                </TouchableOpacity>

                            ) : (
                                null
                            )}
                            <Modal visible={isImageEnlarged} transparent={true} onRequestClose={handleImagePress}>
                                <View style={styles.modalContainer}>
                                    <TouchableOpacity onPress={handleImagePress} style={styles.modalBackground}>
                                        <Image
                                            source={{ uri: `data:image/png;base64,${image}` }}
                                            style={styles.enlargedImage}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                        </View> */}

                        <View style={[styles.icons]}>
                            {status === "Unassigned" ? (
                                <View style={[styles.text]}>
                                    <TouchableOpacity style={[styles.Assign]} onPress={CreateTask}>
                                        <FontAwesome name="tasks" size={35} color="#fff" />
                                    </TouchableOpacity>
                                    <Text>Assign Tasks</Text>
                                </View>
                            ) : null}

                     
{Percentage !== 100 && formattedEndOfWeekDate !== date && status !== "Unassigned" ? (
  <View style={styles.text}>
    <TouchableOpacity style={styles.Assign} onPress={CreateTask}>
      <MaterialIcons name="drive-file-move-outline" size={35} color="#fff" />
    </TouchableOpacity>
    <Text>Move Task</Text>
  </View>
) : (
  (status !== "Unassigned" &&
    ((!originalList.includes(TaskId) && TaskId1 === undefined) ||
      (!originalList.includes(TaskId1) && (TaskId === undefined) && (TaskId1 > 0)))) ? (
    <View style={styles.text}>
      <TouchableOpacity style={styles.Assign} onPress={CreateDayPlan}>
        <MaterialCommunityIcons name="clock-edit-outline" size={35} color="#fff" />
      </TouchableOpacity>
      <Text>Day Plan</Text>
    </View>
  ) : null
)}


                            <View style={[styles.text]}>
                                <TouchableOpacity style={[styles.Assign]} onPress={commentsScreen}>
                                    <FontAwesome name="comments" size={35} color="#fff" />
                                </TouchableOpacity>
                                <Text>Comments</Text>
                            </View>
                            <AssignTaskPopup
                                isVisible={isPopupVisible}
                                onClose={handleClosePopup}
                                onSubmit={handleSubmit}
                            />
                        </View>
                    </View>
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
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     modalBackground: {
//         backgroundColor: 'black',
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     enlargedImage: {
//         width: 400,
//         height: 400,
//         resizeMode: 'contain',
//     },
//     popupImage: {
//         width: 80,
//         height: 80,
//         left: 10
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
//         paddingBottom: 50
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
//         margin: 10,
//         bottom: 15
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
//         top: 1,
//         bottom: 20
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
//         bottom: 65,
//         right: 20,
//         width: 130,
//         height: 40,
//         backgroundColor: '#35A2C1',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     text: {
//         alignItems: 'center',
//         marginTop: 10

//     },

//     icons: {
//         bottom: 10,
//         flexDirection: 'row',
//         justifyContent: 'space-between',

//     },
//     Assign: {
//         bottom: 10,
//         width: 60,
//         height: 60,
//         top: 5,
//         borderRadius: 30,
//         backgroundColor: '#35A2C1',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3A9EC2',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackground: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    enlargedImage: {
        width: 400,
        height: 400,
        resizeMode: 'contain',
    },
    popupImage: {
        width: 80,
        height: 80,
        left: 10
    },
    topView: {
        marginTop: hp('6%'),
        marginHorizontal: wp('10%'),
        backgroundColor: '#3A9EC2',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headingText: {
        position: 'absolute',
        top: hp('2.7%'),
        textAlign: 'center',
        fontSize: wp('7%'),
        color: '#fff',
        fontWeight: 'bold',
    },
    bottomView: {
        flex: 6,
        backgroundColor: '#fff',
        borderTopLeftRadius: wp('12%'),
        borderTopRightRadius: wp('12%'),
        padding: wp('4%'),
        
    },
    title: {
        marginHorizontal: wp('7%'),
        marginVertical: hp('2%'),
        fontWeight: 'bold',
        fontSize: wp('4.5%'),
    },
    titleText: {
        marginHorizontal: wp('7%'),
        marginVertical: hp('2.5%'),
        fontWeight: 'bold',
        fontSize: wp('5%'),
    },
    input: {
        margin: wp('2.5%'),
       
    },
    AssignButton: {
        backgroundColor: '#35A2C1',
        height: hp('6.5%'),
        borderRadius: wp('2%'),
        alignItems: 'center',
        justifyContent: 'center',
        top: hp('4%'),
        margin: wp('5%'),
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: wp('4.5%'),
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
        padding: hp('3%'),
        marginHorizontal: wp('4%'),
        alignSelf: 'stretch',
        height: hp('40%'),
        width: wp('90%'),
    },
    popupTitle: {
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
        marginBottom: hp('2.5%'),
    },
    textarea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: wp('2%'),
        padding: wp('2%'),
        height: hp('12%'),
        marginBottom: hp('2%'),
    },
    popupButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    popupButton: {
        backgroundColor: '#35A2C1',
        height: hp('6.5%'),
        borderRadius: wp('2%'),
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginRight: wp('2.5%'),
    },
    popupButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: wp('3.5%'),
    },
    loginButton: {
        backgroundColor: '#35A2C1',
        height: hp('5.5%'),
        width: wp('80%'),
        borderRadius: wp('2.5%'),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp('4%'),
        left: wp('7.5%'),
        bottom: hp('4%'),
    },
    heading: {
        fontWeight: 'bold',
        fontSize: wp('4.5%'),
        marginLeft: wp('5%'),
        marginTop: hp('2.5%'),
    },
    backButton: {
        position: 'absolute',
        left: -wp('1.5%'),
        bottom: hp('2.8%'),
    },
    animation: {
        position: 'absolute',
        width: wp('140%'),
        height: hp('140%'),
    },
    StickyButton: {
        position: 'absolute',
        bottom: hp('8.5%'),
        right: wp('10%'),
        width: wp('40%'),
        height: hp('7%'),
        backgroundColor: '#35A2C1',
        justifyContent: 'center',
        alignItems: 'center',
    },
   
    text: {
        alignItems: 'center',
        marginTop: hp('1.5%'),
    },
    icons: {
        bottom: hp('0.5%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    Assign: {
        bottom: hp('1.5%'), 
        width: wp('15%'),  
        height: wp('15%'),  
        top: hp('0.5%'),     
        borderRadius: wp('7.5%'), 
        backgroundColor: '#35A2C1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progress:{
      marginTop: -hp('2%')
    },
    Bottom:{
      height:hp('7%')
    },
    scroll:{
        height:hp('10%')
    }
    });

export default DayPlanTaskDetailsScreen;
