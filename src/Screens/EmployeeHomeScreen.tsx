import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput, ScrollView, Modal, Button, Platform, RefreshControl } from 'react-native';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CustomCountCard from '../Components/CustomCountCard';
import DashboardCard from '../Components/DashBoardCard';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EmployeeStackParamList } from '../Routes/EmployeeStack';
import { useAuth } from '../Contexts/Auth';
import axios from 'axios';
import { useAxios } from '../Contexts/Axios';
import { LoginDetails } from '../Models/Login/LoginDetails';
import { EmployeeStat } from '../Models/EmployeeStatistic';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { FontAwesome } from '@expo/vector-icons';
import { Constants } from '../Constants/Constants';
import info from "expo-constants"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { WorkFlow } from '../Models/WorkFlow';
import { showMessage } from 'react-native-flash-message';



type HomeScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "Home">;
const HomeScreen: React.FC = () => {
  const auth = useAuth();
  const axios = useAxios();
    const navigation = useNavigation<HomeScreenProp>();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<LoginDetails[]>([]);
  const [stat, setStat] = React.useState<EmployeeStat>();
  const [InTime, setInTime] = useState(false);
  const [OutTime, setOutTime] = useState(false);
  const employeeId = auth.loginData.employeeId;
  const [lastRecordId, setLastRecordId] = useState();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const empPhoto = auth.loginData.empPhoto;
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [workflow,setworkflow] = useState<WorkFlow[]>([]);

  const version = info.manifest?.version
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  
  const formattedCurrentDate = `${year}-${month}-${day}`;
 
  const handleTrashIconClick = () => {
    setShowPopup(true);
  };

  const handleCancelDelete = () => {
    setShowPopup(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const handleLoginDetail = () => {
    setIsLoginModalVisible(true);
  }
  const getEmployeeStat = async () => {
    setLoading(true);
    setRefreshing(true)
    await axios.privateAxios
      .get<EmployeeStat>("/app/Employee/GetEmployeeStatDetails")
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        setStat(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response.data);
      });

  }
  const getEmployeeLoginDetails = async () => {
    setLoading(true);
    await axios.privateAxios
      .get<LoginDetails[]>("/app/EmployeeTime/GetEmployeeTimeDetails")
      .then((response) => {
        setLoading(false);
        setList(response.data);
        if (response.data.length === 0) {
          setOutTime(true);
          setInTime(false);
          scheduleNotification();
        }
        else if (response.data.length > 0) {
          const lastRecord = response.data[response.data.length - 1];
          if (lastRecord.outTime === null) {
            setInTime(true);
            setOutTime(false);
            setLastRecordId(lastRecord.id);
          } else {
            setInTime(false);
            setOutTime(true);
          }
        }
        else {
          setInTime(true);
          setOutTime(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response.data);
      });
  }

 
// if(workflow != null){
//   debugger
//   var data = workflow.date.toString().slice(0, 10);
// }

   

  const UpdateImage = async () => {
    debugger;
    setIsPopupVisible(false)
    setLoading(true);
  };

  useEffect(() => {
    const currentHour = new Date().getHours();
    let newGreeting = '';

    if (currentHour >= 0 && currentHour < 12) {
      newGreeting = 'Good Morning!';
    } else if (currentHour >= 12 && currentHour < 18) {
      newGreeting = 'Good Afternoon!';
    } else {
      newGreeting = 'Good Evening!';
    }
    
    setGreeting(newGreeting);
    getEmployeeLoginDetails();
    getEmployeeStat();
  
    //Push Notification
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
   
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };

  },[]);
  
  useFocusEffect(
    React.useCallback(() => {
      const getWorkFlowDetails = async () => {
        try {
          setLoading(true);
          const response = await axios.privateAxios.get<WorkFlow[]>(
            `/app/EmployeeTime/GetWorkflow?employeeId=${employeeId}&date=${formattedCurrentDate}`
          );
          setLoading(false);
          debugger
          setworkflow(response.data);
        } catch (error) {
          setLoading(false);
          console.log(error.response.data);
        }
      };
  
      getWorkFlowDetails();
    }, [employeeId, formattedCurrentDate])
  );
  
  // Move the scheduling code to a separate function
  async function scheduleNotification() {
    // Set the notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    // Schedule the notification
    (list.length === 0) ? (
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Look at that notification',
          body: 'Please Add the In Time',
        },
        trigger: null,
      })
    ) : null;
  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getEmployeeStat} />
        }>
          <View style={styles.topview}>
            <View style={styles.welcomecontainer}>
              <Text style={styles.welcomemessage}>
                Hello,{'\n'}
                <Text>{auth.loginData.userName}</Text>
              </Text>
              {empPhoto === "Sample" ? (
                <TouchableOpacity onPress={() => setIsPopupVisible(true)}>
                  <View style={styles.circle} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setIsPopupVisible(true)}>
                  <Image
                    source={{ uri: `data:image/png;base64,${empPhoto}` }}
                    style={styles.circleImage}
                  />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.greetingText}>{greeting} Have A Nice Day</Text>

            <View>
              {/* <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
            <TextInput placeholder="Search" style={styles.searchInput} /> */}
            </View>
          </View>
          <View style={styles.bottomview}>
            <CustomCountCard elevated style={styles.customCardContainer}>
              <View style={styles.customCardItem}>
                <Text style={styles.customCardItemText}>Project</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Projects')}>
                  <Text style={styles.customCardItemCount}>{stat && stat.totalProject ? stat.totalProject : 0}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.separatorLine} />
              <View style={styles.customCardItem}>
                <Text style={styles.customCardItemText}>Task</Text>
                <TouchableOpacity onPress={() => navigation.navigate('EmployeeStatisticsList', { status: 'Task' })}>
                  <Text style={styles.customCardItemCount}>{stat && stat.totalTask ? stat.totalTask : 0}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.separatorLine} />
              <View style={styles.customCardItem}>
                <Text style={styles.customCardItemText}>In-Progress</Text>
                <TouchableOpacity onPress={() => navigation.navigate('EmployeeStatisticsList', { status: 'In-Progress' })}>
                  <Text style={styles.customCardItemCount}>{stat && stat.inProgressTask ? stat.inProgressTask : 0}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.separatorLine} />
              <View style={styles.customCardItem}>
                <Text style={styles.customCardItemText}>Completed</Text>
                <TouchableOpacity onPress={() => navigation.navigate('EmployeeStatisticsList', { status: 'Completed' })}>
                  <Text style={styles.customCardItemCount}>{stat && stat.completedTask ? stat.completedTask : 0}</Text>
                </TouchableOpacity>
              </View>
            </CustomCountCard>
            <Text style={styles.optionText}>Choose your Option</Text>

            <View style={styles.row}>
            <DashboardCard
                title={"Employee\nTime"}
                icon={require('../../assets/icons/computer.png')}
                //onPress={handleLoginDetail}
                onPress={() =>  navigation.navigate('EmployeeTime')}
              />
              <DashboardCard
                title="Task"
                icon={require('../../assets/icons/task.png')}
                onPress={() => navigation.navigate('Task')}
              />
             
              {workflow.length > 0 && workflow[0]?.workflowId === 1 ? (
                <DashboardCard
                title={`Employee\nTask`}
                icon={require('../../assets/icons/planning.png')}
                onPress={() => navigation.navigate('Plan')}
               />
              ) : (
                 <DashboardCard
                 title={`Employee\nTask`}
                 icon={require('../../assets/icons/planning.png')}
                 isBlurred={true} 
                 onPress={() => 
                  showMessage({
                    message: 'Add InTime',
                    type: 'danger',
                    duration: 3000,
                    floating: true,
                    icon: () => (
                        <Ionicons name="checkmark-circle-outline" size={20} />
                    ),
                })
                }
               />
              
              )}
            </View>
            <View style={styles.row}>
            {workflow.length > 0 && workflow[1]?.workflowId === 2 ?  (
              <DashboardCard
                title="Employee Daily Task"
                icon={require('../../assets/icons/Time.png')}
                onPress={() => navigation.navigate('Time')}
              />
              ) : (
                <DashboardCard
                title="Employee Daily Task"
                icon={require('../../assets/icons/Time.png')}
                isBlurred={true} 
                onPress={() =>
                  showMessage({
                    message: 'Please Update Task in Whatsapp',
                    type: 'danger',
                    duration: 3000,
                    floating: true,
                    icon: () => (
                        <Ionicons name="checkmark-circle-outline" size={20} />
                    ),
                })
                 }
              />
              )}

             {workflow.length > 0 && workflow[1]?.workflowId === 2 ? (
              <DashboardCard
                title="WhatsApp Task List"
                icon={require('../../assets/icons/whatsapp.png')}
                onPress={() => navigation.navigate('WhatsappTaskList')}
              />
              ) : (
               <DashboardCard
                title="WhatsApp Task List"
                icon={require('../../assets/icons/whatsapp.png')}
                isBlurred={true} 
                onPress={() => 
                  showMessage({
                    message: 'Please Assign Task',
                    type: 'danger',
                    duration: 3000,
                    floating: true,
                    icon: () => (
                        <Ionicons name="checkmark-circle-outline" size={20} />
                    ),
                })
                }
              />

                )}
              <DashboardCard
                title="My Work History"
                icon={require('../../assets/icons/work-history.png')}
                onPress={() => navigation.navigate('WorkHistory')}
              />
           
            </View>
            <View style={styles.row}>
            <DashboardCard
                title={`Release Notes`}
                icon={require('../../assets/icons/release.png')}
                onPress={() => navigation.navigate('ReleaseNotesProjectList')}
              />

              <DashboardCard
                title="Scrum"
                icon={require('../../assets/icons/ScrumImage1.png')}
                 onPress={() => navigation.navigate('ScrumUpdateScreen')}
              />
              <DashboardCard
                title="Projects"
                icon={require('../../assets/icons/project.png')}
                onPress={() => navigation.navigate('Projects')}
              />
              
            </View>
            <View style={styles.row}>
              <Text style={styles.option}>Version-{version}</Text>
              <Text style={styles.option}>{Constants.Base_Type}</Text>
            </View>
          </View>

        </ScrollView>
        <Modal visible={isPopupVisible} animationType="slide" transparent={true}>
          <View style={styles.popupContainer}>
            <View style={styles.popupContent}>
              <TouchableOpacity onPress={UpdateImage} style={styles.closeButton}>
                <Ionicons name="close" size={25} color="#333" />
              </TouchableOpacity>
              <View>
                <Image
                  source={{ uri: `data:image/png;base64,${empPhoto}` }}
                  style={styles.popupImage}
                />

              </View>

              <Text>{auth.loginData.userName}</Text>
              <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.iconButton} >
                  <FontAwesome name="eye" size={28} color="#3A9EC2" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton} onPress={openModal}>
                  <FontAwesome name="pencil" size={28} color="#3A9EC2" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleTrashIconClick}>
                  <FontAwesome name="trash-o" size={28} color="#3A9EC2" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}
async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
    console.log(token);
  }

  return token;
}

// const styles = StyleSheet.create({
//   topview: {
//     marginTop: 60,
//     marginHorizontal: 24,
//     backgroundColor: "#3A9EC2",
//     flex: 1,
//     justifyContent: "space-between"
//   },
//   welcomemessage: {
//     color: "#fff",
//     fontSize: 35,
//     fontWeight: "bold"
//   },
//   searchbar: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     alignItems: "center",
//     width: "100%",
//     height: 40,
//     borderRadius: 10,
//     marginBottom: 65
//   },
//   circle: {
//     borderRadius: 25,
//     height: 50,
//     width: 50,
//     backgroundColor: "#fff"
//   },
//   circle1: {
//     borderRadius: 28,
//     height: 50,
//     width: 50,
//     backgroundColor: "#3A9EC2"
//   },
//   welcomecontainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center"
//   },
//   greetingText: {
//     color: "#fff",
//     bottom:20,
//     fontWeight:'bold'
//   },
//   searchInput: {
//     color: "#BEBEBE",
//     marginLeft: 15,
//     opacity: 0.5,
//     fontSize: 20
//   },
//   bottomview: {
//     flex:1,
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 50,
//     borderTopRightRadius: 50,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#3A9EC2",
//   },
//   ProfileIcon: {
//     width: 40,
//     transform: [{ rotateY: '180deg' }]
//   },
//   optionText: {
//     marginHorizontal: 26,
//     marginVertical: 20,
//     fontWeight: 'bold',
//     fontSize: 20,
//   },
//   customCardItem: {
//     alignItems: 'center',
//   },
//   customCardContainer: {
//     backgroundColor: '#fff',
//     marginHorizontal: 24,
//     marginTop: -40,
//     padding: 30,
//     borderRadius: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   customCardItemText: {
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   customCardItemCount: {
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   bottomMenu: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     margin: 26,
//     backgroundColor: '#fff',
//   },
//   NavBar: {
//     position: "absolute",
//     bottom: 0,
//     width: "100%"
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     marginBottom: 10,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     width: '50%',
//     height: '100%',
//     borderTopLeftRadius: 16,
//     borderBottomLeftRadius: 16,
//     padding: 16,
//   },
//   closeButton: {
//     alignItems: 'flex-end',
//     marginBottom: 16,
//   },
//   option: {
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   assistButton: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//   },
//   assistButtonText: {
//     backgroundColor: '#f44336',
//     color: 'white',
//     padding: 10,
//     fontSize: 16,
//   },
//   modalContainer1: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent1: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//   },
//   closeButton1: {
//     alignItems: 'flex-end',
//   },
//   option1: {
//     paddingVertical: 10,
//   },
//   optionText1: {
//     fontSize: 16,
//     color: '#333',
//     fontWeight:'bold'
//   },
//   loginButton: {
//     backgroundColor: '#35A2C1',
//     height: 50,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   tableBorder: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   tableHeader: {
//     height: 40,
//     backgroundColor: '#f1f8ff',
//   },
//   tableHeaderText: {
//     margin: 6,
//     textAlign: 'center',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   tableRowText: {
//     margin: 6,
//     textAlign: 'center',
//     fontSize: 14,
//     color:"black"
//   },
//   separatorLine: {
//     borderBottomWidth: 1,
//     borderBottomColor: 'gray',
//     marginVertical: 10,
//   },
//   circleImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: '#fff',
//   },
//   popupContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.1)',
//   },
//   popupContent: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   popupImage: {
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     marginBottom: 20,
//   },
//   iconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-around',
//     width: '100%',
//   },
//   iconButton: {
//     padding: 10,
//     borderRadius: 5,
//   },

// });
const styles = StyleSheet.create({
  topview: {
    marginTop: hp('9%'),
    marginHorizontal: wp('4%'),
    backgroundColor: "#3A9EC2",
    flex: 1,
    justifyContent: "space-between"
  },
  welcomemessage: {
    color: "#fff",
    fontSize: hp('4%'),
    fontWeight: "bold"
  },
  searchbar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    width: wp('100%'),
    height: hp('4.4%'),
    borderRadius: wp('3.3%'),
    marginBottom: hp('8%'),
  },
  circle: {
    borderRadius: wp('13.75%'),
    height: hp('6.25%'),
    width: hp('6.25%'),
    backgroundColor: "#fff",
  },
  circle1: {
    borderRadius: wp('14%'),
    height: hp('6.25%'),
    width: hp('6.25%'),
    backgroundColor: "#3A9EC2",
  },
  welcomecontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  greetingText: {
    color: "#fff",
    bottom: hp('1.5%'),
    fontWeight: 'bold',
    fontSize: hp('2%'),
  },

  searchInput: {
    color: "#BEBEBE",
    marginLeft: wp('4%'),
    opacity: 0.5,
    fontSize: hp('2.5%'),
  },
  bottomview: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: wp('13%'),
    borderTopRightRadius: wp('13%'),
  },
  container: {
    flex: 1,
    backgroundColor: "#3A9EC2",
  },
  ProfileIcon: {
    width: wp('10%'),
    transform: [{ rotateY: '180deg' }]
  },
  optionText: {
    marginHorizontal: wp('8%'),
    marginVertical: hp('2%'),
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
  },
  customCardItem: {
    alignItems: 'center',
  },
  customCardContainer: {
    backgroundColor: '#fff',
    marginHorizontal: wp('3%'),
    marginTop: hp('-2%'),
    padding: wp('7%'),
    borderRadius: wp('3.3%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customCardItemText: {
    fontWeight: 'bold',
    marginBottom: hp('1.25%'),

  },
  customCardItemCount: {
    fontWeight: 'bold',
    fontSize: hp('2.25%'),
  },
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('10%'),
    marginVertical: hp('2.5%'),
    backgroundColor: '#fff',
  },
  NavBar: {
    position: "absolute",
    bottom: 0,
    width: "100%"
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: hp('1%'),
  },
  scrollContainer: {
    flexGrow: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    width: wp('50%'),
    height: '100%',
    borderTopLeftRadius: wp('3.2%'),
    borderBottomLeftRadius: wp('3.2%'),
    padding: wp('4.3%'),
  },
  closeButton: {
    alignItems: 'flex-end',
    marginBottom: hp('2.5%'),
  },
  option: {
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  assistButton: {
    position: 'absolute',
    bottom: hp('2.5%'),
    right: wp('2.5%'),
  },
  assistButtonText: {
    backgroundColor: '#f44336',
    color: 'white',
    paddingVertical: hp('1.25%'),
    paddingHorizontal: wp('2.5%'),
    fontSize: hp('1.8%'),
  },
  modalContainer1: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent1: {
    backgroundColor: 'white',
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    padding: wp('5.3%'),
  },
  closeButton1: {
    alignItems: 'flex-end',
  },
  option1: {
    paddingVertical: hp('1.25%'),
  },
  optionText1: {
    fontSize: hp('2%'),
    color: '#333',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#35A2C1',
    height: hp('6.25%'),
    borderRadius: wp('4.3%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('1.25%'),
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: hp('2.25%'),
  },
  tableBorder: {
    borderWidth: wp('0.5%'),
    borderColor: '#ccc',
  },
  tableHeader: {
    height: hp('5%'),
    backgroundColor: '#f1f8ff',
  },
  tableHeaderText: {
    margin: wp('1.5%'),
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: hp('2%'),
  },
  tableRowText: {
    margin: wp('1.5%'),
    textAlign: 'center',
    fontSize: hp('1.75%'),
    color: 'black',
  },
  separatorLine: {
    borderBottomWidth: hp('0.2%'),
    marginVertical: hp('1.5%'),
  },
  circleImage: {
    width: wp('18%'),
    height: wp('18%'),
    borderRadius: wp('9%'),
    backgroundColor: '#fff',
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  popupContent: {
    backgroundColor: '#fff',
    padding: wp('5%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
  },
  popupImage: {
    width: wp('60%'),
    height: wp('60%'),
    borderRadius: wp('30%'),
    marginBottom: hp('2.5%'),
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  iconButton: {
    padding: wp('2.5%'),
    borderRadius: wp('1.25%'),
  },

});



export default HomeScreen;
