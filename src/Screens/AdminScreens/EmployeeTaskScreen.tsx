import React from 'react';
import { View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAxios } from '../../Contexts/Axios';
import LottieAnimation from '../../Components/Animation';
import EmployeeTaskListCard from '../../Components/EmployeeTaskListCard';
import { EmployeeTask } from '../../Models/EmployeeTask';
import { AdminStackParamList } from '../../Routes/AdminStack';
import { useFocusEffect } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import { EmployeeDailyTask } from '../../Models/EmployeeDailyTask';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


type TaskProp = RouteProp<AdminStackParamList, "EmployeeTask">;
const EmployeeTaskScreen: React.FC = () => {
    const axios = useAxios();
    const [loading, setLoading] = React.useState(false);
    const [list, setList] = React.useState<EmployeeTask[]>([]);
    const [originalList, setOriginalList] = React.useState<EmployeeTask[]>([]);
    const [searchvalue, setSearchValue] = React.useState<string>("");

    const navigation = useNavigation();
    const route = useRoute<TaskProp>();
    const [employeeName] = React.useState<string>(route.params.EmployeeName);
    const [employeeId] = React.useState<number>(route.params.EmployeeId);
    const [weekendDate] = React.useState<string>(route.params.WeekEndDate);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [employeeList, setEmployeeList] = React.useState<EmployeeTask[]>([]);
    const [todayWorkedOnList, setTodayWorkedOnList] = React.useState<EmployeeDailyTask[]>([]);

    const handleBackPress = () => {
        navigation.goBack();
    };
    const handleIndexChanged = (index) => {
        setActiveIndex(index);
    };

    useFocusEffect(
        React.useCallback(() => {
            debugger;
           // loadConnectionList();
            getEmployeeTask();
        }, [])
    );

    const today = new Date();
    const weekEndingDate = new Date(today);
    weekEndingDate.setDate(today.getDate() + (5 - today.getDay()));
    weekEndingDate.setHours(0, 0, 0, 0);
    const formattedWeekEndingDate = `${weekEndingDate.getFullYear()}-${('0' + (weekEndingDate.getMonth() + 1)).slice(-2)}-${('0' + weekEndingDate.getDate()).slice(-2)} ${('0' + weekEndingDate.getHours()).slice(-2)}:${('0' + weekEndingDate.getMinutes()).slice(-2)}:${('0' + weekEndingDate.getSeconds()).slice(-2)}.0000000`;
    

    const getEmployeeTask = async () => {
        setLoading(true);
        try {
            const response = await axios.privateAxios.get<EmployeeDailyTask[]>("/app/EmployeeTask/GetWhatsapptaskListByTaskId?employeeId=" + employeeId + "&WeekEndingDate=" + formattedWeekEndingDate);
            setLoading(false);
            filterData(response.data);
        } catch (error) {
            setLoading(false);
            console.log(error.response.data);
        }
    };

    const filterData = (data: EmployeeDailyTask[]) => {
        const today = new Date();
        const todayWorkedOnData = data.filter((item) => {
            const workedOnDate = new Date(item.workedOn);
            return workedOnDate.toDateString() === today.toDateString();
        });
        // Save filtered data into the respective hooks
        setTodayWorkedOnList(todayWorkedOnData);
    };

    const searchFunction = async (text: string) => {
        if (text) {
            const updatedData = originalList.filter((item) => {
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
            setList(originalList);
            setSearchValue("");
        }
    };

    const loadConnectionList = async () => {
        setLoading(true);
        setTimeout(() => {
            axios.privateAxios
                .get<EmployeeTask[]>("/app/Employee/GetEmployeeTaskList?Id=" + employeeId + "&weekend=" + weekendDate)
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

                <Text style={styles.headingText}>Employee Task OverView</Text>
            </View>
            <View style={styles.searchbar}>
                <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
                <TextInput placeholder="Search" style={styles.searchInput} value={searchvalue} onChangeText={(text) => searchFunction(text)} />
            </View>
            <View style={styles.bottomView}>
                <Text style={styles.titleText}><Ionicons name="person" size={20} color="black" />   Employee Name: {employeeName}</Text>
                <Text style={styles.boldText}>
                    Total Number of Assigned Task:{' '}
                    <Text style={styles.listLength}>{list.length}</Text>
                </Text>
                {loading ? (
                    <LottieAnimation
                        source={require('../../../assets/icons/Loading.json')}
                        autoPlay={true}
                        loop={true}
                        visible={loading}
                    />
                ) : (
                    <View style={{ flex: 1 }}>

                        <View style={styles.headerContainer}>
                            <TouchableOpacity onPress={() => setActiveIndex(0)}>
                                <Text style={[styles.headerText, activeIndex === 0 && styles.activeHeaderText]}>
                                    Assigned Task List
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveIndex(1)}>
                                <Text style={[styles.headerText, activeIndex === 1 && styles.activeHeaderText]}>
                                    Today Task List
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Swiper loop={false}
                            showsPagination={false}
                            index={activeIndex}
                            onIndexChanged={handleIndexChanged}
                            containerStyle={styles.swiperContainer}>
                            <View style={styles.slideContainer}>
                                {activeIndex === 0 && (
                                    <FlatList
                                        data={list}
                                        renderItem={({ item }) => (
                                            <EmployeeTaskListCard
                                                taskName={item.name}
                                                description={item.description}
                                                estTime={item.estTime}
                                                percentage={item.percentage}
                                                status={item.status}
                                            ></EmployeeTaskListCard>
                                        )}
                                    />
                                )}
                            </View>
                            <View style={styles.slideContainer}>
                                {activeIndex === 1 && (
                                    <FlatList
                                        data={todayWorkedOnList}
                                        renderItem={({ item }) => (
                                            <EmployeeTaskListCard
                                                taskName={item.name}
                                                description={item.taskDescription}
                                                status={item.status}
                                                percentage={item.percentage}
                                                estTime={item.estTime}
                                            />
                                        )}
                                    />
                                )}
                            </View>
                        </Swiper>
                    </View>
                )}
            </View>
        </View>
    );
};

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#3A9EC2',
//     },
//     headerContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         backgroundColor: '#f0f0f0',
//     },
//     headerText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     activeHeaderText: {
//         color: '#007bff', // Choose your highlight color
//     },
//     slideContainer: {
//         flex: 1,
//         justifyContent: 'center',
//     },
//     swiperContainer: {
//         flex: 1,
//     },
//     topView: {
//         marginTop: 30,
//         marginHorizontal: 24,
//         backgroundColor: '#3A9EC2',
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         flexDirection: 'row',
//     },
//     headingText: {
//         marginRight: 50,
//         top: 5,
//         textAlign: 'center',
//         fontSize: 23,
//         color: '#fff',
//         fontWeight: 'bold',
//         marginBottom: 10
//     },
//     bottomView: {
//         flex: 6,
//         backgroundColor: '#fff',
//         borderTopLeftRadius: 50,
//         marginTop: 20,
//         borderTopRightRadius: 50,
//         paddingBottom: 80,
//     },
//     titleText: {
//         marginHorizontal: 26,
//         marginVertical: 20,
//         fontWeight: 'bold',
//         fontSize: 18,
//     },
//     searchbar: {
//         flexDirection: "row",
//         backgroundColor: "#fff",
//         alignItems: "center",
//         width: "95%",
//         height: 50,
//         borderRadius: 30,
//         marginBottom: 25,
//         left: 10
//     },
//     circle: {
//         borderRadius: 25,
//         height: 50,
//         width: 50,
//         backgroundColor: "#fff"
//     },
//     ProfileIcon: {
//         width: 40,
//         transform: [{ rotateY: '180deg' }]
//     },
//     searchInput: {
//         color: "#BEBEBE",
//         marginLeft: 15,
//         opacity: 0.5,
//         fontSize: 20
//     },
//     customCardContainer: {
//         backgroundColor: 'gray',
//         marginHorizontal: 24,
//         marginTop: -40,
//         padding: 30,
//         borderRadius: 10,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     backButton: {
//         left: -5,
//         top: 1,
//     },
//     animation: {
//         position: 'absolute',
//         width: '100%',
//         height: '100%',
//     },
//     boldText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginLeft: 55,
//         top: -10,
//         fontFamily: 'Roboto',
//     },
//     listLength: {
//         fontSize: 20, // Adjust the size as needed
//         fontWeight: 'bold',
//     },
// });
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#3A9EC2',
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: wp('4%'), // Use responsive paddingHorizontal
      paddingVertical: hp('1%'), // Use responsive paddingVertical
      backgroundColor: '#f0f0f0',
    },
    headerText: {
      fontSize: wp('3.5%'), // Use responsive fontSize
      fontWeight: 'bold',
      color: '#333',
    },
    activeHeaderText: {
      color: '#007bff', // Choose your highlight color
    },
    slideContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    swiperContainer: {
      flex: 1,
    },
    topView: {
      marginTop: hp('2%'), // Use responsive marginTop
      marginHorizontal: wp('8%'), // Use responsive marginHorizontal
      backgroundColor: '#3A9EC2',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    headingText: {
      marginRight: wp('10%'), // Use responsive marginRight
      top: hp('0.5%'), // Use responsive top
      textAlign: 'center',
      fontSize: wp('4%'), // Use responsive fontSize
      color: '#fff',
      fontWeight: 'bold',
      marginBottom: hp('1%'), // Use responsive marginBottom
    },
    bottomView: {
      flex: 6,
      backgroundColor: '#fff',
      borderTopLeftRadius: wp('12%'), // Use responsive borderTopLeftRadius
      marginTop: hp('2%'), // Use responsive marginTop
      borderTopRightRadius: wp('12%'), // Use responsive borderTopRightRadius
      paddingBottom: hp('8%'), // Use responsive paddingBottom
    },
    titleText: {
      marginHorizontal: wp('8%'), // Use responsive marginHorizontal
      marginVertical: hp('2%'), // Use responsive marginVertical
      fontWeight: 'bold',
      fontSize: wp('3.5%'), // Use responsive fontSize
    },
    searchbar: {
      flexDirection: "row",
      backgroundColor: "#fff",
      alignItems: "center",
      width: wp('95%'), // Use responsive width
      height: hp('6%'), // Use responsive height
      borderRadius: wp('15%'), // Use responsive borderRadius
      marginBottom: hp('4%'), // Use responsive marginBottom
      left: wp('2%'), // Use responsive left
    },
    circle: {
      borderRadius: wp('12.5%'), // Use responsive borderRadius
      height: hp('10%'), // Use responsive height
      width: wp('20%'), // Use responsive width
      backgroundColor: "#fff"
    },
    ProfileIcon: {
      width: wp('13%'), // Use responsive width
      transform: [{ rotateY: '180deg' }]
    },
    searchInput: {
      color: "#BEBEBE",
      marginLeft: wp('4%'), // Use responsive marginLeft
      opacity: 0.5,
      fontSize: wp('4%'), // Use responsive fontSize
    },
    customCardContainer: {
      backgroundColor: 'gray',
      marginHorizontal: wp('8%'), // Use responsive marginHorizontal
      marginTop: hp('-10%'), // Use responsive marginTop
      padding: wp('8%'), // Use responsive padding
      borderRadius: wp('5%'), // Use responsive borderRadius
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    backButton: {
      left: wp('-2%'), // Use responsive left
      top: hp('0.2%'), // Use responsive top
    },
    animation: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    boldText: {
      fontSize: wp('4%'), // Use responsive fontSize
      fontWeight: 'bold',
      marginLeft: wp('13%'), // Use responsive marginLeft
      top: hp('-1%'), // Use responsive top
      fontFamily: 'Roboto',
    },
    listLength: {
      fontSize: wp('5%'), // Adjust the size as needed using responsive fontSize
      fontWeight: 'bold',
    },
  });
  


export default EmployeeTaskScreen;