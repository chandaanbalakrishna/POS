import React from 'react';
import { View, StyleSheet, Text ,TextInput,FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAxios } from '../../Contexts/Axios';
import { Project } from '../../Models/Project';
import POProjectListItem from '../../Components/POProjectListItem';
import LottieAnimation from '../../Components/Animation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type EmployeeAssignedTaskProp = NativeStackNavigationProp<EmployeeStackParamList, "Time">;
const EmployeeAssignedTask: React.FC = () => {
const navigation = useNavigation<EmployeeAssignedTaskProp>();
  const route = useRoute();
  const params = route.params;
  const axios = useAxios();
  const [loading, setLoading] = React.useState(false);  
  const [list, setList] = React.useState<Project[]>([]);
  const [originalList, setOriginalList] = React.useState<Project[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");

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



  const onSelect = async (data: Project) => {
    navigation.goBack();
  }

const handleBackPress = () => {
  navigation.goBack();
};
const loadConnectionList = async () => {
  setLoading(true);
  axios.privateAxios
    .get<Project[]>("/app/Project/GetEmployeeProjectlist")
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

React.useEffect(() => {
  loadConnectionList();
}, []);


  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <Text style={styles.welcomeMessage}>Employee Assigned Task</Text>
      </View>
      <View style={styles.searchbar}>
            <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
            <TextInput placeholder="Search" style={styles.searchInput} value={searchvalue}  onChangeText={(text) => searchFunction(text)} />
          </View>
      <View style={styles.bottomView}>
      <Text style={styles.title}>My Assigned List</Text>
      {loading && (
                    <LottieAnimation
                        source={require('../../../assets/icons//Loading.json')}
                        autoPlay={true}
                        loop={true}
                        visible={loading}
                    />
                )}
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
//     flex:6,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 50,
//     marginTop: 5,
//     borderTopRightRadius: 50,
//     paddingBottom:80,
//   },
//   titleText: {
//     marginHorizontal: 26,
//     marginVertical: 20,
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
//     //bottom:50,
//     left:10
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
//     color: "#BEBEBE",
//     marginLeft: 15,
//     opacity: 0.5,
//     fontSize: 20
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
    marginTop: hp('0.5%'), // Use responsive margin
    borderTopRightRadius: wp('10%'), // Use responsive border radius
    paddingBottom: hp('5%'), // Use responsive padding
  },
  titleText: {
    marginHorizontal: wp('6%'), // Use responsive margin
    marginVertical: hp('2%'), // Use responsive margin
    fontWeight: 'bold',
    fontSize: wp('4%'), // Use responsive font size
  },
  searchbar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    width: wp('95%'), // Use responsive width
    height: hp('8%'), // Use responsive height
    borderRadius: wp('15%'), // Use responsive border radius
    marginBottom: hp('4%'), // Use responsive margin
    left: wp('2%'), // Use responsive margin
  },
  circle: {
    borderRadius: wp('12.5%'), // Use responsive border radius
    height: hp('10%'), // Use responsive height
    width: hp('10%'), // Use responsive width
    backgroundColor: "#fff",
  },
  ProfileIcon: {
    width: wp('10%'), // Use responsive width
    transform: [{ rotateY: '180deg' }]
  },
  searchInput: {
    color: "#BEBEBE",
    marginLeft: wp('4%'), // Use responsive margin
    opacity: 0.5,
    fontSize: wp('4%'), // Use responsive font size
  },
  customCardContainer: {
    backgroundColor: 'gray',
    marginHorizontal: wp('6%'), // Use responsive margin
    marginTop: hp('-5%'), // Use responsive margin
    padding: wp('8%'), // Use responsive padding
    borderRadius: wp('2%'), // Use responsive border radius
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  welcomeMessage: {
    position: 'absolute',
    top: hp('0.5%'), // Use responsive position
    textAlign: 'center',
    fontSize: wp('6%'), // Use responsive font size
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    marginHorizontal: wp('6%'), // Use responsive margin
    marginVertical: hp('2%'), // Use responsive margin
    fontWeight: 'bold',
    fontSize: wp('4%'), // Use responsive font size
  },
  animation: {
    position: 'absolute',
    width: wp('140%'), // Use responsive width
    height: hp('140%'), // Use responsive height
  },
});


export default EmployeeAssignedTask;
