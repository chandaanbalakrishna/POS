import React ,{useRef} from 'react';
import { View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAxios } from '../../Contexts/Axios';
import { Project } from '../../Models/Project';
import POProjectListItem from '../../Components/POProjectListItem';
import POTaskListItem from '../../Components/POTaskListItem';
import { useAuth } from '../../Contexts/Auth';
import { EmployeeTask } from '../../Models/EmployeeTask';
import LottieAnimation from '../../Components/Animation';
import { Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import FilterComponent from '../../Components/POFilter';
import { EmployeeDailyTask } from '../../Models/EmployeeDailyTask';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { showMessage } from 'react-native-flash-message';



type TimeScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "EmployeeAssignedTask">;
const TimeScreen: React.FC = () => {
  const navigation = useNavigation<TimeScreenProp>();
  const route = useRoute();
  const auth = useAuth();
  const params = route.params;
  const axios = useAxios();
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<EmployeeDailyTask[]>([]);
  const [status,setStatus] = React.useState<string[]>([]);
  const [originalList, setOriginalList] = React.useState<EmployeeDailyTask[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");
  const employeeId = auth.loginData.employeeId;
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  //const [ProjectName] = React.useState<string>(route.params.ProjectName);
  const [filterOptions, setFilterOptions] = React.useState(null);
  const today = new Date();
  const[formattedToday ,setFormatedDate] = React.useState(today.toLocaleDateString());
  const onSelect = async (data: EmployeeDailyTask) => {
    if (data.percentage === 100) {
      showMessage({
        message: 'Daily Task Already Completed!',
        type: 'success',
        duration: 3000,
        floating: true,
    });
      return;
    } 
    else{
      navigation.navigate("EmployeeDailyTaskDetails", { EmployeeDailyTask: data });
    }
  }
  const handleFilterChange = (status: string[], estStartDate: string, weekEndDate: string[]) => {
    debugger;
    const filteredList = originalList.filter((item) => {
      const matchesStatus = !status.length || status.includes(item.status);
      const estStartDateString = item.workedOn.toString().split("T")[0];
      const matchesEstStartDate = !estStartDate || estStartDateString === estStartDate;
      const matchesWeekEndDate = !weekEndDate.length || weekEndDate.some(date => date === item.weekEndingDate.toString().split("T")[0]);
      return matchesStatus && matchesEstStartDate && matchesWeekEndDate;
    });
    if(estStartDate)
    {
      setFormatedDate(estStartDate);
    }
    setList(filteredList);
  };
  const searchFunction = async (text: string) => {
    if (text) {
      const updatedData = originalList.filter((item) => {
        const Name = `${item.name.toUpperCase()}`;
        const Type = `${item.status}`;
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
  const GetFridaysOfMonth = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const fridays: Date[] = [];
    const dateIterator = new Date(currentDate.getFullYear(), currentMonth, 1);
  
    while (dateIterator.getMonth() === currentMonth) {
      if (dateIterator.getDay() === 5) {
        fridays.push(new Date(dateIterator));
      }
      dateIterator.setDate(dateIterator.getDate() + 1);
    }
    const ConvertDate = (date) => {
      if (!date) return "-";
      const convertedDate = new Date(date);
      const year = convertedDate.getFullYear();
      const month = String(convertedDate.getMonth() + 1).padStart(2, '0');
      const day = String(convertedDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const convertedFridays = fridays.map((date) => ConvertDate(date.toISOString()));
    const WeekEndingDateDropDown = convertedFridays;
    return WeekEndingDateDropDown;
  }; 

  const handleBackPress = () => {
    navigation.goBack();
  };
  const loadConnectionList = async () => {
    debugger;
    setLoading(true);
    setTimeout(() => {
    axios.privateAxios
      .get<EmployeeDailyTask[]>("/app/EmployeeDailyTask/GetEmployeeDailyTask?EmployeeId=" + employeeId)
      .then((response) => {
        debugger;
        setLoading(false);
        // Filter items with "WorkedOn Date" as today
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const todayList = response.data.filter((item) => {
          
          const workedOnDate = new Date(item.workedOn);// Format the "WorkedOn" date to match the format of the today variable
          const formattedWorkedOn = workedOnDate.toDateString(); // This will be in the format: Wed Jul 26 2023
          return formattedWorkedOn === today.toDateString(); // Compare the formatted "WorkedOn" date with the today variable
        });

        const yesterdayList = response.data.filter((item) => {
          const workedOnDate = new Date(item.workedOn);
          const isStatusInProgress = item.percentage === 0;
          return workedOnDate.toDateString() === yesterday.toDateString() && isStatusInProgress;
        });
        
        const filteredList = [...todayList, ...yesterdayList];
         debugger
        setList(filteredList);
        setOriginalList(response.data);
        const StatusSet = new Set();
        response.data.forEach((item) => {
            StatusSet.add(item.status);
        });
        const statusArray = Array.from(StatusSet) as string[];
        setStatus(statusArray)
      })
      .catch((error) => {
        debugger;
        setLoading(false);
        console.log(error.response.data);
      });
    },1000);
  };

  React.useEffect(() => {
    loadConnectionList();
    const shake = () => {
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
      ]).start();
    };

    const timeoutId = setTimeout(shake, 2000); // Delay the animation for 2 seconds

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      debugger;
    loadConnectionList();
    }, [])
  );
  const animatedStyle = {
    transform: [{ translateX: shakeAnimation }]
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

        <Text style={styles.headingText}>Daily Tasks</Text>
      </View>
      <View style={styles.searchBarContainer}>
      <View style={styles.searchbar}>
        <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
        <TextInput placeholder="Search" style={styles.searchInput} value={searchvalue}  onChangeText={(text) => searchFunction(text)} />
        <FilterComponent  onFilterChange={true} weekEndingDate={GetFridaysOfMonth()} Status={status} onSubmit={handleFilterChange}></FilterComponent>
      </View>
 
      </View>
      <View style={styles.bottomView}>

        <Text style={styles.title}>My Tasks {formattedToday}</Text>
        {loading && (
          <LottieAnimation
            source={require('../../../assets/icons/Loading.json')}
            autoPlay={true}
            loop={true}
            visible={loading}
          />
        )}
        <FlatList
          data={list}
          renderItem={({ item }) => (
            <POTaskListItem
              Name={item.name}
              Status={item.status}
              Description={item.description}
              percentage={item.percentage}
              onPress={() => onSelect(item)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
                    {/* <Animated.View style={[styles.whatsappButton, animatedStyle]}>
              <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate("WhatsappCompletedTaskList")}>
                <FontAwesome name="whatsapp" size={30} color="#fff" />
              </TouchableOpacity>
            </Animated.View> */}
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
//     marginTop: 30,
//     marginHorizontal: 24,
//     backgroundColor: '#3A9EC2',
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   headingText: {
//     marginRight:50,
//     top: 5,
//     textAlign: 'center',
//     fontSize: 30,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   searchBarContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '95%',
//     height: 80, // Increase the height to accommodate multiple lines
//     borderRadius: 30,
//     marginBottom: 3,
//     marginLeft:10,
//     flexWrap: 'wrap', // Allow content to wrap to the next line
//   },
//   bottomView: {
//     flex: 6,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 50,
//     marginTop: 5,
//     borderTopRightRadius: 50,
//     paddingBottom:80
//   },
//   titleText: {
//     marginHorizontal: 26,
//     marginVertical: 20,
//     fontWeight: 'bold',
//     fontSize: 20,
//   },
//   searchbar: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     flex: 1, // Take all available space on the left side
//     height: '65%',
//     borderRadius: 30,
//     paddingRight: 5,
//   },
//   circle: {
//     borderRadius: 25,
//     height: 50,
//     width: 50,
//     backgroundColor: "#fff"
//   },
//   ProfileIcon: {
//     width: 40,
//     transform: [{ rotateY: '180deg' }]
//   },
//   searchInput: {
//     color: '#BEBEBE',
//     flex: 1, // Take all available space on the left side after the icon
//     marginLeft: 20,
//     opacity: 0.5,
//     fontSize: 20,
//   },
//   customCardContainer: {
//     backgroundColor: 'gray',
//     marginHorizontal: 24,
//     marginTop: -40,
//     padding: 30,
//     borderRadius: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   welcomeMessage: {
//     position: 'absolute',
//     top: 5,
//     textAlign: 'center',
//     fontSize: 30,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   title: {
//     marginHorizontal: 26,
//     marginVertical: 16,
//     fontWeight: 'bold',
//     fontSize: 20,
//   },
//   backButton: {
//     left:-5,
//     top:4,
//   },
//   animation: {
//     position: 'absolute',
//     width: '140%',
//     height: '140%',
//   },
//   whatsappButton: {
//     position: 'absolute',
//     bottom: 80,
//     right: 20,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#25D366',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A9EC2',
  },
  topView: {
    marginTop: hp('4.5%'),
    marginHorizontal: wp('7.73%'),
    backgroundColor: '#3A9EC2',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headingText: {
    marginRight: wp('13.33%'),
    top: hp('0.67%'),
    textAlign: 'center',
    fontSize: hp('3.5%'),
    color: '#fff',
    fontWeight: 'bold',
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('95%'),
    height: hp('10.13%'), // Increase the height to accommodate multiple lines
    borderRadius: wp('8%'),
    marginBottom: hp('0.4%'),
    marginLeft: wp('2.67%'),
    flexWrap: 'wrap', // Allow content to wrap to the next line
  },
  bottomView: {
    flex: 6,
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('13.33%'),
    marginTop: hp('0.67%'),
    borderTopRightRadius: wp('13.33%'),
    paddingBottom: hp('10%'),
  },
  titleText: {
    marginHorizontal: wp('7.73%'),
    marginVertical: hp('2.67%'),
    fontWeight: 'bold',
    fontSize: hp('2.67%'),
  },
  searchbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    flex: 1, // Take all available space on the left side
    height: hp('6%'),
    borderRadius: wp('8%'),
    paddingRight: wp('1.33%'),
  },
  circle: {
    borderRadius: wp('13.33%'),
    height: hp('6.67%'),
    width: hp('6.67%'),
    backgroundColor: "#fff"
  },
  ProfileIcon: {
    width: wp('10.67%'),
    transform: [{ rotateY: '180deg' }]
  },
  searchInput: {
    color: '#BEBEBE',
    flex: 1, // Take all available space on the left side after the icon
    marginLeft: wp('6.67%'),
    opacity: 0.5,
    fontSize: hp('2.67%'),
  },
  customCardContainer: {
    backgroundColor: 'gray',
    marginHorizontal: wp('7.73%'),
    marginTop: hp('-5.33%'),
    padding: wp('13.33%'),
    borderRadius: wp('2.67%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  welcomeMessage: {
    position: 'absolute',
    top: hp('0.67%'),
    textAlign: 'center',
    fontSize: hp('2.67%'),
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    marginHorizontal: wp('7.73%'),
    marginVertical: hp('2.67%'),
    fontWeight: 'bold',
    fontSize: hp('2.6%'),
  },
  backButton: {
    left: wp('-5%'),
    top: hp('0.5%'),
  },
  animation: {
    position: 'absolute',
    width: '140%',
    height: '140%',
  },
  whatsappButton: {
    position: 'absolute',
    bottom: hp('8.27%'),
    right: wp('4.27%'),
    width: wp('13.33%'),
    height: wp('13.33%'),
    borderRadius: wp('6.67%'),
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TimeScreen;
