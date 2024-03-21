import React from 'react';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, StyleSheet, Text, TextInput, FlatList,TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import POProjectListItem from '../../Components/POProjectListItem';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { Project } from '../../Models/Project';
import { useAxios } from '../../Contexts/Axios';
import LottieAnimation from '../../Components/Animation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import POProjectList from '../../Components/POProjectList';

type TaskListProps = NativeStackNavigationProp<EmployeeStackParamList, "DayPlanTaskScreen">;

const PlanScreen: React.FC = () => {

  const axios = useAxios();
  const navigation = useNavigation<TaskListProps>();

  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<Project[]>([]);
  const [originalList, setOriginalList] = React.useState<Project[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");

  React.useEffect(() => {
    loadConnectionList();
  }, []);

  const onSelect = async (data: Project) => {
    navigation.navigate("DayPlanTaskScreen", { ProjectId: data.id ,ProjectName: data.name});
  }

  const searchFunction = async (text: string) => {
    if (text) {
      const updatedData = originalList.filter((item) => {
        debugger;
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
        setOriginalList(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response.data);
      });
      }, 1000);
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

        <Text style={styles.headingText}>Employee Task</Text>
      </View>
    
      <View style={styles.searchbar}>
        <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
        <TextInput placeholder="Search" onChangeText={(text) => searchFunction(text)}
          value={searchvalue} style={styles.searchInput} />
      </View>
      <View style={styles.bottomView}>
        <Text style={styles.titleText}>Choose Projects</Text>
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

            <POProjectList
              Name={item.name}
              Type={item.type}
              Description={item.description}
              percentage={item.percentage}
              onPress={() => onSelect(item)}
            ></POProjectList>

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
//     flexDirection: 'row',
//   },
//   headingText: {
//     marginRight:50,
//     top: 10,
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
//   titleText: {
//     marginHorizontal: 26,
//     marginVertical: 20,
//     fontWeight: 'bold',
//     fontSize: 20,
//   },
//   backButton: {
//     left:-15,
//     top:6,
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
    marginTop: hp('3.75%'),
    marginHorizontal: wp('6.25%'),
    backgroundColor: '#3A9EC2',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headingText: {
    marginRight: wp('10.5%'),
    top: hp('1.25%'),
    textAlign: 'center',
    fontSize: wp('7.5%'),
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomView: {
    flex: 6,
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('12.5%'),
    borderTopRightRadius: wp('12.5%'),
    paddingBottom: hp('10%'),
  },
  title: {
    marginHorizontal: wp('16.25%'),
    marginVertical: hp('1.25%'),
    fontWeight: 'bold',
    fontSize: wp('5%'),
  },
  searchbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    width: wp('94%'),
    height: hp('6%'),
    borderRadius: wp('10%'),
    marginBottom: hp('3.75%'),
    left: wp('3%'),
  },
  ProfileIcon: {
    width: wp('10%'),
    transform: [{ rotateY: '180deg' }],
  },
  searchInput: {
    color: '#BEBEBE',
    marginLeft: wp('3.75%'),
    opacity: 0.5,
    fontSize: wp('5%'),
  },
  titleText: {
    marginHorizontal: wp('16.25%'),
    marginVertical: hp('2.5%'),
    fontWeight: 'bold',
    fontSize: wp('5%'),
  },
  backButton: {
    left: -wp('3.75%'),
    top: hp('0.8%'),
  },
  animation: {
    position: 'absolute',
    width: '140%',
    height: '140%',
  },
});

export default PlanScreen;
