import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { AdminStackParamList } from '../../Routes/AdminStack';
import { useAxios } from '../../Contexts/Axios';
import { EmployeeDay } from '../../Models/EmployeeDay';
import { Ionicons } from '@expo/vector-icons';
import LottieAnimation from '../../Components/Animation';
import { Card, Title, Button, IconButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import EmployeeLoginDetails from '../../Components/EmployeeLoginDetails';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

//Props
type TaskListRouteProps = RouteProp<AdminStackParamList, "EmployeeAttendance">;

const EmployeeAttendanceScreen: React.FC = () => {
  const route = useRoute<TaskListRouteProps>();
  const axios = useAxios();
  const navigation = useNavigation();

  const [EmployeeId] = React.useState(route.params.EmployeeId);
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<EmployeeDay>();
  const [selectedMonth, setSelectedMonth] = React.useState<number | null>(null);

  React.useEffect(() => {
    loadConnectionList();
  }, [selectedMonth]);

  const loadConnectionList = async () => {
    setLoading(true);
    const monthToFetch = selectedMonth !== null ? selectedMonth : getCurrentMonth();

    axios.privateAxios
      .get<EmployeeDay>("/app/Employee/GetEmployeeAttendence?Id=" + EmployeeId + "&month=" + monthToFetch)
      .then((response) => {
        setLoading(false);
        setList(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response.data);
      });
  };

  const getCurrentMonth = () => {
    // Implement logic to get the current month
    const currentDate = new Date();
    return currentDate.getMonth() + 1;
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

        <Text style={styles.headingText}>Employee Details</Text>
      </View>
      <View style={styles.bottomView}>
        <View style={styles.attendence}>
          <Text style={styles.titleText}>Employee Attendence</Text>
          <View style={styles.dropdownRow}>
            <View style={styles.dropdownContainer}>
              <Picker style={styles.dropdown} selectedValue={selectedMonth}
                onValueChange={(itemValue) => setSelectedMonth(itemValue)}>
                <Picker.Item label="Monthly" value={0} />
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((monthName, index) => (
                  <Picker.Item key={index} label={monthName} value={index + 1} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
        {loading && (
          <LottieAnimation
            source={require('../../../assets/icons/Loading.json')}
            autoPlay={true}
            loop={false}
            visible={loading}
          />
        )}
        <View style={styles.row}>
          <Card style={styles.card}>
            <Card.Content>
              <Ionicons name="md-checkmark-circle" size={30} color="green" />
              <Title style={styles.partitionText}>Present {list && list.present ? list.present : 0} </Title>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Ionicons name="md-close-circle" size={30} color="red" />
              <Title style={styles.partitionText}>Absent {list && list.absent ? list.absent : 0} </Title>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Ionicons name="md-time" size={30} color="orange" />
              <Title style={styles.partitionText}>Late</Title>
              <Text>{list && list.late ? list.late : 0}</Text>
            </Card.Content>
          </Card>
        </View>

        <EmployeeLoginDetails></EmployeeLoginDetails>
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
//     marginRight: 50,
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
//     paddingBottom: 80,
//   },
//   title: {
//     marginHorizontal: 26,
//     marginVertical: 16,
//     fontWeight: 'bold',
//     fontSize: 20,
//   },
//   cardContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20,
//     width: "50%",
//   },
//   partitionText: {
//     color: 'Red',
//     fontWeight: 'bold',
//     fontSize: 12
//   },
//   titleText: {
//     marginHorizontal: 26,
//     marginVertical: 20,
//     fontWeight: 'bold',
//     fontSize: 20,
//   },
//   backButton: {
//     left: -15,
//     top: 6,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     marginVertical: 10,
//   },

//   card: {
//     flex: 1,
//     marginHorizontal: 5,
//     padding: 16,
//     elevation: 3, // Adds shadow
//   },
//   dropdownRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end', // Aligns items to the right
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     marginBottom: 10,
//     marginLeft: -30,
//     marginTop: 20,
//   },

//   dropdownContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 10, // Add some space between dropdowns
//   },

//   dropdown: {
//     width: 120, // Adjust width as needed
//     backgroundColor: '#f2f2f2',
//     height: 20,
//   },
//   attendence: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 0,
//     alignItems: 'center', // Align items vertically
//     marginVertical: 5,
//   },
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A9EC2',
  },
  topView: {
    marginTop: hp('3%'), // Use responsive marginTop
    marginHorizontal: wp('8%'), // Use responsive marginHorizontal
    backgroundColor: '#3A9EC2',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headingText: {
    marginRight: wp('13%'), // Use responsive marginRight
    top: hp('1%'), // Use responsive top
    textAlign: 'center',
    fontSize: wp('6%'), // Use responsive fontSize
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomView: {
    flex: 6,
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('12%'), // Use responsive borderTopLeftRadius
    borderTopRightRadius: wp('12%'), // Use responsive borderTopRightRadius
    paddingBottom: hp('8%'), // Use responsive paddingBottom
  },
  title: {
    marginHorizontal: wp('8%'), // Use responsive marginHorizontal
    marginVertical: hp('2%'), // Use responsive marginVertical
    fontWeight: 'bold',
    fontSize: wp('4%'), // Use responsive fontSize
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'), // Use responsive marginTop
    width: wp('50%'), // Use responsive width
  },
  partitionText: {
    color: 'Red',
    fontWeight: 'bold',
    fontSize: wp('2%'), // Use responsive fontSize
  },
  titleText: {
    marginHorizontal: wp('8%'), // Use responsive marginHorizontal
    marginVertical: hp('2%'), // Use responsive marginVertical
    fontWeight: 'bold',
    fontSize: wp('4%'), // Use responsive fontSize
  },
  backButton: {
    left: wp('-4%'), // Use responsive left
    top: hp('0.5%'), // Use responsive top
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'), // Use responsive paddingHorizontal
    marginVertical: hp('1%'), // Use responsive marginVertical
  },
  card: {
    flex: 1,
    marginHorizontal: wp('1%'), // Use responsive marginHorizontal
    padding: hp('1.5%'), // Use responsive padding
    elevation: 3, // Adds shadow
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Aligns items to the right
    alignItems: 'center',
    paddingHorizontal: wp('5%'), // Use responsive paddingHorizontal
    marginBottom: hp('1%'), // Use responsive marginBottom
    marginLeft: wp('-7%'), // Use responsive marginLeft
    marginTop: hp('2%'), // Use responsive marginTop
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp('2%'), // Use responsive marginRight
  },
  dropdown: {
    width: wp('30%'), // Adjust width as needed
    backgroundColor: '#f2f2f2',
    height: hp('2%'), // Use responsive height
  },
  attendence: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('0%'), // Use responsive paddingHorizontal
    alignItems: 'center', // Align items vertically
    marginVertical: hp('0.5%'), // Use responsive marginVertical
  },
});


export default EmployeeAttendanceScreen;
