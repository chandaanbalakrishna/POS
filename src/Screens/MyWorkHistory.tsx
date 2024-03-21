import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, SafeAreaView  } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import DateTimePickerWorkHistory from '../Components/DateTimePickerWorkHistory';
import { useNavigation } from '@react-navigation/native';
import POTaskListItem from '../Components/POTaskListItem';
import { TimePlan } from '../Models/TimePlanModel';
import { useAxios } from '../Contexts/Axios';
import LottieAnimation from '../Components/Animation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const WorkHistory: React.FC = () => {
  const navigation = useNavigation();
  const axios = useAxios();
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');
  const [list, setList] = React.useState<TimePlan[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const Search = () => {
    setLoading(true);
    axios.privateAxios
      .get<TimePlan[]>(`/app/EmployeeHistory/GetEmployeeHistory?fromDate=${fromDate}&toDate=${toDate}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setList(response.data);
          setErrorMessage('');
        } else {
          setList([]);
          setErrorMessage('No results found. Please search with proper dates.');
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response.data);
      });
  };
  const onSelect = () => {
    //navigation.goBack();
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={30} color="#fff" style={styles.backButton} onPress={handleBackPress} />
        </TouchableOpacity>
        <Text style={styles.headingText}>My Work History</Text>
      </View>
      <SafeAreaView style={styles.middleView}>
        {loading && (
          <LottieAnimation
            source={require('../../assets/icons/Loading.json')}
            autoPlay={true}
            loop={true}
            visible={loading}
          />
        )}
        <View style={styles.dateContainer}>
          <View style={styles.datePickerContainer}>
            <DateTimePickerWorkHistory label="From Date" value={fromDate} onChangeText={handleFromDateChange} placeholder="Enter Date" />
          </View>
          <View style={styles.datePickerContainer}>
            <DateTimePickerWorkHistory label="To Date" value={toDate} onChangeText={handleToDateChange} placeholder="Enter Date" />
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={Search}>
            <FontAwesome name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : (
          <FlatList
            data={list}
            renderItem={({ item }) => (
              <POTaskListItem
                Name={item.name}
                Description={item.description}
                Status={item.status}
                percentage={item.percentage}
                onPress={() => onSelect()}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </SafeAreaView>
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
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headingText: {
//     marginTop: 15,
//     textAlign: 'center',
//     fontSize: 30,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   middleView: {
//     flex: 1,
//     top:50,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 50,
//     borderTopRightRadius: 50,
//     paddingBottom:100, // Adjust this value to accommodate the height of your navigation bar
//   },  
//   scrollViewContent: {
//     flexGrow: 1,
//   },
//   backButton: {
//     position: 'absolute',
//     left: 0,
//     bottom:0,
//   },
//   dateContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     marginTop:20,
//     marginBottom:10,
//   },
//   datePickerContainer: {
//     flex: 1,
//     marginRight: 10,
//   },
//   searchButton: {
//     backgroundColor: '#35A2C1',
//     borderRadius: 10,
//     width: 50,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     top: 5,
//   },
//   bottomView: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     // Add styles for your fixed navigation bar
//   },
//   errorMessage: {
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 18,
//     color: 'red',
//   },
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A9EC2',
    
  },
  flatlist:{
   marginBottom:hp('5%')
  },
  topView: {
    marginTop: hp('4%'),
    marginHorizontal: wp('5%'),
    backgroundColor: '#3A9EC2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingText: {
    marginTop: hp('3%'),
    textAlign: 'center',
    fontSize: wp('6%'),
    color: '#fff',
    fontWeight: 'bold',
  },
  middleView: {
    flex: 1,
    top: hp('6%'),
    backgroundColor: '#fff',
    borderTopLeftRadius: hp('6%'),
    borderTopRightRadius: hp('6%'),
    paddingBottom: hp('10%'), // Adjust this value to accommodate the height of your navigation bar
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: hp('1.5%'),
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('7%'),
    marginTop: hp('3%'),
    marginBottom: hp('2%'),
  },
  datePickerContainer: {
    flex: 1,
    marginRight: wp('3%'),
  },
  searchButton: {
    backgroundColor: '#35A2C1',
    borderRadius: hp('2%'),
    width: wp('15%'),
    height: wp('12%'),
    justifyContent: 'center',
    alignItems: 'center',
    top: hp('0.5%'),
  },
  bottomView: {
    position: 'absolute',
    left: 0,
    right: 0,
    // Add styles for your fixed navigation bar
  },
  errorMessage: {
    textAlign: 'center',
    marginTop: hp('4%'),
    fontSize: wp('4.5%'),
    color: 'red',
  },
});

export default WorkHistory;
