import React from 'react';
import { View, StyleSheet, Text, TextInput, FlatList,TouchableOpacity,KeyboardAvoidingView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from '@expo/vector-icons';
import PlanScreen from '../DayPlanScreens/PlanScreen';
import { Project } from '../../Models/Project';
import { useAxios } from '../../Contexts/Axios';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import POProjectListItem from '../../Components/POProjectListItem';
import LottieAnimation from '../../Components/Animation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import POProjectList from '../../Components/POProjectList';

type TaskListProps = NativeStackNavigationProp<EmployeeStackParamList, "ReleaseNotesProjectList">;

const ReleaseNotesProjectList: React.FC = () => {
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
    navigation.navigate("ReleaseNotesShare",
    {ProjectId:data.id,
    projectName:data.name }
    );
  }

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
    fontSize: hp('3.5%'), 
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomView: {
    flex: 6,
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('10%'), 
    borderTopRightRadius: wp('10%'), 
    paddingBottom: hp('10%'), 
  },
  title: {
    marginHorizontal: wp('10%'),
    marginVertical: hp('2%'),
    fontWeight: 'bold',
    fontSize: hp('2.5%'), 
  },
  searchbar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    width: wp('94%'), 
    height: hp('6%'), 
    borderRadius: wp('15%'), 
    marginBottom: hp('6.25%'), 
    left: wp('3.5%'),
  },
  ProfileIcon: {
    width: wp('10%'), 
    transform: [{ rotateY: '180deg' }]
  },
  searchInput: {
    color: "#BEBEBE",
    marginLeft: wp('3.75%'), 
    opacity: 0.5,
    fontSize: hp('2.6%'), 
  },
  backButton: {
    left: wp('-8.75%'), 
    top: hp('0.7%'), 
  },
  headingText: {
    marginRight: wp('12.5%'), 
    top: hp('1%'), 
    textAlign: 'center',
    fontSize: hp('4%'), 
    color: '#fff',
    fontWeight: 'bold',
  },
  animation: {
    position: 'absolute',
    width: wp('140%'), 
    height: hp('140%'),
  },
});

export default ReleaseNotesProjectList;
