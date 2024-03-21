import React from 'react';
import { View, StyleSheet, Text, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAxios } from '../../Contexts/Axios';
import { TimePlan } from '../../Models/TimePlanModel';
import { Project } from '../../Models/Project';
import POProjectListItem from '../../Components/POProjectListItem';
import LottieAnimation from '../../Components/Animation';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type MyTaskScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "MyTask">;
const MyTaskList: React.FC = () => {

  const navigation = useNavigation<MyTaskScreenProp>();
  const axios = useAxios();

  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');
  const [list, setList] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [originalList, setOriginalList] = React.useState<Project[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");

  const handlePress = async (data :Project) => {
    debugger
    navigation.navigate("Home")
  };
  const loadConnectionList = async () => {
    setLoading(true);
    setTimeout(() => {
      axios.privateAxios
        .get<Project[]>("/app/Project/GetEmployeeProjectlist")
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


  const onSelect = (data :Project) => {
    navigation.navigate("MyTaskBasedOnproject",{ProjectId:data.id});
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

        <Text style={styles.headingText}>My Project List</Text>
      </View>
      <View style={styles.bottomView}>
        <Text style={styles.title}>Project List</Text>
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
                Type={item.type}
                Description={item.description}
                percentage={item.percentage}
                onPress={() => onSelect(item)}
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
//     bottom: 28
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
    textAlign: 'center',
    padding: 0,
    width: '100%',
    fontSize: wp('3%'), // Use responsive font size
  },
  backButton: {
    position: 'absolute',
    left: 0,
    bottom: hp('4%'), // Use responsive position
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


export default MyTaskList;
