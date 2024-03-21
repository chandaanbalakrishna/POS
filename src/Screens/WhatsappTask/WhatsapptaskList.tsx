import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Share,
  ScrollView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useAxios } from '../../Contexts/Axios';
import { TaskModel } from '../../Models/TaskModel';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import LottieAnimation from '../../Components/Animation';
import EmployeeProgressTracker from '../../Components/EmployeeProgressTracker';
import { Button } from 'react-native-paper';
import POButton from '../../Components/POButton';
import { CheckBox } from 'react-native-elements';
import { Linking } from 'react-native';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import POWhatsAppListItem from '../../Components/POWhatsAppListItem';
import FloatingButton from '../../Components/FloatingButton';
import { Status } from '../../Constants/Status';
import { useAuth } from '../../Contexts/Auth';
import { EmployeeTask } from '../../Models/EmployeeTask';
import { AnimatedLottieViewProps } from 'lottie-react-native';
import { EmployeeDailyTask } from '../../Models/EmployeeDailyTask';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Animated } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TodayTabFlatList = ({ todayWorkedData, handleTaskSelection, selectedTasks }) => (
  <FlatList
    data={todayWorkedData}
    renderItem={({ item }) => (
      <POWhatsAppListItem
        Name={item.name}
        TaskDescription={item.taskDescription}
        Status={item.status}
        EstimationTime={item.estTime.toString()}
        //onPress={() => handleTaskSelection(item.id)}
        isSelected={selectedTasks.includes(item.id)}
      ></POWhatsAppListItem>
    )}
  />
);
// const CompletedTabFlatList = ({ completedData, handleTaskSelection, selectedTasks }) => (
//   <FlatList
//     data={completedData}
//     renderItem={({ item }) => (
//       <POWhatsAppListItem
//         Name={item.name}
//         TaskDescription={item.taskDescription}
//         Status={item.status}
//         EstimationTime={item.estTime.toString()}
//         //onPress={() => handleTaskSelection(item.id)}
//         isSelected={selectedTasks.includes(item.id)}
//       ></POWhatsAppListItem>
//     )}
//   />
// );
const TomorrowTabFlatList = ({ tomorrowData, handleTaskSelection, selectedTasks }) => (
  <FlatList
    data={tomorrowData}
    renderItem={({ item }) => (
      <POWhatsAppListItem
        Name={item.name}
        TaskDescription={item.taskDescription}
        Status={item.status}
        EstimationTime={item.estTime.toString()}
        //onPress={() => handleTaskSelection(item.id)}
        isSelected={selectedTasks.includes(item.id)}
      ></POWhatsAppListItem>
    )}
  />
);
//Navigation
type WhatsappTaskListProps = NativeStackNavigationProp<EmployeeStackParamList, "WhatsappTaskList">;

//Route props
type WhatsaTaskListRouteProps = RouteProp<EmployeeStackParamList, "WhatsappTaskList">;

const WhatsappTaskListScreen: React.FC = () => {
  const axios = useAxios();
  const auth = useAuth();
  const navigation = useNavigation<WhatsappTaskListProps>();
  const route = useRoute<WhatsaTaskListRouteProps>();

  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<EmployeeDailyTask[]>([]);
  const [originalList, setOriginalList] = React.useState<EmployeeDailyTask[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");
  const [selectedTasks, setSelectedTasks] = React.useState<number[]>([]);
  const employeeId = auth.loginData.employeeId;
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'today', title: 'Today' },
    //{ key: 'completed', title: 'Completed' },
    { key: 'tomorrow', title: 'Tomorrow' },
  ]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  // Define separate hooks for each filtered list
  const [todayWorkedOnList, setTodayWorkedOnList] = React.useState<EmployeeDailyTask[]>([]);
  //const [todayCompletedOrUATList, setTodayCompletedOrUATList] = React.useState<EmployeeDailyTask[]>([]);
  const [tomorrowsWorkedOnList, setTomorrowsWorkedOnList] = React.useState<EmployeeDailyTask[]>([]);
  const animatedStyle = {
    transform: [{ translateX: shakeAnimation }]
  };
  const renderScene = SceneMap({
    today: () => <TodayTabFlatList todayWorkedData={todayWorkedOnList} handleTaskSelection={handleTaskSelection} selectedTasks={selectedTasks} />,
    //completed: () => <CompletedTabFlatList completedData={todayCompletedOrUATList} handleTaskSelection={handleTaskSelection} selectedTasks={selectedTasks} />,
    tomorrow: () => <TomorrowTabFlatList tomorrowData={tomorrowsWorkedOnList} handleTaskSelection={handleTaskSelection} selectedTasks={selectedTasks} />,
  });

  const searchFunction = async (text: string) => {
    if (text) {
      const updatedData = originalList.filter((item) => {
        const Name = `${item.name.toUpperCase()}`;
        const Description = `${item.taskDescription}`;
        const textData = text.toUpperCase();
        return (
          Name.indexOf(textData) > -1 ||
          Description.indexOf(text) > -1
        );
      });
      setList(updatedData);
      setSearchValue(text);
    } else {
      setList(originalList);
      setSearchValue("");
    }
  };
  const handleBackPress = () => {
    navigation.goBack();
  };

  const today = new Date();
  const weekEndingDate = new Date(today);
  weekEndingDate.setDate(today.getDate() + (5 - today.getDay()));
  weekEndingDate.setHours(0, 0, 0, 0);

  const formattedWeekEndingDate = `${weekEndingDate.getFullYear()}-${('0' + (weekEndingDate.getMonth() + 1)).slice(-2)}-${('0' + weekEndingDate.getDate()).slice(-2)} ${('0' + weekEndingDate.getHours()).slice(-2)}:${('0' + weekEndingDate.getMinutes()).slice(-2)}:${('0' + weekEndingDate.getSeconds()).slice(-2)}.0000000`;
  console.log(formattedWeekEndingDate);

  const loadConnectionList = async () => {
    debugger;
    setLoading(true);
    try {
      const response = await axios.privateAxios.get<EmployeeDailyTask[]>("/app/EmployeeTask/GetWhatsapptaskListByTaskId?employeeId=" + employeeId + "&WeekEndingDate=" + formattedWeekEndingDate);
      setLoading(false);
      filterData(response.data);
      setOriginalList(response.data);
    } catch (error) {
      setLoading(false);
      console.log(error.response.data);
    }
  };
  // Function to filter and save data into different hooks
  const filterData = (data: EmployeeDailyTask[]) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Filter data based on different conditions
    const inProgressData = data.filter((item) => item.status === 'In-Progress' || item.status === 'Assigned');
    const todayWorkedOnData = data.filter((item) => {
      const workedOnDate = new Date(item.workedOn);
      return workedOnDate.toDateString() === today.toDateString();
    });
    // const todayCompletedOrUATData = data.filter((item) => {
    //   const workedOnDate = new Date(item.workedOn);
    //   const formattedWorkedOn = workedOnDate.toDateString();
    //   return formattedWorkedOn === today.toDateString() && (item.status === 'Completed' || item.status === 'Ready-For-UAT');
    // });
    const tomorrowsWorkedOnData = data.filter((item) => {
      const workedOnDate = new Date(item.workedOn);
      return workedOnDate.toDateString() === tomorrow.toDateString();
    });

    // Save filtered data into the respective hooks
    setTodayWorkedOnList(todayWorkedOnData);
    //setTodayCompletedOrUATList(todayCompletedOrUATData);
    setTomorrowsWorkedOnList(tomorrowsWorkedOnData);
  };
React.useEffect(() => {
    loadConnectionList();
  }, []);

  const share = async () => {
    debugger;
    let message = '';
    let taskList = [];
    const today = new Date();
    let formattedDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
    let dailyTask ="Daily Task";
    if (index === 0) {
      taskList = todayWorkedOnList;
      formattedDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
      dailyTask = "Daily Task";
    } else if (index === 1) {
      //   taskList = todayCompletedOrUATList;
      // } else if (index === 2) {
      taskList = tomorrowsWorkedOnList;
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // Add one day to the date
      formattedDate = `${tomorrow.getFullYear()}/${tomorrow.getMonth() + 1}/${tomorrow.getDate()}`;
      dailyTask = "Tomorrow's Daily Task";
    } else {
      // Handle default case or error (if needed)
      return;
    }
    const taskGroups = {};
    taskList.forEach((task) => {
      if (taskGroups.hasOwnProperty(task.projectName)) {
        taskGroups[task.projectName].push(task);
      } else {
        taskGroups[task.projectName] = [task];
      }
    });
    for (const projectName in taskGroups) {
      if (taskGroups.hasOwnProperty(projectName)) {
        const tasks = taskGroups[projectName];
        message += `*Project Name: ${projectName}*\n*${dailyTask} (${formattedDate})*\n`;
        tasks.forEach((task, index) => {
          message += `${index + 1}.${task.name} - ${task.taskDescription} - ${task.estTime}hr\n Percentage -${task.percentage}%\n Actual Time - ${task.actTime}hr\n`;
        });
        message += '\n';
      }
    }
    const whatsappMessage = `*Task List*\n${message}`;
    let url = '';
    if (Platform.OS === 'android') {
      url = `whatsapp://send?text=${encodeURIComponent(whatsappMessage)}`;
     
      try {
        const supported = await Linking.canOpenURL(url);
        debugger;
        if (supported) {
          await Linking.openURL(url);
          axios.privateAxios
          .post<boolean>("/app/EmployeeDailyTask/TaskIsShared?employeeId=" + employeeId)
          .then((response) => {
            console.log(response)
          })
          .catch((error) => {
              setLoading(false);
              console.log(error.response.data);
          });
        } else {
          await Linking.openURL(url);
        }
      } catch (error: any) {
        alert(error.message);
      }
    } else if (Platform.OS === 'ios') {
      try {
        await Share.share({
          message: whatsappMessage,
          url: undefined,
          title: 'Share via',
        });
        axios.privateAxios
        .post<boolean>("/app/EmployeeDailyTask/TaskIsShared?employeeId=" + employeeId)
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
            setLoading(false);
            console.log(error.response.data);
        });
      } catch (error) {
        alert(error.message);
      }
    }
    //const url = `whatsapp://send?text=${encodeURIComponent(whatsappMessage)}`;
   
  };
  const handleTaskSelection = (taskId) => {
    const isSelected = selectedTasks.includes(taskId);

    if (isSelected) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };
  const renderTabBar = (props: any) => {
    const inputRange = props.navigationState.routes.map((x: any, i: number) => i);
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route: any, i: number) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex: number) => (inputIndex === i ? 1 : 0.5)),
          });

          return (
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setIndex(i)}
              key={i}
            >
              <Animated.Text style={[styles.tabTitle, { opacity }]}>
              {route.title}
            </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  const handleIndexChange = (newIndex: number) => setIndex(newIndex);

  return (
    <>
      <View style={styles.container}>
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

          <Text style={styles.headingText}>Whatsapp Task List</Text>
        </View>

        {/* <View style={styles.searchbar}>
          <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
          <TextInput
            placeholder="Search"
            onChangeText={(text) => searchFunction(text)}
            value={searchvalue}
            style={styles.searchInput}
          />
        </View> */}

        <View style={styles.bottomView}>
          {loading && (
            <LottieAnimation
              source={require('../../../assets/icons/Loading.json')}
              autoPlay={true}
              loop={true}       />
          )}
          <View style={{ flex: 1 }}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={handleIndexChange}
            style={{flex:1}}
          />
          </View>
            <View style={{bottom:60}}>
            <Animated.View style={[styles.whatsappButton, animatedStyle]}>
              <TouchableOpacity activeOpacity={1} onPress={share}>
                <FontAwesome name="whatsapp" size={30} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
              </View>
        </View>

      </View>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A9EC2',
  },
  topView: {
    marginTop: hp('5%'),
    marginHorizontal: wp('6%'),
    backgroundColor: '#3A9EC2',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headingText: {
    marginRight: wp('12%'),
    top: hp('0.6%'),
    textAlign: 'center',
    fontSize: wp('7%'),
    color: '#fff',
    fontWeight: 'bold',
    marginLeft:wp('3%')
  },
  bottomView: {
    flex: 6,
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('13%'),
    borderTopRightRadius: wp('13%'),
    paddingBottom: hp('18%'),
  },
  titleText: {
    marginHorizontal: wp('13%'),
    marginVertical: hp('2.5%'),
    fontWeight: 'bold',
    fontSize: wp('5%'),
  },
  searchbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    width: wp('95%'),
    height: hp('8%'),
    borderRadius: wp('17%'),
    marginBottom: hp('6.25%'),
    left: wp('1.67%'),
  },
  ProfileIcon: {
    width: wp('10%'),
    transform: [{ rotateY: '180deg' }],
  },
  searchInput: {
    color: '#BEBEBE',
    marginLeft: wp('4.2%'),
    opacity: 0.5,
    fontSize: wp('5.3%'),
  },
  taskName: {
    marginBottom: hp('1.25%'),
    fontSize: wp('4.3%'),
    fontWeight: 'bold',
  },
  estTime: {
    marginTop: hp('1.25%'),
    fontSize: wp('3.5%'),
    color: '#888',
  },
  backButton: {
    left: wp('-0.84%'),
    top: hp('0.4%'),
  },
  whatsappShare: {
    width: wp('80%'),
    backgroundColor: '#25D366',
    alignSelf: 'center',
    position: 'absolute',
    height: hp('5%'),
    top: hp('3.75%'),
  },
  StickyButton: {
    position: 'absolute',
    right: wp('5.33%'),
    width: wp('20%'),
    height: hp('5%'),
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: hp('1.07%'),
    marginHorizontal: wp('4.27%'),
    padding: wp('5.33%'),
    borderRadius: wp('2.67%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp('0.67%') },
    shadowOpacity: 0.2,
    shadowRadius: wp('1.07%'),
    elevation: wp('2%'),
    paddingBottom: hp('18%'),
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDetails: {
    marginLeft: wp('4.27%'),
  },
  description: {
    marginTop: hp('0.53%'),
    marginBottom: hp('1.07%'),
    fontSize: wp('3.5%'),
  },
  emptyMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: wp('4.8%'),
    color: 'gray',
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: wp('4.27%'),
  },
  whatsappButton: {
    position: 'absolute',
    top: hp('3.75%'),
    right: wp('5.33%'),
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: wp('8%'),
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabTitle: {
    borderBottomWidth: wp('0.53%'), // Add a borderBottom to create a line
    borderBottomColor: 'Black', // Set the color of the line
    fontSize: wp('4.27%'),
    fontWeight: 'bold',
  },
});

export default WhatsappTaskListScreen;
