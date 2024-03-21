import React, { useEffect } from 'react';
import {View,StyleSheet,Text,TextInput,FlatList,TouchableOpacity,SafeAreaView,Share,ScrollView,} from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from '@expo/vector-icons';
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
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


//Navigation
type WhatsappTaskListProps = NativeStackNavigationProp<EmployeeStackParamList, "WhatsappTaskList">;

//Route props
type WhatsaTaskListRouteProps = RouteProp<EmployeeStackParamList, "WhatsappTaskList">;

const WhatsappCompletedTaskListScreen: React.FC = () => {
  const axios = useAxios();
  const auth = useAuth();
  const navigation = useNavigation<WhatsappTaskListProps>();
  const route = useRoute<WhatsaTaskListRouteProps>();

  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<EmployeeTask[]>([]);
  const [originalList, setOriginalList] = React.useState<EmployeeTask[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");
  const [selectedTasks, setSelectedTasks] = React.useState<number[]>([]);
  const [filteredList, setFilteredList] = React.useState<EmployeeTask[]>([]);

  const employeeId = auth.loginData.employeeId;


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


  const filterTasksByStatus = () => {
    const filteredData = list.filter((item) =>item.status === Status.Completed || item.status === Status.ReadyForUAT);
    return filteredData;
  };
 
  useEffect(() => {
    const filteredTasks = filterTasksByStatus();
    setFilteredList(filteredTasks);
  }, [list]);
  
  const loadConnectionList = async () => {
    debugger;
    setLoading(true);
    try {
      const response = await axios.privateAxios.get<EmployeeTask[]>("/app/EmployeeDailyTask/GetCompletedWhatsapptaskListByTaskId?employeeId="+employeeId+"&WeekEndingDate="+formattedWeekEndingDate);
      setLoading(false);
      setList(response.data);
      setOriginalList(response.data);
    } catch (error) {
      setLoading(false);
      console.log(error.response.data);
    }
  };
  
React.useEffect(() => {
    loadConnectionList();
  }, []);

  const share = async () => {
    debugger;
    let message = '';
    const taskList = list.filter((item) => selectedTasks.includes(item.id));
    const today = new Date();
    const formattedDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;

    const pendingTasks = list.filter((task) => task.status === Status.InProgress);

  
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
        message += `*Project Name: ${projectName}*\n *Completed Task (${formattedDate})*\n`;
        tasks.forEach((task, index) => {
          message += `${index + 1}.${task.name} - ${task.taskDescription} - ${task.estTime}hr\n`;
        });
        message += '\n';
      }
    }
    if (pendingTasks.length > 0) {
      message += `*Pending Task (${formattedDate})*\n`;
      pendingTasks.forEach((task, index) => {
        message += `${index + 1}.${task.name} - ${task.taskDescription} - ${task.estTime}hr\n`;
      });
      message += '\n';
    }
    const whatsappMessage = `*Task List*\n${message}`;
    const url = `whatsapp://send?text=${encodeURIComponent(whatsappMessage)}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(url);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };



  const handleTaskSelection = (taskId) => {
    const isSelected = selectedTasks.includes(taskId);

    if (isSelected) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  

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

        <View style={styles.searchbar}>
          <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
          <TextInput
            placeholder="Search"
            onChangeText={(text) => searchFunction(text)}
            value={searchvalue}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.bottomView}>
          <Text style={styles.titleText}>Choose Task To Share On WhatsApp{`\n`}
            Selected Count ({selectedTasks.length})</Text>
          {loading && (
            <LottieAnimation
              source={require('../../../assets/icons/Loading.json')}
              autoPlay={true}
              loop={true}       />
          )}
          <FlatList
            data={filteredList}
            renderItem={({ item }) => (
              <POWhatsAppListItem
                Name={item.name}
                TaskDescription={item.taskDescription}
                EstimationTime={item.estTime.toString()}
                onPress={() => handleTaskSelection(item.id)}
                isSelected={selectedTasks.includes(item.id)}
              ></POWhatsAppListItem>
            )}
          />
          {selectedTasks.length > 0 && (
            <FloatingButton
              title='Share To WhatsApp'
              variant='contained'
              onPress={share}
              style={styles.whatsappShare}
              icon='whatsapp'
            />
          )}
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
    marginTop: 30,
    marginHorizontal: 24,
    backgroundColor: '#3A9EC2',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headingText: {
    marginRight: 50,
    top: 5,
    textAlign: 'center',
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomView: {
    flex: 6,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingBottom: 150
  },
  titleText: {
    marginHorizontal: 26,
    marginVertical: 20,
    fontWeight: 'bold',
    fontSize: 20,
  },
  searchbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '95%',
    height: 50,
    borderRadius: 30,
    marginBottom: 25,
    //bottom:50,
    left: 10,
  },
  ProfileIcon: {
    width: 40,
    transform: [{ rotateY: '180deg' }],
  },
  searchInput: {
    color: '#BEBEBE',
    marginLeft: 15,
    opacity: 0.5,
    fontSize: 20,
  },
  taskName: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  estTime: {
    marginTop: 5,
    fontSize: 14,
    color: '#888',
  },
  backButton: {
    left: -5,
    top: 4,
  },
  whatsappShare: {
    width: '80%',
    backgroundColor: '#25D366',
    alignSelf: 'center',
    position: 'absolute',
    height: 40,
    top: 30
  },
  StickyButton: {
    position: 'absolute',
    right: 20,
    width: 150,
    height: 40,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    paddingBottom: 150
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDetails: {
    marginLeft: 16,
  },
  description: {
    marginTop: 4,
    marginBottom: 8,
    fontSize: 14,
  },
  emptyMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  },

});

export default WhatsappCompletedTaskListScreen;
