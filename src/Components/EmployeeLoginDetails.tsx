import React from 'react';
import { View, StyleSheet, Text,FlatList } from 'react-native';
import { RouteProp, useRoute,useNavigation } from '@react-navigation/native';
import { AdminStackParamList } from '../Routes/AdminStack';
import { useAxios } from '../Contexts/Axios';
import { EmployeeAttendance } from '../Models/EmployeeAttendence';
import WeekEndingDropdown from './POWeekEndingDateDropdown';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
//Props
type TaskListRouteProps = RouteProp<AdminStackParamList, "EmployeeAttendance">;

const EmployeeLoginDetails: React.FC = () => {
  const route = useRoute<TaskListRouteProps>();
  const axios = useAxios();
  const navigation = useNavigation();

  const [EmployeeId]=React.useState(route.params.EmployeeId);
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<EmployeeAttendance[]>();
  const [selectedWeekEndingDate, setSelectedWeekEndingDate] = React.useState('');

  React.useEffect(() => {
    loadConnectionList();
  }, [selectedWeekEndingDate]);

  const loadConnectionList = async () => {
    debugger
    setLoading(true);
    axios.privateAxios
      .get<EmployeeAttendance[]>("/app/Employee/GetEmployeeLoginDetails?Id=" + EmployeeId + "&weekend=" + selectedWeekEndingDate)
      .then((response) => {
        debugger
        setLoading(false);
        setList(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response.data);
      });
  };

  const handleWeekEndingDateSelect = (text: string) => {
    setSelectedWeekEndingDate(text);
    console.log(text);
  };


  const formatTime = (dateTimeString) => {
    debugger;
    const date = new Date(dateTimeString);
    return `${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <View style={{ flex: 1 }}>
    <View style={{ margin: 20 }}>
      <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
        Week Ending Date :
      </Text>
      <WeekEndingDropdown value={selectedWeekEndingDate} onChangeText={handleWeekEndingDateSelect} />
    </View>

   
  <View style={styles.headerRow}>
    <Text style={styles.headerCell}>Date</Text>
    <Text style={styles.headerCell}>In Time</Text>
    <Text style={styles.headerCell}>Out Time</Text>
  </View>
  {list && list.length > 0 ? (
    <FlatList
      style={styles.flatListContainer}
      data={list}
      keyExtractor={(item) => item.date.toString()}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={styles.dataCell}>
            <Text>{new Date(item.date).toLocaleDateString('en-GB')}</Text>
          </View>
          <View style={styles.dataCell}>
            <Text>{formatTime(item.inTime)}</Text>
          </View>
          <View style={styles.dataCell}>
            <Text>{formatTime(item.outTime)}</Text>
          </View>
        </View>
      )}
    />
  ) : (
    <Text style={styles.noDataText}>No data available.</Text>
  )}
</View>
  );

};

// const styles = StyleSheet.create({
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     marginVertical: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#000', // Add a border at the bottom of the header row
//     backgroundColor: '#f0f0f0', // Background color for the header row
//   margin:10,
//   },
//   headerCell: {
//     flex: 1,
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   flatListContainer: {
//     flex: 1,
//     marginHorizontal: 10, // Add horizontal margin to the entire table
//     backgroundColor: 'white', // Set the background color of the table
  
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//     marginVertical: 10,
//     borderColor: '#ddd', // Add a light gray border around each cell
//     borderWidth: 1, // Set the border width
//     borderRadius: 5, // Add some border radius for a softer look
//     backgroundColor: 'white', // Set the background color of each row
//     marginTop:-1,
//   },
//   dataCell: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f9f9f9', // Background color for the data cells
  
//   },
//   noDataText: {
//     alignSelf: 'center',
//     marginTop: 20,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'), // Use responsive padding
    marginVertical: hp('2%'), // Use responsive margin
    borderBottomWidth: 1,
    borderBottomColor: '#000', // Add a border at the bottom of the header row
    backgroundColor: '#f0f0f0', // Background color for the header row
    margin: wp('2%'), // Use responsive margin
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  flatListContainer: {
    flex: 1,
    marginHorizontal: wp('2%'), // Use responsive margin
    backgroundColor: 'white', // Set the background color of the table
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('2%'), // Use responsive padding
    marginVertical: hp('2%'), // Use responsive margin
    borderColor: '#ddd', // Add a light gray border around each cell
    borderWidth: 1, // Set the border width
    borderRadius: wp('1%'), // Add some border radius for a softer look
    backgroundColor: 'white', // Set the background color of each row
    marginTop: -1,
  },
  dataCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9', // Background color for the data cells
  },
  noDataText: {
    alignSelf: 'center',
    marginTop: hp('2%'), // Use responsive margin
    fontSize: wp('4%'), // Use responsive font size
    fontWeight: 'bold',
  },
});



export default EmployeeLoginDetails;
