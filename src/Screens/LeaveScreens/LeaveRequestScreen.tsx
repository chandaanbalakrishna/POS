import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import POInputField from '../../Components/POSInputField';
import PODropDown from '../../Components/PODropDown';
import POButton from '../../Components/POButton';
import PODateTimePicker from '../../Components/PODateTimePicker';
import DropDown from '../../Components/DropDown';
import React, { useEffect, useState } from 'react';
import { Status } from '../../Constants/Status';
import axios from 'axios';
import { CommonMaster } from '../../Models/CommonMaster';
import { useAxios } from '../../Contexts/Axios';
import POLeaveDatePicker from '../../Components/POLeaveDatePicker';
import { EmployeeLeave } from '../../Models/EmployeeLeave';
import { useAuth } from '../../Contexts/Auth';

type LeaveRequestScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "LeaveListScreen">;

const LeaveRequestScreen: React.FC = () => {
 const navigation = useNavigation<LeaveRequestScreenProp>();
 interface Option {
    label: string;
    value: string;
  }
  const axios = useAxios();
  const auth = useAuth();
  const employeeId = auth.loginData.employeeId;
 const [status, setStatus] = React.useState<string>(Status.Pending);
 const [leaveTypeOptions, setLeaveTypeOptions] = useState<Option[]>([]);
 const [leaveSubTypeOptions, setLeaveSubTypeOptions] = useState<Option[]>([]);
 const [LeaveTypeValue, setLeaveTypeValue] = useState('');
 const [leaveDateText, setLeaveDateText] = useState<string>('');
 const [reason, setReason] = React.useState<string>("");
 const [selectedLeaveDates, setSelectedLeaveDates] = useState<Date[]>([]);
 const [leaveerror, setLeaveerror] = React.useState<string>("");
 const [reasonerror, setReasonerror] = React.useState<string>("");
 const [leavetypeerror, setLeaveTypeerror] = React.useState<string>("");
 const [leavesubtypeerror, setLeaveSubTypeerror] = React.useState<string>("");
 console.log(selectedLeaveDates)
 const [LeaveSubTypeValue, setLeaveSubTypeValue] = useState('');
 
    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleLeaveTypeSelect = (text: string) => {
        setLeaveTypeValue(text);
    };

    const handleLeaveSubTypeSelect = (text: string) => {
        setLeaveSubTypeValue(text);
    };

    const handleLeaveDatesChange = (dates: Date[]) => {
        setSelectedLeaveDates(dates);
      };

      function formatDateToSQLFormat(dates) {
        return dates.toISOString().slice(0, 19).replace('T', ' ');
      }

      const formattedDates = selectedLeaveDates.map((dates) => {
        return formatDateToSQLFormat(dates);
      });
      

    useEffect(() => {
        loadConnectionList();
    }, []);
    
    const loadConnectionList = async () => {
        debugger
        try {
          const response = await axios.privateAxios.get<CommonMaster[]>("/app/CommonMaster/GetCodeTableList");
      
          const leaveTypeSet = new Set<string>();
          const leaveSubTypeSet = new Set<string>();
      
          response.data.forEach((item) => {
            debugger
            if (item.codeName === "LeaveType") {
                leaveTypeSet.add(item.codeValue);
            } else if (item.codeName === "LeaveSubType") {
                leaveSubTypeSet.add(item.codeValue);
            }
          });
       debugger
          const leaveTypeOptions: Option[] = Array.from(leaveTypeSet).map((codeValue) => ({
            label: codeValue,
            value: codeValue,
          }));
      
          const leaveSubTypeOptions: Option[] = Array.from(leaveSubTypeSet).map((codeValue) => ({
            label: codeValue,
            value: codeValue,
          }));
      
          setLeaveTypeOptions(leaveTypeOptions);
          setLeaveSubTypeOptions(leaveSubTypeOptions);
        } catch (error) {
          console.log(error.response?.data);
        }
      };


      const isFormValid = () => {
         debugger
        let isValid = true; 
      
        if (reason === null || reason === "") {
          setReasonerror("Please Enter Leave Reason");
          isValid = false; 
        }
      
        if (selectedLeaveDates.length === 0) {
          setLeaveerror("Please Select Leave Dates");
          isValid = false; 
        }
      
        if (LeaveTypeValue.length === 0 || LeaveTypeValue === "") {
          setLeaveTypeerror("Please Select Leave Type");
          isValid = false; 
        }
      
        if (LeaveTypeValue === "DayOff" && (LeaveSubTypeValue.length === 0 || LeaveSubTypeValue === "") ) {
          setLeaveSubTypeerror("Please Select Leave SubType");
          isValid = false; 
        }
        return isValid; 
      };
      

      const handleSubmit = () => {
        debugger
        if (!isFormValid()) {
            return;
          }
          const newApplyLeave : Partial<EmployeeLeave> ={
            EmployeeId:employeeId,
            leaveType:LeaveTypeValue,
            leaveSubType:LeaveSubTypeValue,
            leaveRequestDate :selectedLeaveDates,
            leaveReason :reason,
            leaveStatus :status,
        }
        debugger;
        axios.privateAxios.post<EmployeeLeave>("/app/EmployeeLeave/ApplyEmployeeLeave", newApplyLeave)
            .then((response) => {
                console.log(response.data);
                showMessage({
                    message: 'leave applied Successfully!',
                    type: 'success',
                    duration: 3000,
                    floating: true,
                    icon: () => (
                        <Ionicons name="checkmark-circle-outline" size={20} />
                    ),
                });
                navigation.navigate("Home");
            })
            .catch((error) => {
                console.log(error.response.data)
                
                showMessage({
                    message: error.response.data,
                    type: 'danger',
                    duration: 3000,
                    floating: true,
                    icon: () => (
                        <Ionicons name="alert-circle-outline" size={20} />
                    ),
                });
            })
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
                <Text style={styles.headingText}>Leave Request Screen</Text>
            </View>
           
            <View style={styles.bottomView}>
            <SafeAreaView>
           </SafeAreaView>
                <Text style={styles.titleText}>Apply Leave Details</Text>
                <ScrollView>
                    <View style={styles.inputContainer}>
                    <DropDown
                      label="Leave Type"
                      placeholder="Select an option"
                      data={leaveTypeOptions}
                      value={LeaveTypeValue}
                      disable={false}
                      setValue={setLeaveTypeValue}
                      onChange={handleLeaveTypeSelect}
                    />
             {LeaveTypeValue.length === 0 && <Text style={{ color: 'red', left: hp('0.5%') }}>{leavetypeerror}</Text>}
                   {LeaveTypeValue === 'DayOff' && (
         <>
        <DropDown
          label="Leave Sub Type"
          placeholder="Select an option"
          data={leaveSubTypeOptions}
          value={LeaveSubTypeValue}
          disable={false}
          setValue={setLeaveSubTypeValue}
          onChange={handleLeaveSubTypeSelect}
        />
        {LeaveSubTypeValue.length === 0  && <Text style={{ color: 'red', left: hp('0.5%') }}>{leavesubtypeerror}</Text>}
        </>
      )}
                       <POInputField
                            label="Leave Reason"
                            placeholder="Leave Reason"
                            value={reason}
                            onChangeText={setReason}
                            secureTextEntry={false}
                            editable={true}
                            NonEditablelabel='Leave Reason'
                              />
                {reason.length === 0 && <Text style={{ color: 'red',left:hp('0.5%') }}>{reasonerror}</Text>}   
     <View>
    
      
      <POLeaveDatePicker
        label=""
        selectedDates={selectedLeaveDates}
        onSelectDates={handleLeaveDatesChange}
        placeholder="Select leave dates"
        minimumDate={new Date()}
      />
    </View>
    {selectedLeaveDates.length == 0 && <Text style={{ color: 'red',left:hp('0.5%')  }}>{leaveerror}</Text>}

                             <POInputField
                            label="Status"
                            placeholder="Status"
                            value={"Pending"}
                            onChangeText={setStatus}
                            secureTextEntry={false}
                            editable={false}
                            NonEditablelabel='Status'/>
                            
                        <POButton
                            title="Submit"
                             onPress={handleSubmit}
                            style={styles.loginButton}
                            titleStyle={styles.buttonText}
                        />
                 
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#3A9EC2',
    },
    loginButton: {
        backgroundColor: '#35A2C1',
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        bottom:10,
    },
    titleText: {
        marginVertical: hp('2.5%'),
        fontWeight: 'bold',
        fontSize: hp('2.3%'),
        textAlign: 'center',
      },
      buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom:-6
    },
      inputContainer: {
        paddingHorizontal: wp('9%'),
        paddingVertical:hp('2%')
      },
    backButton: {
        position: 'absolute',
        left: -wp('3.2%'),
        bottom: hp('2%'),
      },
      headingText: {
        position: 'absolute',
        top: hp('6%'),
        textAlign: 'center',
        fontSize: hp('3.5%'),
        color: '#fff',
        fontWeight: 'bold',
      },
      topView: {
        marginTop: hp('5%'),
        marginHorizontal: wp('10%'),
        backgroundColor: '#3A9EC2',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      bottomView: {
        flex: 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: wp('10%'),
        marginTop: hp('2.5%'),
        borderTopRightRadius: wp('10%'),
        paddingBottom: hp('10%'),
      },
      selectedDatesLabel: {
        fontSize: 16,
        marginTop: 16,
        fontWeight: 'bold',
      },
      selectedDatesText: {
        fontSize: 14,
      },
});
export default LeaveRequestScreen;