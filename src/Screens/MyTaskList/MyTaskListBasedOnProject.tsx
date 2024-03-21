import React from 'react';
import { View, StyleSheet, Text, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useAxios } from '../../Contexts/Axios';
import { TimePlan } from '../../Models/TimePlanModel';
import { Project } from '../../Models/Project';
import POProjectListItem from '../../Components/POProjectListItem';
import LottieAnimation from '../../Components/Animation';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { Task } from '../../Models/Task';
import { TextInput } from "@react-native-material/core";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type MyTaskScreenBasedonprojectProp = NativeStackNavigationProp<EmployeeStackParamList, "MyTask">;
type MyTaskProp = RouteProp<EmployeeStackParamList, "MyTaskBasedOnproject">;
const MyTaskListBasedonproject: React.FC = () => {

  const navigation = useNavigation<MyTaskScreenBasedonprojectProp>();
  const axios = useAxios();
  const route = useRoute<MyTaskProp>();
  const [list, setList] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [originalList, setOriginalList] = React.useState<Task[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");
  const [projectid] = React.useState(route.params.ProjectId);

  const handlePress = async (data :Project) => {
    debugger
    //navigation.navigate('Home')
  };
  const loadConnectionList = async () => {
    setLoading(true);
    setTimeout(() => {
      axios.privateAxios
        .get<Task[]>("/app/Common/GetProjectTaskList?ProjectId="+ projectid)
        .then((response) => {
          setLoading(false);
          setList(response.data);
          console.log(response.data);
          setOriginalList(response.data);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error.response.data);
        });
    }, 1000);
  };
  React.useEffect(() => {
    loadConnectionList();
}, []);


  const onSelect = () => {
    //navigation.navigate("DayPlanTaskDetails", { Id: data.id, Name: data.name, description: data.description, status: data.status,ProjectId:data.projectId,percentage:data.percentage,priority:data.priority });
    navigation.goBack();
  }

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

        <Text style={styles.headingText}>My Task List</Text>

      </View>
      <View style={styles.bottomView}>
        <Text style={styles.title}>Task List</Text>
        {loading ? (
          <LottieAnimation
            source={require('../../../assets/icons/Loading.json')}
            autoPlay={true}
            loop={true}
            visible={loading}
          />
        ) : (
          <FlatList
            data={list}
            renderItem={({ item }) => (
              <POProjectListItem
                Name={item.name}
                Type={item.taskType}
                Description={item.description}
                percentage={item.percentage}
                onPress={() => handlePress(item)}
              ></POProjectListItem>
            )}
          />
        )}
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
//   },
//   headingText: {
//     position: 'absolute',
//     top: 15,
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
//     paddingBottom:50,
//   },
//   title: {
//     marginHorizontal: 26,
//     marginVertical: 16,
//     fontWeight: 'bold',
//     fontSize: 20,
//   },
 
//   dateContainer: {
//     margin:10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
   
//   },
//   firstDateContainer: {
//     alignSelf: 'flex-start',
//     height:130,
//     width:130,
//   },
//   lastDateContainer: {
//     alignSelf: 'flex-end',
//     height:130,
//     width:130,
//   },
//   Button: {
//     marginTop:25,
//     backgroundColor: '#35A2C1',
//     borderRadius: 8,
//     width: 100,
//     height:50,
//   },
//   ButtonText: {
//     color: '#fff',
//     textAlign:'left',
//     padding:0,
//     width:50,
//     fontSize:13
//   },
//   backButton: {
//     position: 'absolute',
//     left: 0,
//     bottom:25
//   },
//   listView: {
//     marginTop: 1
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
    marginTop: hp('2%'), // Use responsive margin
    marginHorizontal: wp('6%'), // Use responsive margin
    backgroundColor: '#3A9EC2',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingText: {
    position: 'absolute',
    top: hp('1%'), // Use responsive position
    textAlign: 'center',
    fontSize: wp('6%'), // Use responsive font size
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomView: {
    flex: 6,
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('10%'), // Use responsive border radius
    borderTopRightRadius: wp('10%'), // Use responsive border radius
    paddingBottom: hp('5%'), // Use responsive padding
  },
  title: {
    marginHorizontal: wp('6%'), // Use responsive margin
    marginVertical: hp('2%'), // Use responsive margin
    fontWeight: 'bold',
    fontSize: wp('4%'), // Use responsive font size
  },
  dateContainer: {
    margin: wp('1%'), // Use responsive margin
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firstDateContainer: {
    alignSelf: 'flex-start',
    height: hp('10%'), // Use responsive height
    width: wp('40%'), // Use responsive width
  },
  lastDateContainer: {
    alignSelf: 'flex-end',
    height: hp('10%'), // Use responsive height
    width: wp('40%'), // Use responsive width
  },
  Button: {
    marginTop: hp('2.5%'), // Use responsive margin
    backgroundColor: '#35A2C1',
    borderRadius: wp('2%'), // Use responsive border radius
    width: wp('30%'), // Use responsive width
    height: hp('6%'), // Use responsive height
  },
  ButtonText: {
    color: '#fff',
    textAlign: 'left',
    padding: 0,
    width: wp('15%'), // Use responsive width
    fontSize: wp('3%'), // Use responsive font size
  },
  backButton: {
    position: 'absolute',
    left: 0,
    bottom: hp('3%'), // Use responsive position
  },
  listView: {
    marginTop: 1,
  },
  animation: {
    position: 'absolute',
    width: '140%',
    height: '140%',
  },
});

export default MyTaskListBasedonproject;
