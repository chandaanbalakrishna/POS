import React from 'react';
import { View, StyleSheet, Text, TextInput, FlatList,TouchableOpacity,KeyboardAvoidingView, Linking } from 'react-native';
import { RouteProp, useNavigation,useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from '@expo/vector-icons';
import PlanScreen from '../DayPlanScreens/PlanScreen';
import { Project } from '../../Models/Project';
import { useAxios } from '../../Contexts/Axios';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import POProjectListItem from '../../Components/POProjectListItem';
import LottieAnimation from '../../Components/Animation';
import { Task } from '../../Models/Task';
import ReleaseNotesListItem from '../../Components/ReleaseNotesListItem';
import FloatingButton from '../../Components/FloatingButton';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type ReleaseNotesShareProps = NativeStackNavigationProp<EmployeeStackParamList, "ReleaseNotesShare">;
type ReleaseNotesShareRouteProps = RouteProp<EmployeeStackParamList, "ReleaseNotesShare">;
const ReleaseNotesShare: React.FC = () => {
  const axios = useAxios();
  const navigation = useNavigation<ReleaseNotesShareProps>();

  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<Task[]>([]);
  const [originalList, setOriginalList] = React.useState<Task[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");
  const [isPopupVisible, setIsPopupVisible] = React.useState(false);
  const route = useRoute<ReleaseNotesShareRouteProps>();
  const projectId = route.params.ProjectId;
  const projectName = route.params.projectName;
  const [selectedTaskIds, setSelectedTaskIds] = React.useState([]);
  React.useEffect(() => {
    loadConnectionList();
  }, []);

  const onSelect = async (data: Task) => {
    navigation.navigate("ReleaseNotesShare",
    );
  }
  const share = async () => {
    debugger;
    let message = '';
     const taskList = selectedTasks
    const today = new Date();
    const formattedDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
     message = `*Project Name: ${projectName}*\n\n`;
    taskList.forEach((task, index) => {
      message += `${index + 1}. ${task.name} - ${task.taskDescription}\n`;
    });
    const whatsappMessage = `*Release Notes ${formattedDate}*\n${message}`;
    const url = `whatsapp://send?text=${encodeURIComponent(whatsappMessage)}`;
  
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // Handle the case where WhatsApp is not installed
        alert('WhatsApp is not installed on your device');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };
  const searchFunction = async (text: string) => {
    if (text) {
      const updatedData = originalList.filter((item) => {
        const Name = `${item.name.toUpperCase()}`;
        const Type = `${item.taskDescription}`;
        const Description = `${item.description}`;
        const textData = text.toUpperCase();
        return (
          Name.indexOf(textData) > -1 ||
          Type.indexOf(textData) > -1 ||
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
  const handleCheckboxToggle = (taskId) => {
    setSelectedTaskIds((prevSelectedTaskIds) =>
      prevSelectedTaskIds.includes(taskId)
        ? prevSelectedTaskIds.filter((id) => id !== taskId)
        : [...prevSelectedTaskIds, taskId]
    );
  };
  const selectedTasks = selectedTaskIds.map((taskId) => {
    return list.find((template) => template.id === taskId);
  });
  
  const handleClosePopup = () => {
    setIsPopupVisible(false);
};
  const handleSubmit = () => {
    debugger
    setLoading(true);
    axios.privateAxios
      .post<string>("/app/ReleaseNotes/UpdateInUATTaskList",selectedTaskIds)
      .then((response) => {
        console.log(response.data);
        setLoading(false);
        showMessage({
            message: 'Release Notes Updated Successfully!',
            type: 'success',
            duration: 3000,
            floating: true,
            icon: () => (
                <Ionicons name="checkmark-circle-outline" size={20} />
            ),
        });
        share();
        navigation.navigate("Home")
    })
    .catch((error) => {
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
        handleClosePopup();
    });
  }
  const loadConnectionList = async () => {
    
    setLoading(true);
    axios.privateAxios
      .get<Task[]>("/app/ReleaseNotes/GetReadyForUATTaskList?projectId="+projectId)
      .then((response) => {
        setLoading(false);
        setList(response.data);
        setOriginalList(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response.data);
      });
  };
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
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

        <Text style={styles.headingText}>Projects</Text>
      </View>
      
      <View style={styles.searchbar}>
        <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
        <TextInput placeholder="Search" onChangeText={(text) => searchFunction(text)}
          value={searchvalue} style={styles.searchInput} />
      </View>
      <View style={styles.bottomView}>
        <Text style={styles.title}>Project Details</Text>
        {loading && (
                    <LottieAnimation
                        source={require('../../../assets/icons//Loading.json')}
                        autoPlay={true}
                        loop={false}
                        visible={loading}
                        style={styles.animation}
                    />
                )}
        <FlatList
          data={list}
          renderItem={({ item }) => (

            <ReleaseNotesListItem
            taskId={item.id}
              Name={item.name}
              TaskDescription={item.description}
              Status={item.status}
              onPress={() => onSelect(item)}
              handleCheckboxToggle={() => handleCheckboxToggle(item.id)}
            ></ReleaseNotesListItem>

          )}
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
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#3A9EC2',
//   },
//   topView: {
//     marginTop: 40,
//     marginHorizontal: 40,
//     backgroundColor: '#3A9EC2',
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   welcomeMessage: {
//     position: 'absolute',
//     top: 12,
//     textAlign: 'center',
//     fontSize: 30,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   bottomView: {
//     flex: 6,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 50,
//     borderTopRightRadius: 50,
//     paddingBottom:80,
//   },
//   title: {
//     marginHorizontal: 26,
//     marginVertical: 16,
//     fontWeight: 'bold',
//     fontSize: 20,
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
//   searchbar: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     alignItems: "center",
//     width: "95%",
//     height: 50,
//     borderRadius: 30,
//     marginBottom: 25,
//     //bottom:50,
//     left: 10
//   },
//   ProfileIcon: {
//     width: 40,
//     transform: [{ rotateY: '180deg' }]
//   },
//   searchInput: {
//     color: "#BEBEBE",
//     marginLeft: 15,
//     opacity: 0.5,
//     fontSize: 20
//   },
//   backButton: {
//     left:-35,
//     top:4,
//   },
//   headingText: {
//     marginRight:50,
//     top: 5,
//     textAlign: 'center',
//     fontSize: 30,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   animation: {
//     position: 'absolute',
//     width: '140%',
//     height: '140%',
// },
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A9EC2',
  },
  topView: {
    marginTop: hp('5%'),
    marginHorizontal: wp('10%'),
    backgroundColor: '#3A9EC2',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeMessage: {
    position: 'absolute',
    top: hp('1.5%'),
    textAlign: 'center',
    fontSize: wp('8%'),
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomView: {
    flex: 6,
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('15%'),
    borderTopRightRadius: wp('15%'),
    paddingBottom: hp('10%'),
  },
  title: {
    marginHorizontal: wp('10%'),
    marginVertical: hp('2%'),
    fontWeight: 'bold',
    fontSize: wp('5%'),
  },
  popupButton: {
    backgroundColor: '#35A2C1',
    height: hp('6.5%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    left: wp('5%'),
    marginBottom:('12%')
  },
  popupButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: wp('4%'),
  },
  searchbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    width: wp('93%'),
    height: hp('6%'),
    borderRadius: wp('15%'),
    marginBottom: hp('5%'),
    left: wp('4%'),
  },
  ProfileIcon: {
    width: wp('10%'),
    transform: [{ rotateY: '180deg' }],
  },
  searchInput: {
    color: '#BEBEBE',
    marginLeft: wp('4%'),
    opacity: 0.5,
    fontSize: wp('5%'),
  },
  backButton: {
    left: -wp('9%'),
    top: hp('0.5%'),
  },
  headingText: {
    marginRight: wp('12%'),
    top: hp('1%'),
    textAlign: 'center',
    fontSize: wp('7%'),
    color: '#fff',
    fontWeight: 'bold',
  },
  animation: {
    position: 'absolute',
    width: wp('140%'),
    height: hp('140%'),
  },
});


export default ReleaseNotesShare;
