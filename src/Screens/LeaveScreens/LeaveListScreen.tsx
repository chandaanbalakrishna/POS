import React from 'react';
import { useAxios } from '../../Contexts/Axios';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FloatingButton from '../../Components/FloatingButton';
import { EmployeeLeave } from '../../Models/EmployeeLeave';
import { useAuth } from '../../Contexts/Auth';
import LottieAnimation from '../../Components/Animation';
import POLeaveFilter from '../../Components/POLeaveFilter';
import { EmployeeLeaveHistory } from '../../Models/EmployeeLeaveHistory';
import Modal from 'react-native-modal';
import { Chip } from 'react-native-paper';
import POInputField from '../../Components/POSInputField';
import POLeaveListItem from '../../Components/POLeaveListItem';


type LeaveScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "LeaveListScreen">;

const LeaveListScreen: React.FC = () => {
    const navigation = useNavigation<LeaveScreenProp>();
    const [loading, setLoading] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [list, setList] = React.useState<EmployeeLeave[]>([]);
    const [leaveList, setLeaveList] = React.useState<EmployeeLeaveHistory[]>([]);
    const [originalList, setOriginalList] = React.useState<EmployeeLeave[]>([]);
    const [searchvalue, setSearchValue] = React.useState<string>("");
    const [status,setStatus] = React.useState<string[]>([]);
    const [leaveStatus,setLeaveStatus] = React.useState<string[]>([]);
    const [leaveDate,setLeaveDate] = React.useState<string[]>([]);
    const [leaveReason, setLeaveReason] = React.useState<string[]>([]);
    const [leaveType, setLeaveType] = React.useState<string[]>([]);
    const [leaveSubType, setLeaveSubType] = React.useState<string[]>([]);

    const axios = useAxios();
    const auth = useAuth();
  const employeeId = auth.loginData.employeeId;
    const handleBackPress = () => {
        navigation.goBack();
    };

    React.useEffect(() => {
        loadConnectionList();
      }, []);

      const handleClose = () => {
      
        setShowModal(false);
    };

    const leaveDateOnly = leaveDate.map(dateTimeString => {
      const dateObject = new Date(dateTimeString);
      const date = dateObject.toISOString().split('T')[0]; 
      return date;
    });
    
      const searchFunction = async (text: string) => {
        if (text) {
          const updatedData = originalList.filter((item) => {
            const LeaveType = `${item.leaveType.toUpperCase()}`;
            const LeaveReason = `${item.leaveReason}`;
            const LeaveStatus = `${item.leaveStatus}`;
            const textData = text.toUpperCase();
            return (
              LeaveType.indexOf(textData) > -1 ||
              LeaveReason.indexOf(textData) > -1 ||
              LeaveStatus.indexOf(text) > -1
            );
          });
          setList(updatedData);
          setSearchValue(text);
        } else {
          setList(originalList);
          setSearchValue("");
        }
      };
      
      const handleFilterChange = (status: string[]) => {
        debugger;
        const filteredList = originalList.filter((item) => {
          const matchesStatus = !status.length || status.includes(item.leaveStatus);
          return matchesStatus;
        });
        setList(filteredList);
      };    
      
const loadConnectionList = async () => {
    setLoading(true);
    setTimeout(() => {
    axios.privateAxios
      .get<EmployeeLeave[]>("/app/EmployeeLeave/GetAllEmployeeLeaveList?employeeId="+ employeeId)
      .then((response) => {
        debugger
        setLoading(false);
        setList(response.data);
        setOriginalList(response.data);
        
        const StatusSet = new Set();
        response.data.forEach((item) => {
            StatusSet.add(item.leaveStatus);
        });
        const statusArray = Array.from(StatusSet) as string[];
        setStatus(statusArray)
        })
        .catch((error) => {
          setLoading(false);
          console.log(error.response.data);
        });
    }, 1000);
  };

  const handleSubmit = (itemId) => {
    debugger
    setLoading(true);
    setTimeout(() => {
    axios.privateAxios.get<EmployeeLeaveHistory[]>("/app/EmployeeLeave/GetAllLeaveHistoryById?employeeId="  + employeeId  + "&selectedId=" + itemId)
      .then((response) => { 
        debugger         
        setLoading(false);
        setLeaveList(response.data);
        setShowModal(true);
        const statusSet = [];
        response.data.forEach((item) => {
            statusSet.push(item.approveStatus);
        });

        const leaveSet = [];
        response.data.forEach((item) => {
          leaveSet.push(item.leaveRequestDate);
        });
        
        const leaveReason = new Set();
        response.data.forEach((item) => {
          leaveReason.add(item.leaveReason);
        });

        const leaveType = new Set();
        response.data.forEach((item) => {
          leaveType.add(item.leaveType);
        });

        const leaveSubType = new Set();
        response.data.forEach((item) => {
          leaveSubType.add(item.leaveSubType);
        });

        const LeaveStatusArray = Array.from(statusSet) as string[];
        setLeaveStatus(LeaveStatusArray)

        const LeaveDateArray = Array.from(leaveSet) as string[];
        setLeaveDate(LeaveDateArray)

        const LeaveReasonArray = Array.from(leaveReason) as string[];
        setLeaveReason(LeaveReasonArray)

        const LeaveTypeArray = Array.from(leaveType) as string[];
        setLeaveType(LeaveTypeArray)

        const LeaveSubTypeArray = Array.from(leaveSubType) as string[];
        setLeaveSubType(LeaveSubTypeArray)
        
      })
      .catch((error) => {
        setLoading(false);
        console.error(error.response.data);
      });
    }, 1000);
  };


    return(
      <View style={styles.container}>
        <FlashMessage position="top" style ={{height:60,marginTop:40}} textStyle ={{marginTop:10,fontSize:18}}/>
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
                <Text style={styles.headingText}>Leave List Screen</Text>
            </View>
            <View style={styles.searchbar}>
            <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
            <TextInput placeholder="Search" style={styles.searchInput} value={searchvalue} onChangeText={(text) => searchFunction(text)}/>
            <POLeaveFilter  onFilterChange={true} Status={status} onSubmit={handleFilterChange}></POLeaveFilter>
          </View>
            <View style={styles.bottomView}>
            {loading && (
                    <LottieAnimation
                        source={require('../../../assets/icons/Loading.json')}
                        autoPlay={true}
                        loop={true}
                        visible={loading}
                    />
                )}
            <Text style={styles.titleText}>Leave Details</Text>
       
        <FlatList
          data={list}
          renderItem={({ item }) => (
            <POLeaveListItem
              LeaveType={item.leaveType}
              LeaveSubtype={item.leaveSubType}
              LeaveReason={item.leaveReason}
              CreatedDate={item.createdDate}
              Status={item.leaveStatus}
              onPress={() => handleSubmit(item.id)}
              itemId={item.id}
            ></POLeaveListItem>

          )}
        />
        
 <View >
      <Modal
        isVisible={showModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}
        //onBackdropPress={() => setShowModal(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <FontAwesome name="close" size={24} color="#999" />
          </TouchableOpacity>
          <Text style={styles.modalHeader}>Leave Details</Text>
          <View style={styles.input}>
          <POInputField
                            label={"leave Type"}
                            value={leaveType.toString()}
                            editable={false}
                            NonEditablelabel='leave Type'
                        ></POInputField>
                          {leaveType[0] === 'Dayoff' && (
         <POInputField
                            label={"leave SubType"}
                            value={leaveSubType.toString()}
                            editable={false}
                            NonEditablelabel='leave SubType'
                        ></POInputField>
                        )}
         <POInputField
                            label={"leave Reason"}
                            value={leaveReason.toString()}
                            editable={false}
                            NonEditablelabel='leave Reason'
                        ></POInputField>
                         </View>
         <View style={styles.text}>
         <Text style={styles.modalHeader}>Leave Requested Date</Text>
          <Text style={styles.modalHeader1}>Status</Text>
         </View>
         <View style={styles.popup}>
         <View>
          {leaveDateOnly.map((text, index) => (
        <Chip
          key={index}
          style={{
            backgroundColor: (text) ? '#35A2C1' : '#A9A9A9',
            margin: hp('1%')
          }}
          textStyle={{ color:(text) ? '#000000' : '#FFFFFF' }}
        >
          {text}
        </Chip>
      ))}
          </View>
          <View>
  {leaveStatus.map((text, index) => (
    <Chip
      key={index}
      style={{
        backgroundColor: text === 'Pending' ? '#A9A9A9' : text === 'Approved' ? '#90EE90' : text === 'Rejected' ? 'red' : '#A9A9A9',
        marginTop: -hp('4.6%'),
        marginLeft: hp('30%')
      }}
      textStyle={{ color: text === 'pending' ? '#000000' : '#FFFFFF' }}
    >
      {text}
    </Chip>
  ))}
</View>
    </View>
        </View>
      </Modal>
    </View>
                            
            </View>
           
            <View>
            <FloatingButton
                                title="Add Leave"
                                variant='contained'
                                style={styles.popupButton}
                                titleStyle={styles.popupButtonText}
                                icon='arrow-right-bold-circle'
                                onPress={() => navigation.navigate('LeaveRequestScreen')}
                            />
            </View>
           
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#3A9EC2',
    },
    boldText: {
      fontSize: wp('4%'),
      fontWeight: 'bold',
      marginBottom: hp('1%'),
      fontFamily: 'Roboto',
      marginLeft:wp('2%')
    },
    normalText: {
      fontSize: wp('4%'), 
      marginBottom: hp('1%'), 
      fontFamily: 'Roboto',
      fontWeight: 'normal',
    },
    popup:{
     flexDirection:"row",
     flexWrap:"wrap",
    },
    text:{
      flexDirection:'row',
      marginTop: hp('3%'),
    },
    modalHeader: {
      fontSize: hp('2.2%'), // Adjust the font size using responsive percentage
      fontWeight: 'bold',
      marginBottom: hp('0%'), // Adjust the margin using responsive percentage
    },
    modalHeader1: {
      fontSize: hp('2.2%'), // Adjust the font size using responsive percentage
      fontWeight: 'bold',
      marginBottom: hp('0%'), // Adjust the margin using responsive percentage
      marginLeft:wp('17%')
    },
    modal: {
      justifyContent:'flex-end',
      margin: 0,
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: hp('2%'),
      borderRadius: hp('1%'), 
      width: wp('100%'),
      height:hp('80%'),
      marginBottom:wp('1%') 
    },
    input:{
      marginTop:hp('4%')
    },
    closeButton: {
      position: 'absolute',
      top: hp('0.5%'), 
      right: wp('3.5%'), 
      zIndex: 999,
    },
    popupButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: hp('1.75%'),
      },
      popupButton: {
        backgroundColor: '#35A2C1',
        borderRadius: wp('7.5%'),
        alignItems: 'center',
        height: hp('6%'),
        justifyContent:'center',
        marginBottom:hp('25%'),
      },
    topView: {
        marginTop: hp('5%'),
        marginHorizontal: wp('10%'),
        backgroundColor: '#3A9EC2',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      backButton: {
        position: 'absolute',
        left: -wp('2%'),
        bottom: hp('0.1%'),
      },
      titleText: {
        marginVertical: hp('2.5%'),
        fontWeight: 'bold',
        fontSize: hp('2.3%'),
        textAlign: 'center',
      },
      headingText: {
        position: 'absolute',
        top: hp('3%'),
        textAlign: 'center',
        fontSize: hp('3.5%'),
        color: '#fff',
        fontWeight: 'bold',
      },
      bottomView: {
        flex: 9,
        backgroundColor: '#fff',
        borderTopLeftRadius: wp('10%'),
        marginTop: hp('2.5%'),
        borderTopRightRadius: wp('10%'),
        paddingBottom: hp('9%'),
      },
      ProfileIcon: {
        width: wp('10%'),
        transform: [{ rotateY: '180deg' }]
      },
      searchbar: {
        flexDirection: "row",
        backgroundColor: "#fff",
        alignItems: "center",
        width: wp('94%'),
        height: hp('6%'),
        borderRadius: wp('15%'),
        marginTop: hp('3%'),
        left: wp('3%'),
      },
      searchInput: {
        color: "#BEBEBE",
        marginLeft: wp('2%'), 
        opacity: 0.5,
        fontSize: wp('5%') 
    },
})
export default LeaveListScreen;