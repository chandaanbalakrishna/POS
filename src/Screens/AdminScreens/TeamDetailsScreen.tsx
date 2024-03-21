
import React, { } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, TouchableHighlight  } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from '@expo/vector-icons';
import { Project } from '../../Models/Project';
import { useAxios } from '../../Contexts/Axios';
import { AdminStackParamList } from '../../Routes/AdminStack';
import LottieAnimation from '../../Components/Animation';
import { TeamEmployeeModel } from '../../Models/TeamEmployeeModel';
import { RouteProp, useRoute } from '@react-navigation/native';
import POProjectListItem from '../../Components/POProjectListItem';
import CarouselCard from '../../Components/CarouselCard';
import { TabView } from 'react-native-tab-view';
import WeekEndingDropdown from '../../Components/POWeekEndingDateDropdown';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

//Navigation
type TaskListProps = NativeStackNavigationProp<AdminStackParamList, "Team">;

//Props
type TaskListRouteProps = RouteProp<AdminStackParamList, "TeamDetails">;

const TeamDetailsScreen: React.FC = () => {
  const axios = useAxios();
  const navigation = useNavigation<TaskListProps>();
  const route = useRoute<TaskListRouteProps>();

  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<TeamEmployeeModel[]>([]);
  const [originalList, setOriginalList] = React.useState<TeamEmployeeModel[]>([]);
  const [selectedTeamId] = React.useState(route.params.TeamId);
  const [index, setIndex] = React.useState(0);
  const [selectedWeekEndingDate, setSelectedWeekEndingDate] = React.useState('');
  const [selectedEmployee, setSelectedEmployee] = React.useState<TeamEmployeeModel | null>(null);
  const handleEmployeeNamePress = (employee: TeamEmployeeModel) => {
    setSelectedEmployee(employee);
    navigation.navigate('EmployeeTask', { EmployeeName: employee.employeeName, EmployeeId: employee.employeeId, WeekEndDate: selectedWeekEndingDate });
  };

  const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <FlatList
        data={list}
        renderItem={({ item }) => (
          <TouchableHighlight onPress={() => handleEmployeeNamePress(item)} underlayColor="#D3D3D3">
            <View style={styles.listItemContainer}>
              <Text style={[
                styles.employeeName,
                item === selectedEmployee ? { color: '#3A9EC2' } : null,
              ]}> <Ionicons name="person" size={15} color="black" />   {item.employeeName}
              </Text>
              <Text style={styles.hours}>{`${item.actualHour}/${item.estHour}`}</Text>
            </View>
          </TouchableHighlight>
        )}
      />
    </View>
  );
  const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#D3D3D3' }}>
      <FlatList
        data={list}
        renderItem={({ item }) => (
          <View style={styles.listItemContainer}>
            <Text style={styles.employeeName}>
              <Ionicons name="person" size={15} color="black" />   {item.employeeName}
            </Text>
            <Text style={styles.hours}>{`${40 - item.estHour}`}</Text>
          </View>
        )}
      />
    </View>
  );
  const [routes] = React.useState([
    { key: 'first', title: 'Assigned Hours' },
    { key: 'second', title: 'Unassigned Hours' },
  ]);
  React.useEffect(() => {
    loadConnectionList();
  }, [selectedWeekEndingDate]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const loadConnectionList = async () => {
    setLoading(true);
    axios.privateAxios
      .get<TeamEmployeeModel[]>("/app/Employee/GetEmployeeTask?teamId=" + selectedTeamId + "&weekend=" + selectedWeekEndingDate)
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

  const onSelect = async (data: Project) => {
    navigation.goBack();
  }
  const renderScene = () => {
    switch (index) {
      case 0:
        return <FirstRoute />;
      case 1:
        return <SecondRoute />;
      default:
        return null;
    }
  };
  const handleTabPress = (index: number) => {
    setIndex(index);
  };
  const renderTabBar = (props: any) => (
    <View style={styles.tabBar}>
      {props.navigationState.routes.map((route: any, tabIndex: number) => (
        <TouchableOpacity
          key={route.key}
          onPress={() => handleTabPress(tabIndex)}
          style={[
            styles.tabItem,
            tabIndex === index ? styles.activeTabItem : null,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              tabIndex === index ? styles.activeTabText : null,
            ]}
          >
            {route.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  const handleWeekEndingDateSelect = (text: string) => {
    setSelectedWeekEndingDate(text);
    console.log(text);
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

        <Text style={styles.headingText}>Team Details</Text>

      </View>
     
      <CarouselCard></CarouselCard>

      <View style={styles.bottomView}>
        {loading && (
          <LottieAnimation
            source={require('../../../assets/icons//Loading.json')}
            autoPlay={true}
            loop={false}
            visible={loading}
            style={styles.animation}
          />
        )}
       
       <View style={{ flex: 1 }}>
          <View style={{ margin: 20 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
              Week Ending Date :
            </Text>
            <WeekEndingDropdown value={selectedWeekEndingDate} onChangeText={handleWeekEndingDateSelect} />
          </View>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            style={styles.tabView}
            renderTabBar={renderTabBar}
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
//     marginTop: 5,
//     flex: 6,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 50,
//     borderTopRightRadius: 50,
//     paddingBottom:40,
//   },
//   title: {
//     marginHorizontal: 26,
//     marginVertical: 16,
//     fontWeight: 'bold',
//     fontSize: 20,
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
//   },
//   carouselContainer: {
//     height: 100,
//   },
//   carouselItem: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   paginationDot: {
//     backgroundColor: 'gray',
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginBottom: -15,
//     marginTop: 10,
//   },
//   activePaginationDot: {
//     backgroundColor: 'blue',
//     width: 8,
//     height: 8,
//     marginBottom: -15,
//     marginTop: 10,
//   },
//   tabView: {
//     margin: 20,
//     borderRadius: 10,
//   },
//   tabBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: '#3A9EC2',
//   },
//   tabItem: {
//     flex: 1,
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   activeTabItem: {
//     borderBottomWidth: 2,
//     borderBottomColor: 'white',
//   },
//   tabText: {
//     fontSize: 16,
//     color: 'white',
//   },
//   activeTabText: {
//     fontWeight: 'bold',
//   },
//   listItemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   employeeName: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   hours: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginRight: 40
//   },
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A9EC2',
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
    marginTop: hp('0.5%'), // Convert marginTop to responsive height
    flex: 6,
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('13%'), // Convert borderTopLeftRadius to responsive width
    borderTopRightRadius: wp('13%'), // Convert borderTopRightRadius to responsive width
    paddingBottom: hp('2%'), // Convert paddingBottom to responsive height
  },
  title: {
    marginHorizontal: wp('7%'), // Convert marginHorizontal to responsive width
    marginVertical: hp('2%'), // Convert marginVertical to responsive height
    fontWeight: 'bold',
    fontSize: wp('5%'), // Convert fontSize to responsive width
  },

  backButton: {
    left: wp('-3%'), // Convert left to responsive width
    top: hp('0.1%'), // Convert top to responsive height
  },
  headingText: {
    marginRight: wp('9%'), // Convert marginRight to responsive width
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
  carouselContainer: {
    height: hp('8%'), // Convert height to responsive height
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    backgroundColor: 'gray',
    width: wp('1.5%'), // Convert width to responsive width
    height: hp('1.5%'), // Convert height to responsive height
    borderRadius: wp('1%'), // Convert borderRadius to responsive width
    marginBottom: hp('-1.5%'), // Convert marginBottom to responsive height
    marginTop: hp('1%'), // Convert marginTop to responsive height
  },
  activePaginationDot: {
    backgroundColor: 'blue',
    width: wp('1.5%'), // Convert width to responsive width
    height: hp('1.5%'), // Convert height to responsive height
    marginBottom: hp('-1.5%'), // Convert marginBottom to responsive height
    marginTop: hp('1%'), // Convert marginTop to responsive height
  },
  tabView: {
    margin: wp('5%'), // Convert margin to responsive width
    borderRadius: wp('10%'), // Convert borderRadius to responsive width
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#3A9EC2',
  },
  tabItem: {
    flex: 1,
    paddingVertical: hp('1.5%'), // Convert paddingVertical to responsive height
    alignItems: 'center',
  },
  activeTabItem: {
    borderBottomWidth: wp('0.2%'), // Convert borderBottomWidth to responsive width
    borderBottomColor: 'white',
  },
  tabText: {
    fontSize: wp('4%'), // Convert fontSize to responsive width
    color: 'white',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'), // Convert paddingVertical to responsive height
    paddingHorizontal: wp('5%'), // Convert paddingHorizontal to responsive width
    borderBottomWidth: hp('0.1%'), // Convert borderBottomWidth to responsive height
    borderBottomColor: '#ccc',
  },
  employeeName: {
    flex: 1,
    fontSize: wp('4%'), // Convert fontSize to responsive width
    fontWeight: 'bold',
  },
  hours: {
    fontSize: wp('4%'), // Convert fontSize to responsive width
    fontWeight: 'bold',
    marginRight: wp('8%'), // Convert marginRight to responsive width
  },
});

export default TeamDetailsScreen;