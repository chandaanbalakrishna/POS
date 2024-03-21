import React from 'react';
import { View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ProjectListItem from '../../Components/ProjectListItem';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Project } from '../../Models/Project';
import { useAxios } from '../../Contexts/Axios';
import POProjectListItem from '../../Components/POProjectListItem';
import LottieAnimation from '../../Components/Animation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import POProjectList from '../../Components/POProjectList';

type TaskScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "Task">;
type TaskProp = RouteProp<EmployeeStackParamList, "Task">;
const TaskScreen: React.FC = () => {

  const axios = useAxios();
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<Project[]>([]);
  const [originalList, setOriginalList] = React.useState<Project[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");


  const navigation = useNavigation<TaskScreenProp>();
  const route = useRoute();
  const params = route.params;

  const handlePress = async (data :Project) => {
    debugger
    //navigation.navigate("Category",{ProjectId:data.id ,Name: data.name})
    navigation.navigate("USList", { ProjectId: data.id, Name: data.name, CategoryIds: undefined, isUIApplicable: undefined, CategoryName: undefined, subCategoryName: undefined });

  };
  const handleBackPress = () => {
    navigation.goBack();
  };
  const searchFunction = async (text: string) => {
    if (text) {
      const updatedData = originalList.filter((item) => {
        const Name = `${item.name.toUpperCase()}`;
        const Type = `${item.type}`;
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

        <Text style={styles.headingText}>Task</Text>
      </View>
      <View style={styles.searchbar}>
        <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
        <TextInput placeholder="Search" style={styles.searchInput} value={searchvalue}  onChangeText={(text) => searchFunction(text)} />
      </View>
      <View style={styles.bottomView}>
        <Text style={styles.titleText}>Choose Projects</Text>
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
              <POProjectList
                Name={item.name}
                Type={item.type}
                Description={item.description}
                percentage={item.percentage}
                onPress={() => handlePress(item)}
              ></POProjectList>
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
//     flexDirection: 'row',
//   },
//   headingText: {
//     marginRight:50,
//     top: 5,
//     textAlign: 'center',
//     fontSize: 30,
//     color: '#fff',
//     fontWeight: 'bold',
//     marginBottom:10
//   },
//   bottomView: {
//     flex: 6,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 50,
//     marginTop: 20,
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
//     left: 10
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
//   backButton: {
//     left:-35,
//     top:1,
//   },
//   animation: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
// },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A9EC2',
  },
  topView: {
    marginTop: hp('2%'),
    marginHorizontal: wp('5%'),
    backgroundColor: '#3A9EC2',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headingText: {
    marginRight: wp('5%'), // Adjust the margin for smaller screens
    top: hp('2%'), // Adjust the top value for smaller screens
    textAlign: 'center',
    fontSize: wp('7%'), // Adjust the font size for smaller screens
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: hp('1%'),
  },
  bottomView: {
    flex: 6,
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('10%'),
    marginTop: hp('2%'),
    borderTopRightRadius: wp('10%'),
    paddingBottom: hp('8%'),
  },
  titleText: {
    marginHorizontal: wp('5%'), // Adjust the margin for smaller screens
    marginVertical: hp('2%'),
    fontWeight: 'bold',
    fontSize: wp('4.5%'), // Adjust the font size for smaller screens
  },
  searchbar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    width: wp('90%'), // Adjust the width for smaller screens
    height: hp('6.2%'), // Adjust the height for smaller screens
    borderRadius: wp('15%'),
    marginBottom: hp('2%'), // Adjust the margin bottom for smaller screens
    left: wp('5%'),
  },
  circle: {
    borderRadius: wp('10%'), // Adjust the border radius for smaller screens
    height: hp('6%'), // Adjust the height for smaller screens
    width: wp('10%'), // Adjust the width for smaller screens
    backgroundColor: "#fff",
  },
  ProfileIcon: {
    width: wp('10%'), // Adjust the width for smaller screens
    transform: [{ rotateY: '180deg' }],
  },
  searchInput: {
    color: "#BEBEBE",
    marginLeft: wp('2%'), // Adjust the margin left for smaller screens
    opacity: 0.5,
    fontSize: wp('5%'), // Adjust the font size for smaller screens
  },
  customCardContainer: {
    backgroundColor: 'gray',
    marginHorizontal: wp('5%'),
    marginTop: -hp('6%'),
    padding: wp('6%'), // Adjust the padding for smaller screens
    borderRadius: wp('5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    left: -wp('10%'), // Adjust the left value for smaller screens
    top: hp('1%'),
  },
  animation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});


export default TaskScreen;
