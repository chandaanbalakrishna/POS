import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput, ScrollView, Modal, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from '../Contexts/Auth';
import { useAxios } from '../Contexts/Axios';
import { AdminStackParamList } from '../Routes/AdminStack';
import DashboardCard from "../Components/DashBoardCard";
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type HomeScreenProp = NativeStackNavigationProp<AdminStackParamList, "Home">;
const AdminHomeScreen: React.FC = () => {
  const auth = useAuth();
  const axios = useAxios();
  const navigation = useNavigation<HomeScreenProp>();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [greeting, setGreeting] = useState('');

  const handleIconPress = () => {
    setIsModalVisible(true);
  };
  useEffect(() => {
    const currentHour = new Date().getHours();
    let newGreeting = '';

    if (currentHour >= 0 && currentHour < 12) {
      newGreeting = 'Good Morning!';
    } else if (currentHour >= 12 && currentHour < 18) {
      newGreeting = 'Good Afternoon!';
    } else {
      newGreeting = 'Good Evening!';
    }

    setGreeting(newGreeting);
  }, []);


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topview}>
          <View style={styles.welcomecontainer}>
            <Text style={styles.welcomemessage}>Hello,{'\n'}{auth.loginData.userName}
            </Text>
            <View style={styles.circle} />
          </View>
          <Text style={styles.greetingText}>{greeting} Have A Nice Day</Text>

          <View>
            {/* <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
            <TextInput placeholder="Search" style={styles.searchInput} /> */}
          </View>
        </View>
        <View style={styles.bottomview}>
          <Text style={styles.optionText}>Choose your Option</Text>
          <View style={styles.row}>
          <DashboardCard
              title="Projects"
              icon={require('../../assets/icons/project.png')}
              onPress={() => navigation.navigate('Project')}
            />
            <DashboardCard
              title={`Team`}
              icon={require('../../assets/icons/team.png')}
              onPress={() => navigation.navigate('Team')}
            />

          </View>
        </View>

      </ScrollView>
      <View style={styles.NavBar}>
        <View style={styles.bottomMenu}>
          <Ionicons name="home" size={25} color="#35A2C1" />
          <Ionicons name="person" size={25} color="#BDBEC1" />
          <TouchableOpacity onPress={handleIconPress}>
            <Ionicons name="reorder-three" size={29} color="#BDBEC1" />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={25} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={auth.signOut} style={styles.option}>
              <Text style={styles.option}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>

  );
}

// const styles = StyleSheet.create({
//   topview: {
//     marginTop: 60,
//     marginHorizontal: 24,
//     backgroundColor: "#3A9EC2",
//     flex: 1,
//     justifyContent: "space-between"
//   },
//   welcomemessage: {
//     color: "#fff",
//     fontSize: 35,
//     fontWeight: "bold"
//   },

//   circle: {
//     borderRadius: 25,
//     height: 50,
//     width: 50,
//     backgroundColor: "#fff"
//   },
//   welcomecontainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center"
//   },
//   greetingText: {
//     color: "#fff",
//     bottom: 30,
//     fontWeight: 'bold',
//     fontSize:20
//   },
//   searchInput: {
//     color: "#BEBEBE",
//     marginLeft: 15,
//     opacity: 0.5,
//     fontSize: 20
//   },
//   bottomview: {
//     flex: 1,
//     marginTop: -80,
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 50,
//     borderTopRightRadius: 50,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#3A9EC2",
//   },
//   ProfileIcon: {
//     width: 40,
//     transform: [{ rotateY: '180deg' }]
//   },
//   optionText: {
//     marginHorizontal: 26,
//     marginVertical: 20,
//     fontWeight: 'bold',
//     fontSize: 20,
//   },
//   bottomMenu: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     margin: 26,
//     backgroundColor: '#fff',
//   },
//   NavBar: {
//     position: "absolute",
//     bottom: 0,
//     width: "100%"
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     marginHorizontal: 80,
//     marginBottom: 20,
//     marginLeft:10
//   },
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     width: '50%',
//     height: '100%',
//     borderTopLeftRadius: 16,
//     borderBottomLeftRadius: 16,
//     padding: 16,
//   },
//   closeButton: {
//     alignItems: 'flex-end',
//     marginBottom: 16,
//   },
//   option: {
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   assistButton: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//   },
// });

const styles = StyleSheet.create({
  topview: {
    marginTop: hp('5%'),
    marginHorizontal: wp('8%'),
    backgroundColor: "#3A9EC2",
    flex: 1,
    justifyContent: "space-between"
  },
  welcomemessage: {
    color: "#fff",
    fontSize: wp('8%'),
    fontWeight: "bold"
  },

  circle: {
    borderRadius: wp('6.25%'), // Equivalent to 50% of the height
    height: hp('10%'),
    width: hp('10%'), // Make it square based on height percentage
    backgroundColor: "#fff"
  },
  welcomecontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  greetingText: {
    color: "#fff",
    bottom: hp('4%'),
    fontWeight: 'bold',
    fontSize: wp('4%'),
  },
  searchInput: {
    color: "#BEBEBE",
    marginLeft: wp('3%'),
    opacity: 0.5,
    fontSize: wp('4%'),
  },
  bottomview: {
    flex: 1,
    marginTop: -hp('10%'), // Adjust this value based on your layout
    backgroundColor: "#fff",
    borderTopLeftRadius: wp('10%'),
    borderTopRightRadius: wp('10%'),
  },
  container: {
    flex: 1,
    backgroundColor: "#3A9EC2",
  },
  ProfileIcon: {
    width: wp('8%'),
    transform: [{ rotateY: '180deg' }]
  },
  optionText: {
    marginHorizontal: wp('8%'),
    marginVertical: hp('2%'),
    fontWeight: 'bold',
    fontSize: wp('4%'),
  },
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: wp('4%'),
    backgroundColor: '#fff',
  },
  NavBar: {
    position: "absolute",
    bottom: 0,
    width: "100%"
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: wp('20%'), // Adjust this value based on your layout
    marginBottom: hp('2%'),
    marginLeft: wp('2%'),
  },
  scrollContainer: {
    flexGrow: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: wp('50%'),
    height: '100%',
    borderTopLeftRadius: wp('4%'),
    borderBottomLeftRadius: wp('4%'),
    padding: wp('4%'),
  },
  closeButton: {
    alignItems: 'flex-end',
    marginBottom: hp('2%'),
  },
  option: {
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  assistButton: {
    position: 'absolute',
    bottom: hp('2%'),
    right: wp('4%'),
  },
});


export default AdminHomeScreen;