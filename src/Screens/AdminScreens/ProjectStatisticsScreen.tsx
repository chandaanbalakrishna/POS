import React, { } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from '@expo/vector-icons';
import { useAxios } from '../../Contexts/Axios';
import { AdminStackParamList } from '../../Routes/AdminStack';
import LottieAnimation from '../../Components/Animation';
import { ProjectStatModel } from '../../Models/ProjectStatModel';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Switch } from 'react-native-paper';
import CircleAnimation from '../../Components/CircleAnimation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


type ProjectListProps = RouteProp<AdminStackParamList, "ProjectStatistics">;
type TaskListProps = NativeStackNavigationProp<AdminStackParamList, "Project">;

const ProjectStatisticsScreen: React.FC = () => {
  const axios = useAxios();
  const navigation = useNavigation<TaskListProps>();
  const route = useRoute<ProjectListProps>();

  const [loading, setLoading] = React.useState(false);
  const [stat, setStat] = React.useState<ProjectStatModel>();
  const [count, setCount] = React.useState(0);
  const rotation = new Animated.Value(0);
  const projectId = route.params.ProjectId;
  const name = route.params.Name;
  const desc = route.params.Description;
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [percentage, setPercentage] = React.useState(0);

  React.useEffect(() => {
    loadConnectionList();
  }, []);

  const rotateCircle = () => {
    // setCount(count + 1);

    Animated.timing(rotation, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      rotation.setValue(0);
    });
  };



  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });


  const loadConnectionList = async () => {
    axios.privateAxios
      .get<ProjectStatModel>("/app/Project/GetProjectStatDetails?ProjectId=" + projectId)
      .then((response) => {
        debugger
        setStat(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };
  const handleBackPress = () => {
    navigation.goBack();
  };

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);



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

        <Text style={styles.headingText}>Project Statistics</Text>

        <Text style={styles.switch}>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />;
        </Text>

      </View>


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


        <View style={styles.CircleContainer}>
          <View>
          {isSwitchOn ? (<>
            <View style={styles.row}>
                <Animated.View style={[styles.circle1, { transform: [{ rotate: spin }] }]}>
                  <Text style={styles.countText}>{stat && stat.totalTask ? stat.totalTask : 0}</Text>
                </Animated.View>
                <Text style={styles.totalTaskText}>Total Task</Text>
                <Animated.View style={[styles.circle, { transform: [{ rotate: spin }] }]}>
                  <Text style={styles.countText}>{stat && stat.inProgressTask ? stat.inProgressTask : 0}</Text>
                </Animated.View>
                <Text style={styles.totalTaskText}>Inprogress Task</Text>
            </View>

            <View style={styles.row}>
                <Animated.View style={[styles.circle, { transform: [{ rotate: spin }] }]}>
                  <Text style={styles.countText}>{stat && stat.completedTask ? stat.completedTask : 0}</Text>
                </Animated.View>
                <Text style={styles.totalTaskText}>Completed Task</Text>
                <Animated.View style={[styles.circle, { transform: [{ rotate: spin }] }]}>
                  <Text style={styles.countText}>{stat && stat.totalUI ? stat.totalUI : 0}</Text>
                </Animated.View>
                <Text style={styles.totalTaskText}>Total User Interface</Text>
            </View>

            <View style={styles.row}>
                <Animated.View style={[styles.circle2, { transform: [{ rotate: spin }] }]}>
                  <Text style={styles.countText}>{stat && stat.totalUserStory ? stat.totalUserStory : 0}</Text>
                </Animated.View>
                <Text style={styles.totalTaskText}>Total UserStory</Text>
                <Animated.View style={[styles.circle, { transform: [{ rotate: spin }] }]}>
                  <Text style={styles.countText}>{stat && stat.totalProjectObjective ? stat.totalProjectObjective : 0}</Text>
                </Animated.View>
                <Text style={styles.totalTaskText}>Total Objective</Text>
            </View>
          </>) : (<>
            <View style={styles.Content}>
            <View style={styles.rowCircle}>
                <View style={styles.circleContainer}>
                  <CircleAnimation pct={stat && stat.taskPercentage ? stat.taskPercentage : 0} size={60} />
                  <Text style={styles.totalTaskText1}>Total Task</Text>
                </View>
                <View style={styles.circleContainer}>
                  <CircleAnimation pct={stat && stat.inProgressPercentage ? stat.inProgressPercentage : 0} size={60} />
                  <Text style={styles.totalTaskText1}>Inprogress Task</Text>
                </View>
            </View>

            <View style={styles.rowCircle}>
                <View style={styles.circleContainer1}>
                  <CircleAnimation pct={stat && stat.completedPercentage ? stat.completedPercentage : 0} size={60} />
                  <Text style={styles.totalTaskText1}>Completed Task</Text>
                </View>
                <View style={styles.circleContainer}>
                  <CircleAnimation pct={stat && stat.uiPercentage ? stat.uiPercentage : 0} size={60} />
                  <Text style={styles.totalTaskText1}> UserInterface</Text>
                </View>
            </View>

            <View style={styles.rowCircle}>
                <View style={styles.circleContainer1}>
                  <CircleAnimation pct={stat && stat.userStoryPercentage ? stat.userStoryPercentage : 0} size={60} />
                  <Text style={styles.totalTaskText1}>Total UserStory</Text>
                </View>
                <View style={styles.circleContainer}>
                  <CircleAnimation pct={stat && stat.objectivePercentage ? stat.objectivePercentage : 0} size={60} />
                  <Text style={styles.totalTaskText1}>Total Objective</Text>
                </View>
            </View>
            </View>
          </>)}
          </View>
          <View style={styles.containers} >
            <View>
              <Text style={styles.boldText}>
                Name: <Text style={styles.normalText}>{name}</Text>
              </Text>

              <Text style={styles.boldText}>
                Description: <Text style={styles.normalText}>{desc}</Text>
              </Text>

              <Text style={styles.boldText}>
                Team: <Text style={styles.normalText}>{stat && stat.teamName ? stat.teamName : ''}</Text>
              </Text>
            </View>
          </View>
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
//   CircleContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop:-100,
//   },
//   containers: {
//     backgroundColor: '#DFF6FF',
//     borderRadius: 30,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 5,
//     margin: 15,
//   },
//   circleContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop:-60,
//     marginRight:50,
//     marginLeft:40
//   },
//   circleContainer1: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop:-70,
//     marginRight:40,
//     marginLeft:20,
//   },
//   Content:{
//     marginTop:140,
//     marginBottom:-60
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
//   totalTaskText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginTop:90,
//     right:85
//   },
//   totalTaskText1: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginTop:100,
//     right:85,
//     left:10,
//     top:-90
//   },
//   boldText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 4,
//     fontFamily: 'Roboto',
//   },
//   normalText: {
//     fontSize: 16,
//     marginBottom: 4,
//     fontFamily: 'Roboto',
//     fontWeight: 'normal',
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
//   },
//   backButton: {
//     left: -5,
//     top: 4,
//   },
//   switch: {
//     marginTop: 17
//   },
//   headingText: {
//     marginRight: 30,
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
//   },
//   row: {
//     flexDirection: 'row',
//     marginLeft:150,
//     marginRight:30,
//     marginTop:40
//   },
//   rowCircle: {
//     flexDirection: 'row',
//     marginTop:30
//   },
//   circle: {
//     width: 60,
//     height: 60,
//     borderRadius: 50,
//     backgroundColor: '#3A9EC2',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20
//   },
//   circle1: {
//     width: 60,
//     height: 60,
//     borderRadius: 50,
//     backgroundColor: '#3A9EC2',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20,
//     marginRight:40
//   },
//   circle2: {
//     width: 60,
//     height: 60,
//     borderRadius: 50,
//     backgroundColor: '#3A9EC2',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20,
//     marginRight:10
//   },
//   countText: {
//     fontSize: 15,
//     color: 'Black',
//     fontWeight: 'bold'
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A9EC2',
  },
  CircleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('-10%'), 
  },
  containers: {
    backgroundColor: '#DFF6FF',
    borderRadius: wp('8%'), 
    padding: wp('4%'),
    marginBottom: hp('2%'), 
    elevation: 5,
    marginHorizontal: wp('3%'),
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('-6%'), 
    marginRight: wp('10%'),
    marginLeft: wp('8%'), 
  },
  circleContainer1: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('-7%'), 
    marginRight: wp('8%'), 
    marginLeft: wp('4%'), 
  },
  Content: {
    marginTop: hp('12%'), 
    marginBottom: hp('-6%'), 
  },
  topView: {
    marginTop: hp('4%'), 
    marginHorizontal: wp('5%'),
    backgroundColor: '#3A9EC2',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  totalTaskText: {
    fontSize: wp('3.5%'), 
    fontWeight: 'bold',
    marginTop: hp('8%'),
    right: wp('17%'), 
  },
  totalTaskText1: {
    fontSize: wp('3.5%'), 
    fontWeight: 'bold',
    marginTop: hp('9%'), 
    right: wp('17%'),
    left: wp('2%'), 
    top: hp('-8%'), 
  },
  boldText: {
    fontSize: wp('4%'), 
    fontWeight: 'bold',
    marginBottom: hp('1%'), 
    fontFamily: 'Roboto',
  },
  normalText: {
    fontSize: wp('4%'), 
    marginBottom: hp('1%'), 
    fontFamily: 'Roboto',
    fontWeight: 'normal',
  },
  welcomeMessage: {
    position: 'absolute',
    top: hp('1%'), 
    textAlign: 'center',
    fontSize: wp('8%'), 
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomView: {
    flex: 6,
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('13%'), 
    borderTopRightRadius: wp('13%'), 
  },
  backButton: {
    left: wp('-1%'), 
    top: hp('0.5%'), 
  },
  switch: {
    marginTop: hp('1.5%'), 
  },
  headingText: {
    marginRight: wp('7%'), 
    top: hp('0.5%'),
    textAlign: 'center',
    fontSize: wp('8%'),
    color: '#fff',
    fontWeight: 'bold',
  },
  animation: {
    position: 'absolute',
    width: wp('140%'), 
    height: hp('140%'), 
  },
  row: {
    flexDirection: 'row',
    marginLeft: wp('30%'), 
    marginRight: wp('6%'), 
    marginTop: hp('6%'), 
  },
  rowCircle: {
    flexDirection: 'row',
    marginTop: hp('4%'), 
  },
  circle: {
    width: wp('15%'), 
    height: hp('8%'),
    borderRadius: wp('10%'), 
    backgroundColor: '#3A9EC2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('4%'), 
  },
  circle1: {
    width: wp('15%'), 
    height: hp('8%'), 
    borderRadius: wp('10%'), 
    backgroundColor: '#3A9EC2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('4%'), 
    marginRight: wp('8%'), 
  },
  circle2: {
    width: wp('15%'), 
    height: hp('8%'), 
    borderRadius: wp('10%'), 
    backgroundColor: '#3A9EC2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('4%'), 
    marginRight: wp('2%'), 
  },
  countText: {
    fontSize: wp('3%'), 
    color: 'black',
    fontWeight: 'bold',
  },
});


export default ProjectStatisticsScreen;
