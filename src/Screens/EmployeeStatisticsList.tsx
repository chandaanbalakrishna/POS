import React from 'react';
import { View, StyleSheet, Text, TextInput, FlatList,TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from '@expo/vector-icons';
import { useAxios } from '../Contexts/Axios';
import { EmployeeStackParamList } from '../Routes/EmployeeStack';
import LottieAnimation from '../Components/Animation';
import { useAuth } from '../Contexts/Auth';
import { EmployeeTask } from '../Models/EmployeeTask';
import POTaskListItem from '../Components/POTaskListItem';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type StatProp = RouteProp<EmployeeStackParamList, "EmployeeStatisticsList">;
type HomeScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "Home">;

const EmployeeStatisticsList: React.FC = () => {
  const axios = useAxios();
  const navigation = useNavigation<HomeScreenProp>();
  const auth = useAuth();
  const route = useRoute<StatProp>();

  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<EmployeeTask[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");
  const [status] = React.useState<string>(route.params.status);
  const employeeId = auth.loginData.employeeId;

  React.useEffect(() => {
    loadConnectionList();
  }, []);

  const onSelect = () => {
    navigation.goBack();
  }

  const searchFunction = async (text: string) => {
    if (text) {
      const updatedData = list.filter((item) => {
        const Name = `${item.name.toUpperCase()}`;
        const Description = `${item.description}`;
        const textData = text.toUpperCase();
        return (
          Name.indexOf(textData) > -1 ||
          Description.indexOf(text) > -1
        );
      });
      setList(updatedData);
      setSearchValue(text);
    } else {
      setList(list);
      setSearchValue("");
    }
  };

  const loadConnectionList = async () => {
    setLoading(true);
    axios.privateAxios
      .get<EmployeeTask[]>("/app/Employee/GetEmployeeTaskDetails?employeeId=" + employeeId + "&status=" + status)
      .then((response) => {
        setLoading(false);
        setList(response.data);
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
        {status === 'Task' ? (
        <Text style={styles.headingText}>Task</Text>
         ) : status === 'In-Progress' ? (
        <Text style={styles.headingText}>In-Progress Task</Text>
         ) : (
        <Text style={styles.headingText}>Completed Task</Text>
      )}
      </View>
      
      <View style={styles.searchbar}>
        <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
        <TextInput placeholder="Search" onChangeText={(text) => searchFunction(text)}
          value={searchvalue} style={styles.searchInput} />
      </View>
      <View style={styles.bottomView}>
      {status === 'Task' ? (
        <Text style={styles.title}>Task Details ({list.length}) </Text>
         ) : status === 'In-Progress' ? (
        <Text style={styles.title}>In-Progress Task Details ({list.length})</Text>
         ) : (
        <Text style={styles.title}>Completed Task Details ({list.length})</Text>
      )}
       
        {loading && (
                    <LottieAnimation
                        source={require('../../assets/icons/Loading.json')}
                        autoPlay={true}
                        loop={true}
                        visible={loading}
                    />
                )}
         <FlatList
          data={list}
          renderItem={({ item}) => (
            <POTaskListItem
            Name={item.name}
            TaskType ={item.taskType}
            Description={item.description}
            percentage={item.percentage}
            Status={item.status}
            onPress={() => onSelect()}
            ></POTaskListItem>
          )}
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
//   searchbar: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     alignItems: "center",
//     width: "95%",
//     height: 50,
//     borderRadius: 30,
//     marginBottom: 25,
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
//     left:-5,
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
    top: hp('1%'),
    textAlign: 'center',
    fontSize: wp('8%'),
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomView: {
    flex: 6,
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('10%'),
    borderTopRightRadius: wp('10%'),
    paddingBottom: hp('5%'),
  },
  title: {
    marginHorizontal: wp('5%'),
    marginVertical: hp('2%'),
    fontWeight: 'bold',
    fontSize: wp('5%'),
  },
  searchbar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    width: wp('95%'),
    height: hp('7%'),
    borderRadius: wp('15%'),
    marginBottom: hp('5%'),
    left: wp('2.5%'),
  },
  ProfileIcon: {
    width: wp('10%'),
    transform: [{ rotateY: '180deg' }],
  },
  searchInput: {
    color: "#BEBEBE",
    marginLeft: wp('4%'),
    opacity: 0.5,
    fontSize: wp('6%'),
  },
  backButton: {
    left: wp('-1%'),
    top: hp('0.5%'),
  },
  headingText: {
    marginRight: wp('10%'),
    top: hp('0.5%'),
    textAlign: 'center',
    fontSize: wp('8%'),
    color: '#fff',
    fontWeight: 'bold',
  },
  animation: {
    position: 'absolute',
    width: '140%',
    height: '140%',
  },
});


export default EmployeeStatisticsList;
