import React from 'react';
import { View, StyleSheet, Text, TextInput, FlatList,TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from '@expo/vector-icons';
import { Project } from '../../Models/Project';
import { useAxios } from '../../Contexts/Axios';
import { AdminStackParamList } from '../../Routes/AdminStack';
import POProjectListItem from '../../Components/POProjectListItem';
import LottieAnimation from '../../Components/Animation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type TaskListProps = NativeStackNavigationProp<AdminStackParamList, "Project">;

const ProjectScreen: React.FC = () => {
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
    navigation.navigate("ProjectStatistics",{ProjectId:data.id,Name:data.name,Description:data.description});
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
    setTimeout(() => {
    axios.privateAxios
      .get<Project[]>("/app/Project/GetAllProjectlist")
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
//     marginTop: 40,
//     marginHorizontal: 24,
//     backgroundColor: '#3A9EC2',
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
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
//     left: -22,
//     top: 1,
//   },
//   headingText: {
//     marginRight: 50,
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
    marginTop: hp('5%'), // Use responsive marginTop
    marginHorizontal: wp('8%'), // Use responsive marginHorizontal
    backgroundColor: '#3A9EC2',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  welcomeMessage: {
    position: 'absolute',
    top: hp('1%'), // Use responsive top
    textAlign: 'center',
    fontSize: wp('6%'), // Use responsive fontSize
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomView: {
    flex: 6,
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('15%'), // Use responsive borderTopLeftRadius
    borderTopRightRadius: wp('15%'), // Use responsive borderTopRightRadius
    paddingBottom: hp('10%'), // Use responsive paddingBottom
  },
  title: {
    marginHorizontal: wp('8%'), // Use responsive marginHorizontal
    marginVertical: hp('2%'), // Use responsive marginVertical
    fontWeight: 'bold',
    fontSize: wp('5%'), // Use responsive fontSize
  },
  searchbar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    width: wp('95%'), // Use responsive width
    height: hp('10%'), // Use responsive height
    borderRadius: wp('15%'), // Use responsive borderRadius
    marginBottom: hp('5%'), // Use responsive marginBottom
    left: wp('2%'), // Use responsive left
  },
  ProfileIcon: {
    width: wp('10%'), // Use responsive width
    transform: [{ rotateY: '180deg' }]
  },
  searchInput: {
    color: "#BEBEBE",
    marginLeft: wp('4%'), // Use responsive marginLeft
    opacity: 0.5,
    fontSize: wp('5%'), // Use responsive fontSize
  },
  backButton: {
    left: wp('-3%'), // Use responsive left
    top: hp('0.2%'), // Use responsive top
  },
  headingText: {
    marginRight: wp('10%'), // Use responsive marginRight
    textAlign: 'center',
    fontSize: wp('6%'), // Use responsive fontSize
    color: '#fff',
    fontWeight: 'bold',
  },
  animation: {
    position: 'absolute',
    width: wp('140%'), // Use responsive width
    height: hp('140%'), // Use responsive height
  },
});

export default ProjectScreen;
