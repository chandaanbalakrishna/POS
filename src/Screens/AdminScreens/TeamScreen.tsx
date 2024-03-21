import React from 'react';
import { View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from '@expo/vector-icons';
import { Project } from '../../Models/Project';
import { useAxios } from '../../Contexts/Axios';
import { AdminStackParamList } from '../../Routes/AdminStack';
import POProjectListItem from '../../Components/POProjectListItem';
import LottieAnimation from '../../Components/Animation';
import { TeamModel } from '../../Models/TeamModel';
import POTeamListItem from '../../Components/POTeamListItem';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type TaskListProps = NativeStackNavigationProp<AdminStackParamList, "Team">;

const TeamScreen: React.FC = () => {
  const axios = useAxios();
  const navigation = useNavigation<TaskListProps>();

  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<TeamModel[]>([]);
  const [originalList, setOriginalList] = React.useState<TeamModel[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");

  React.useEffect(() => {
    loadConnectionList();
  }, []);

  const onSelect = async (data: TeamModel) => {
    navigation.navigate("TeamDetails", { TeamId: data.id })
  }
  const searchFunction = async (text: string) => {
    if (text) {
      const updatedData = originalList.filter((item) => {
        const Name = `${item.name.toUpperCase()}`;
        // const Type = `${item.type}`;
        // const Description = `${item.description}`;
        const textData = text.toUpperCase();
        return (
          Name.indexOf(textData) > -1
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
        .get<TeamModel[]>("/app/Team/GetTeamList")
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

        <Text style={styles.headingText}>Team</Text>
      </View>

      <View style={styles.searchbar}>
        <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
        <TextInput placeholder="Search" onChangeText={(text) => searchFunction(text)}
          value={searchvalue} style={styles.searchInput} />
      </View>
      <View style={styles.bottomView}>
        <Text style={styles.title}>Team Details</Text>
        {loading && (
          <LottieAnimation
            source={require('../../../assets/icons//Loading.json')}
            autoPlay={true}
            loop={false}
            visible={loading}
            style={styles.animation}
          />
        )}
        <View style={styles.row}>
          <FlatList
            data={list}
            renderItem={({ item }) => (
              <POTeamListItem
                Name={item.name}
                onPress={() => onSelect(item)}
              ></POTeamListItem>
            )}
          />
        </View>
      </View>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#3A9EC2',
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
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
//     marginBottom:20,
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
//     top: 1,
//     textAlign: 'center',
//     fontSize: 30,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   animation: {
//     position: 'absolute',
//     width: '140%',
//     height: '140%',
//   },
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A9EC2',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'), // Convert marginBottom to responsive height
  },
  topView: {
    marginTop: hp('4%'), // Convert marginTop to responsive height
    marginHorizontal: wp('5%'), // Convert marginHorizontal to responsive width
    backgroundColor: '#3A9EC2',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  welcomeMessage: {
    position: 'absolute',
    top: hp('1%'), // Convert top to responsive height
    textAlign: 'center',
    fontSize: wp('8%'), // Convert fontSize to responsive width
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomView: {
    flex: 6,
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('13%'), // Convert borderTopLeftRadius to responsive width
    borderTopRightRadius: wp('13%'), // Convert borderTopRightRadius to responsive width
    paddingBottom: hp('5%'), // Convert paddingBottom to responsive height
    marginBottom: hp('2%'), // Convert marginBottom to responsive height
  },
  title: {
    marginHorizontal: wp('7%'), // Convert marginHorizontal to responsive width
    marginVertical: hp('2%'), // Convert marginVertical to responsive height
    fontWeight: 'bold',
    fontSize: wp('5%'), // Convert fontSize to responsive width
  },
  searchbar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    width: wp('95%'), // Convert width to responsive width
    height: hp('8%'), // Convert height to responsive height
    borderRadius: wp('15%'), // Convert borderRadius to responsive width
    marginBottom: hp('3%'), // Convert marginBottom to responsive height
    left: wp('2.5%'), // Convert left to responsive width
  },
  ProfileIcon: {
    width: wp('10%'), // Convert width to responsive width
    transform: [{ rotateY: '180deg' }],
  },
  searchInput: {
    color: "#BEBEBE",
    marginLeft: wp('4%'), // Convert marginLeft to responsive width
    opacity: 0.5,
    fontSize: wp('5%'), // Convert fontSize to responsive width
  },
  backButton: {
    left: wp('-3%'), // Convert left to responsive width
    top: hp('0.1%'), // Convert top to responsive height
  },
  headingText: {
    marginRight: wp('9%'), // Convert marginRight to responsive width
    top: hp('0.1%'), // Convert top to responsive height
    textAlign: 'center',
    fontSize: wp('8%'), // Convert fontSize to responsive width
    color: '#fff',
    fontWeight: 'bold',
  },
  animation: {
    position: 'absolute',
    width: wp('140%'), // Convert width to responsive width
    height: hp('140%'), // Convert height to responsive height
  },
});

export default TeamScreen;
