import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from '@expo/vector-icons';
import { Project } from '../Models/Project';
import { useAxios } from '../Contexts/Axios';
import { AdminStackParamList } from '../Routes/AdminStack';
import LottieAnimation from '../Components/Animation';
import { TeamEmployeeModel } from '../Models/TeamEmployeeModel';
import { RouteProp, useRoute } from '@react-navigation/native';
import POTeamDetailsListItem from '../Components/POTeamDetailsListItem';
import POProjectListItem from '../Components/POProjectListItem';
import Swiper from 'react-native-swiper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

//Navigation
type TaskListProps = NativeStackNavigationProp<AdminStackParamList, "Team">;

//Props
type TaskListRouteProps = RouteProp<AdminStackParamList, "TeamDetails">;

// interface Props {
//   onPress: () => void;  // Adjust the type as needed
//   list: TeamEmployeeModel[];
// }

const CarouselCard: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const axios = useAxios();
  const navigation = useNavigation<TaskListProps>();
  const route = useRoute<TaskListRouteProps>();

  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<TeamEmployeeModel[]>([]);
  const [originalList, setOriginalList] = React.useState<TeamEmployeeModel[]>([]);
  const [projectList, setProjectList] = React.useState<Project[]>([]);
  const [selectedTeamId] = React.useState(route.params.TeamId);

  const swiperRef = useRef<Swiper | null>(null);

  React.useEffect(() => {
    loadConnectionList();
  }, []);

  const loadConnectionList = async () => {
    setLoading(true);
    axios.privateAxios
      .get<TeamEmployeeModel[]>("/app/Team/GetTeamEmployeelist?teamId=" + selectedTeamId)
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

  const goToNextSlide = () => {
    if (swiperRef.current) {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      swiperRef.current.scrollTo(nextIndex, true);
    }
  };

  const goToPreviousSlide = () => {
    debugger
    if (swiperRef.current) {
      const previousIndex = activeIndex - 1;
      setActiveIndex(previousIndex);
      swiperRef.current.scrollBy(previousIndex, true);
    }
  };

  const onIndexChanged = (index: number) => {
    setActiveIndex(index);
  };

  const onSelect = async (data: TeamEmployeeModel) => {
    console.log("clicked")
    navigation.navigate('EmployeeAttendance',{EmployeeId:data.employeeId});
  }

  return (
    
    <View style={styles.carouselContainer}>
       {list.length !== 0 ? (
          <>
          <TouchableOpacity
       style={[styles.button1, styles.buttonPrevious]}
       onPress={goToPreviousSlide}
       disabled={activeIndex === 0}
     >
       <Ionicons name="chevron-back" size={30} color="white"/>
     </TouchableOpacity>
           <Swiper
             ref={swiperRef}
             loop={false}
             showsPagination={false}
             showsButtons={false}
             autoplay={false}
             dotStyle={styles.paginationDot}
             activeDotStyle={styles.activePaginationDot}
             onIndexChanged={onIndexChanged}
           >
             {list.map((item, index) => (
               <View style={styles.carouselItem} key={index}>
                 <POTeamDetailsListItem 
                  Name={item.employeeName}
                  onPress={() => onSelect(item)}
                   />
               </View>
             ))}
           </Swiper>
     
         
             <TouchableOpacity
               style={styles.button}
               onPress={goToNextSlide}
               disabled={activeIndex === list.length - 1}
             >
               <Ionicons name="chevron-forward" size={30} color="white" />
             </TouchableOpacity>
             </>
       
      ) : (
        <Text style={styles.noTeamText}>Team members not assigned.</Text>
         )}
    </View>
  );
};

// const styles = StyleSheet.create({
//   carouselContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   paginationDot: {
//     backgroundColor: 'gray',
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//   },
//   activePaginationDot: {
//     backgroundColor: 'blue',
//     width: 8,
//     height: 8,
//     borderRadius: 6,
//   },
//   carouselItem: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   buttonContainer1: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop:20 ,
//   },
//   button1: {
//     position: 'absolute',
//     top: '50%',
//     zIndex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonPrevious: {
//     left: 10,
//   },
//   button: {
//     position:'absolute',
//     left:346,
//     top:45,
//   },
//   noTeamText: {
//     fontSize: 18,
//     color: '#555',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
// });
const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  paginationDot: {
    backgroundColor: 'gray',
    width: wp('2%'), // Use responsive width
    height: wp('2%'), // Use responsive height
    borderRadius: wp('1%'), // Use responsive borderRadius
  },
  activePaginationDot: {
    backgroundColor: 'blue',
    width: wp('2%'), // Use responsive width
    height: wp('2%'), // Use responsive height
    borderRadius: wp('1.2%'), // Use responsive borderRadius
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1%'), // Use responsive marginTop
  },
  buttonContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'), // Use responsive marginTop
  },
  button1: {
    position: 'absolute',
    top: '50%',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrevious: {
    left: wp('1%'), // Use responsive left position
  },
  button: {
    position:'absolute',
    left: wp('90%'), // Use responsive left position
    top: hp('6%'), // Use responsive top position
  },
  noTeamText: {
    fontSize: wp('4%'), // Use responsive fontSize
    color: '#555',
    textAlign: 'center',
    marginBottom: hp('2%'), // Use responsive marginBottom
  },
});


export default CarouselCard;
