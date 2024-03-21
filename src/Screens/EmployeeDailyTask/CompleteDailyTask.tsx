import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, KeyboardAvoidingView, Vibration, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';
import { useAxios } from '../../Contexts/Axios';
import LottieAnimation from '../../Components/Animation';
import PODateTimePicker from '../../Components/PODateTimePicker';
import POInputField from '../../Components/POSInputField';
import POInputBoxField from '../../Components/POInputBoxField';
import FloatingButton from '../../Components/FloatingButton';
import { Task } from '../../Models/Task';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { EmployeeDailyTask } from '../../Models/EmployeeDailyTask';
import { useAuth } from '../../Contexts/Auth';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import DevChecklistPopup from '../../Components/DevCheckListPopup';
import { TaskCheckList } from '../../Models/TaskCheckList';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type CompleteDailyTaskProp = NativeStackNavigationProp<EmployeeStackParamList, "CompleteDailyTask">;

type CompleteDailyTaskProps = RouteProp<EmployeeStackParamList, "CompleteDailyTask">;

const CompleteDailyTask: React.FC = () => {

    const axios = useAxios();
    const auth = useAuth();
    const route = useRoute<CompleteDailyTaskProps>();
    const navigation = useNavigation<CompleteDailyTaskProp>();

    const [percentageValue] = React.useState(route.params.Percentage)
    const [actStartDate, setActStartDate] = useState('');
    const [actEndDate, setActEndDate] = useState('');
    const [actTime, setActTime] = useState('');
    const [comments, setComments] = useState('');
    const [actStartDateError, setActStartDateError] = useState("");
    const [actEndDateError, setActEndDateError] = useState("");
    const [actTimeError, setActTimeError] = useState("");
    const [commentsError, setCommentsError] = useState("");
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState<number>(percentageValue ?? 0);
    const [PercentageError, setPercentageError] = useState("");
    const [isConnectionListLoaded, setIsConnectionListLoaded] = useState(false);
    const [selectedTaskId] = React.useState(route.params.TaskId);
    const [EmployeeDailyTaskId] = React.useState(route.params.EmployeeDailyTaskId);
    const [EmployeeTaskId] = React.useState(route.params.EmployeeTaskId);
    const [EstTime] = React.useState(route.params.EstTime);
    const [ProjectId] = React.useState(route.params.ProjectId);
    const [Name] = React.useState<string>(route.params.Name);
    const [Descr] = React.useState<string>(route.params.description);
    const [Status] = React.useState<string>(route.params.status);
    const workedOn = new Date()
    const employeeId = auth.loginData.employeeId;
    const [UserStoryUiId, setUserStoryUiId] = React.useState<number>();
    const [taskChecklistData, setTaskChecklistData] = useState([]);
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [categoryName, setcategoryName] = useState<string>();
    const [subcategoryName, setsubcategoryName] = useState<string>();

    const handleTogglePopup = () => {
        setShowPopup(!showPopup);
    };
    const handleCancel =() => {
        navigation.goBack();
    }

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
            setActStartDateError("Estimation Start Date cannot be in the future");
            Vibration.vibrate();
        } else if (selectedStartDate > selectedEndDate) {
            setActStartDateError("Estimation Start Date cannot be after Estimation End Date");
            Vibration.vibrate();
        } else {
            setActStartDateError("");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            debugger
            try {
                setLoading(true);
                const connectionListResponse = await axios.privateAxios.get<Task[]>("/app/EmployeeDailyTask/GetEmployeeDevChecklist?TaskId=" + selectedTaskId);
                setcategoryName(connectionListResponse.data[0].category.categories);
                    setsubcategoryName(connectionListResponse.data[0].category.subCategory);
                if (connectionListResponse.data.length > 0) {
                    setUserStoryUiId(connectionListResponse.data[0].userStoryUIId);
                    
                    setIsConnectionListLoaded(true);
                    const taskChecklistResponse = await axios.privateAxios.get<TaskCheckList[]>("app/EmployeeDailyTask/GetEmployeeTaskChecklist?UserStoryUIID=" + connectionListResponse.data[0].userStoryUIId);
                    setTaskChecklistData(taskChecklistResponse.data);
                } else {
                    setIsConnectionListLoaded(false);
                    setTaskChecklistData([]);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);     
                console.log(error.response.data);
            }
        };

        loadData();
    }, []);





    const handleActTimeChange = (text: string) => {
        setActTime(text);
    };

    const handleTextareaChange = (text: string) => {
        setComments(text);
    };

    const handleSubmit = () => {
        debugger
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
            comments.length === 0 || percentage > 100
        ) {
            return;
        }
        if (percentage > 100) {
            setPercentageError("Percentage cannot be more than 100");
            return;
        }

        setLoading(true);
        const AssignRequest: EmployeeDailyTask = {
            id: EmployeeDailyTaskId,
            employeeId: employeeId,
            taskId: selectedTaskId,
            employeeTaskId: EmployeeTaskId,
            projectObjectiveId: 1,
            projectId: ProjectId,
            name: Name,
            employeeName: "",
            projectName: "",
            description: Descr,
            startDate: actStartDate,
            endDate: actEndDate,
            estTime: EstTime,
            actTime: actTime,
            weekEndingDate: undefined,
            status: Status,
            priority: "high",
            percentage: percentage,
            comment: comments,
            workedOn: workedOn,
            taskChecklistId:selectedItemIds
        };
        axios.privateAxios
            .post<EmployeeDailyTask>("/app/EmployeeDailyTask/AddEmployeeDailyTask", AssignRequest)
            .then((response) => {
                console.log(response.data);
                setLoading(false);
                showMessage({
                    message: 'Daily Task Updated Successfully!',
                    type: 'success',
                    duration: 3000,
                    floating: true,
                    icon: () => (
                        <Ionicons name="checkmark-circle-outline" size={20} />
                    ),
                });
                navigation.navigate('Time')
                setShowPopup(false);
            })
            .catch((error) => {
                console.log(error)
                setLoading(false);
                showMessage({
                    message: `${error}`,
                    type: 'danger',
                    duration: 3000,
                    floating: true,
                    icon: () => (
                        <Ionicons name="alert-circle-outline" size={20} />
                    ),
                });
            });
    }

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
            return '#4287f5';
        }
    };

    const handlePercentageChange = (value: number) => {
        setPercentage(value);
    };
    const handleBackPress = () => {
        navigation.goBack();
    };
    const handleDevChecklistSubmit = (selectedItemIds: number[]) => {
        setSelectedItemIds(selectedItemIds);
        setShowPopup(false); 
    };


    return (
        <View style={styles.container}>
            <FlashMessage position="top" style={{ height: 60, marginTop: 40 }} textStyle={{ marginTop: 10, fontSize: 18 }} />
            <View style={[styles.topView]}>
                <Ionicons
                    name="chevron-back"
                    size={30}
                    color="#fff"
                    style={styles.backButton}
                    onPress={handleBackPress}
                />
                <Text style={styles.headingText}>Complete My Task</Text>
            </View>

            <View style={styles.bottomView}>
                {loading && (
                    <View style={styles.loadingContainer}>
                        <LottieAnimation
                            source={require('../../../assets/icons/Loading.json')}
                            autoPlay={true}
                            loop={true}
                            visible={loading}
                        />
                    </View>
                )}
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
                        keyboardType='number-pad'
                    />
                    {actTime.length === 0 && <Text style={{ color: 'red' }}>{actTimeError}</Text>}

                    <POInputField
                        label={'Percentage'}
                        placeholder={'Percentage'}
                        value={percentage === 0 ? '0' : percentage.toString()}
                        onChangeText={handlePercentageChange}
                        secureTextEntry={false}
                        maxLength={3}
                        keyboardType='number-pad'
                    />
                    {percentageValue > 100 && (
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

                    {isConnectionListLoaded && percentage == 100  ? (

                          selectedItemIds.length > 0 ? (
                            <View style={styles.popupButtonContainer}>
                                <FloatingButton
                                    title="Cancel"
                                    variant="outlined"
                                    onPress={handleCancel}
                                    style={styles.cancelPopupButton}
                                    titleStyle={styles.cancelPopupButtonText}
                                    icon="cancel"
                                />
                                <FloatingButton
                                    title="Submit"
                                    variant="contained"
                                    onPress={handleSubmit}
                                    style={styles.popupButton}
                                    titleStyle={styles.popupButtonText}
                                    icon="arrow-right-bold-circle"
                                />
                            </View>
                        ) : (
                            <FloatingButton
                                title="Continue To Checklist"
                                variant="contained"
                                onPress={handleTogglePopup}
                                style={styles.continueButton}
                                titleStyle={styles.popupButtonText}
                                icon={''}
                            />
                        )
                    ) : (
                        <View>
                            <View style={styles.popupButtonContainer}>
                                <FloatingButton
                                    title="Cancel"
                                    variant="outlined"
                                    onPress={handleCancel}
                                    style={styles.cancelPopupButton}
                                    titleStyle={styles.cancelPopupButtonText}
                                    icon="cancel"
                                />
                                <FloatingButton
                                    title="Submit"
                                    variant="contained"
                                    onPress={handleSubmit}
                                    style={styles.popupButton}
                                    titleStyle={styles.popupButtonText}
                                    icon="arrow-right-bold-circle"
                                />
                            </View>
                        </View>
                    )}
                    

                </ScrollView>
                <View style={styles.scroll}>
                </View>
                <DevChecklistPopup
                    isVisible={showPopup}
                    onClose={() => setShowPopup(false)}
                    onSubmit={handleDevChecklistSubmit}
                    taskChecklistData={taskChecklistData}
                    selectedItems={selectedItemIds}
                    categoryName={categoryName}
                    subcategoryName={subcategoryName}
                />

            </View>
        </View>
    );
};

// const styles = StyleSheet.create({
//     popupContainer: {
//         flex: 1,
//         justifyContent: 'flex-end',
//     },
//     popupContent: {
//         backgroundColor: '#fff',
//         borderTopLeftRadius: 15,
//         borderTopRightRadius: 15,
//         padding: 30,
//         paddingTop: 40,
//         height: '85%',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     popupTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     popupButtonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         bottom: 20
//     },
//     popupButton: {
//         backgroundColor: '#35A2C1',
//         height: 50,
//         borderRadius: 8,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginRight: -20,
//     },
//     popupButtonText: {
//         color: '#FFFFFF',
//         fontWeight: 'bold',
//         fontSize: 14,
//     },
//     cancelPopupButton: {
//         height: 50,
//         borderRadius: 25,
//         alignItems: 'center',
//         justifyContent: 'center',
//         right: 20,
//     },
//     cancelPopupButtonText: {
//         color: '#35A2C1',
//         fontWeight: 'bold',
//         fontSize: 14,
//     },
//     errorText: {
//         color: 'red',
//         marginBottom: 10,
//     },
//     closeButton: {
//         position: 'absolute',
//         top: 10,
//         right: 10,
//         zIndex: 999,
//     },
//     loadingContainer: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(255, 255, 255, 1)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 999,
//     },
//     progress: {
//         height: 5,
//         borderRadius: 5,
//     },
//     progressContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     percentageText: {
//         color: '#256D85',
//         fontSize: 14,
//         fontWeight: 'bold',
//         marginLeft: 10,
//     },
//     progressBar: {
//         flex: 1,
//         borderRadius: 5,
//         backgroundColor: '#E0E0E0',
//         marginLeft: 20,
//         width: 180,
//     },
//     continueButton: {
//         backgroundColor: '#35A2C1',
//         height: 50,
//         borderRadius: 8,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: 20,
//     },
//     container: {
//         flex: 1,
//         backgroundColor: '#3A9EC2',
//     },
//     scrollView: {
//         flex: 1,
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
//         left: 10,
//         bottom: 14
//     },
//     topView: {
//         marginTop: 30,
//         marginHorizontal: 24,
//         backgroundColor: '#3A9EC2',
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         flexDirection: 'row',
//     },
//     headingText: {
//         marginRight: 50,
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
//         padding: 20,
//         paddingBottom: 50
//     },
//     backButton: {
//         left: -5,
//         top: 17,
//     },
// });

const styles = StyleSheet.create({
    popupContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    popupContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: wp('5%'),
        borderTopRightRadius: wp('5%'),
        padding: wp('8%'),
        paddingTop: hp('6%'),
        height: hp('85%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: wp('3%'),
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
        bottom: hp('2%'),
    },
    popupButton: {
        backgroundColor: '#35A2C1',
        height: hp('6%'),
        borderRadius: wp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: wp('-4%'),
    },
    popupButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: wp('3.5%'),
    },
    cancelPopupButton: {
        height: hp('6%'),
        borderRadius: wp('12.5%'),
        alignItems: 'center',
        justifyContent: 'center',
        right: wp('4%'),
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
        top: hp('1%'),
        right: wp('2%'),
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
        height: hp('0.5%'),
        borderRadius: hp('0.5%'),
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    percentageText: {
        color: '#256D85',
        fontSize: wp('3.5%'),
        fontWeight: 'bold',
        marginLeft: wp('2%'),
    },
    progressBar: {
        flex: 1,
        borderRadius: hp('0.5%'),
        backgroundColor: '#E0E0E0',
        marginLeft: wp('5%'),
        width: wp('45%'),
    },
    continueButton: {
        backgroundColor: '#35A2C1',
        height: hp('6%'),
        borderRadius: wp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp('2%'),
    },
    container: {
        flex: 1,
        backgroundColor: '#3A9EC2',
    },
    scrollView: {
        flex: 1,
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
        width: wp('80%'),
        height: wp('80%'),
        resizeMode: 'contain',
    },
    popupImage: {
        width: wp('15%'),
        height: wp('15%'),
        left: wp('1.5%'),
        bottom: hp('1.5%'),
    },
    topView: {
        marginTop: hp('2%'),
        marginHorizontal: wp('6%'),
        backgroundColor: '#3A9EC2',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    headingText: {
        marginRight: wp('12%'),
        top: hp('1.5%'),
        textAlign: 'center',
        fontSize: wp('6%'),
        color: '#fff',
        fontWeight: 'bold',
    },
    bottomView: {
        flex: 6,
        backgroundColor: '#fff',
        borderTopLeftRadius: wp('12%'),
        borderTopRightRadius: wp('12%'),
        padding: wp('5%'),
        paddingBottom: hp('5%'),
    },
    backButton: {
        left: wp('-1%'),
        top: hp('1.5%'),
    },
    scroll:{
        height:hp('10%')
    }
});


export default CompleteDailyTask;
