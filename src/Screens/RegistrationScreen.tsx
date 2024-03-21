import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, FlatList, ScrollView, Button, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ProjectListItem from '../Components/ProjectListItem';
import { EmployeeStackParamList } from '../Routes/EmployeeStack';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import POInputField from '../Components/POSInputField';
import POButton from '../Components/POButton';
import axios from 'axios';
import { Register } from '../Models/RegisterModel';
import { useAxios } from '../Contexts/Axios';
import { AuthStackParamList } from '../Routes/AuthStack';
import LottieAnimation from '../Components/Animation';
import PODropDown from '../Components/PODropDown';
import { CommonMaster } from '../Models/CommonMaster';
import DropDown from '../Components/DropDown';
import MainAnimation from '../Components/MainScreenLoading';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type RegisterScreenProp = NativeStackNavigationProp<AuthStackParamList, "Register">;

const RegistrationScreen: React.FC = () => {
    const axios = useAxios();
    const navigation = useNavigation<RegisterScreenProp>();
    const route = useRoute();
    const params = route.params;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [PhoneNumber, setPhoneNumber] = React.useState<string>("");
    const [UserName, setUserName] = React.useState<string>("");
    const [EmployeeCode, setEmployeeCode] = React.useState<string>("");
    const [SecondaryEmail, setSecondaryEmail] = React.useState<string>("");
    const [Email, setEmail] = React.useState<string>("");
    const [Role, setRole] = React.useState<string>("Employee");
    const [showAnimation, setShowAnimation] = useState(false);
    const [DeptOptions, setDeptOptions] = useState<string[]>([]);
    const [selectedDeptValue, setSelectedDeptValue] = useState('');
    const [selectedCategoryValue, setSelectedCategoryValue] = useState('');
    const [CategoryOptions, setCategoryOptions] = useState<string[]>([]);
    const [selectedCategoryOptions, setSelectedCategoryOptions] = useState<string[]>([]);
    const [error, setError] = React.useState<string>("");
    const [loading, setLoading] = React.useState(false);
    const [Phoneerror, setPhoneError] = React.useState<string>("");
    const [Usernameerror, setUsernameError] = React.useState<string>("");
    const [Emailerror, setEmailError] = React.useState<string>("");
    const [SecEmailerror, setSecEmailError] = React.useState<string>("");
    const [Passworderror, setPasswordError] = React.useState<string>("");
    const [ConfirmPassworderror, setConfirmPasswordError] = React.useState<string>("");
    const [Departmenterror, setDepartmenterrorError] = React.useState<string>("");
    const [Categoryerror, setCategoryError] = React.useState<string>("");
    const [RoleOptions, setRoleOptions] = useState<string[]>([]);
    const [selectedRoleValue, setSelectedRoleValue] = useState('');
    const [Roleerror, setRoleError] = React.useState<string>("");


    const handleBackPress = () => {
        navigation.goBack();
    };
    useEffect(() => {
        loadConnectionList();
    }, []);

    const loadConnectionList = async () => {
        try {
            const response = await axios.privateAxios.get<CommonMaster[]>("/app/CommonMaster/GetCodeTableList")
            const DepartmentSet = new Set();
            response.data.forEach((item) => {
                 if (item.codeType === "EmployeeCategory") {
                    DepartmentSet.add(item.codeName);
                  }
            });
            const department = Array.from(DepartmentSet).map((category) => ({
                label: category,
                value: category,
            }));

            const categories = response.data.map((item) => ({
                label: item.codeValue,
                value: `${item.codeName}_${item.codeValue}`,
            }));

            const RoleSet = new Set();
            response.data.forEach((item) => {
                 if (item.codeType === "Role") {
                    RoleSet.add(item.codeValue);
                  }
            });
            const roles = Array.from(RoleSet).map((category) => ({
                label: category,
                value: category,
            }));
            setDeptOptions(department);
            setCategoryOptions(categories);
            setRoleOptions(roles);
            console.log(categories);

        } catch (error) {
            console.log(error.response.data);
            showMessage({
                message: 'error occured',
                type: 'danger',
                duration: 3000,
                floating: true,
                icon: () => (
                  <Ionicons name="alert-circle-outline" size={20} />
                ),
              });
        }
    };
    const newSelectedValue = selectedCategoryValue.split('_')[1];

    const OnRegister = async () => {
        debugger
        setLoading(true);
        setPhoneError("Please enter a valid phone number");
        setUsernameError("Please enter a username");
        setEmailError("Please enter a valid email address");
        setConfirmPasswordError("Please confirm the password");
        setPasswordError("Please Enter the password");
        setDepartmenterrorError("Please Select An Department");
        setCategoryError("Please Select An Category");
        setRoleError("Please Select An Role") 

        if (confirmPassword === "") {
            setConfirmPasswordError("Please confirm the password");
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }
        const registerData: Register = {
            phoneNumber: PhoneNumber,
            userName: UserName,
            employeeCode: EmployeeCode,
            email: Email,
            secondaryEmail: SecondaryEmail,
            password: password,
            confirmPassword: confirmPassword,
            role: selectedRoleValue,
            department: selectedDeptValue,
            category: newSelectedValue,
        };

        try {
            // setShowAnimation(true);
            await axios.privateAxios.post<Register>("/Auth/register", registerData);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            //setShowAnimation(false);
            setLoading(false);
            navigation.goBack(); // Navigate to the desired screen
        } catch (error) {
            console.log(error.response.data);
            setLoading(false);
            setError(error.response.data);
            showMessage({
                message: 'user already exist',
                type: 'danger',
                duration: 3000,
                floating: true,
                icon: () => (
                  <Ionicons name="alert-circle-outline" size={20} />
                ),
              });
        }
    };

    const handleDepartmentSelect = (value: string) => {
        const categoryOptions = CategoryOptions.filter((item) => item.value.startsWith(value));
        setSelectedCategoryValue(value);
        setSelectedCategoryOptions(categoryOptions);
    };
    const handleCategorySelect = (value: string) => {
        setSelectedCategoryValue(value);
    };
    const handleRoleSelect = (value: string) => {
        setSelectedRoleValue(value);
    };



    return (
        <View style={styles.container}>
 <FlashMessage position="top" style ={{height:60,marginTop:40}} textStyle ={{marginTop:10,fontSize:18}}/>
            <View style={[styles.topView, { marginBottom: 20 }]}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons
                        name="chevron-back"
                        size={30}
                        color="#fff"
                        style={styles.backButton}
                        onPress={handleBackPress}
                    />
                </TouchableOpacity>
                <Text style={styles.headingText}>Register</Text>

            </View>
            <View style={styles.bottomView}>
                <Text style={styles.titleText}>Create An Account</Text>
                {loading && (
                    <MainAnimation
                        source={require('../../assets/icons/thanku.json')}
                        autoPlay={true}
                        loop={false}
                        visible={loading}
                        style={styles.animation}
                    />
                )}
                <ScrollView>

                    <View style={styles.inputContainer}>
                        <POInputField
                            label="Phone Number"
                            placeholder="Phone Number"
                            value={PhoneNumber}
                            onChangeText={setPhoneNumber}
                            secureTextEntry={false}
                            maxLength={10}
                            keyboardType={'numeric'}
                        />
                        {PhoneNumber.length === 0 || PhoneNumber.length < 10 ? (
                            <Text style={{ color: 'red' }}>{Phoneerror}</Text>
                        ) : (
                            null
                        )}

                        <POInputField
                            label="User Name"
                            placeholder="User Name"
                            value={UserName}
                            onChangeText={setUserName}
                            secureTextEntry={false}
                        />
                        {UserName.length === 0 && <Text style={{ color: 'red' }}>{Usernameerror}</Text>}
                        <POInputField
                            label="Email"
                            placeholder="Email"
                            value={Email}
                            onChangeText={setEmail}
                            secureTextEntry={false}
                        />
                        {Email.length === 0 ? (<Text style={{ color: 'red' }}>{Emailerror}</Text>) : (null)}

                        <POInputField
                            label="Secondary Email"
                            placeholder="Secondary Email"
                            value={SecondaryEmail}
                            onChangeText={setSecondaryEmail}
                            secureTextEntry={false}
                        />
                        <PODropDown
                            title="Department"
                            placeholder="Select an option"
                            data={DeptOptions}
                            value={selectedDeptValue}
                            disable={false}
                            setValue={setSelectedDeptValue}
                            onChange={handleDepartmentSelect}
                            style={{margin:0}}
                            optionStyle={{margin:0,top:0}}
                        />
                        {selectedDeptValue.length === 0 ? (
                            <Text style={{ color: 'red' }}>{Departmenterror}</Text>
                        ) : (
                            null
                        )}
                        <PODropDown
                            title="Category"
                            placeholder="Select an option"
                            data={selectedCategoryOptions}
                            value={selectedCategoryValue}
                            disable={!selectedDeptValue}
                            setValue={setSelectedCategoryValue}
                            onChange={handleCategorySelect}
                            style={{margin:0}}
                            optionStyle={{margin:0,top:5}}
                        />
                        {selectedCategoryValue.length === 0 ? (
                            <Text style={{ color: 'red' }}>{Categoryerror}</Text>
                        ) : (
                            null
                        )}
                          <DropDown
                            label="Role"
                            placeholder="Select an option"
                            data={RoleOptions}
                            value={selectedRoleValue}
                            disable={false}
                            setValue={setSelectedRoleValue}
                            onChange={handleRoleSelect}
                        />
                        {selectedRoleValue.length === 0 ? (
                            <Text style={{ color: 'red' }}>{Roleerror}</Text>
                        ) : (
                            null
                        )}
                        <POInputField
                            label="Password"
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                            icon='eye'
                        />
                        {password.length === 0 ? (
                            <Text style={{ color: 'red' }}>{Passworderror}</Text>
                        ) : (
                            null
                        )}
                        <POInputField
                            label="Confirm Password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={true}
                            icon='eye'
                        />
                        {confirmPassword.length === 0 ? (
                            <Text style={{ color: 'red' }}>{ConfirmPassworderror}</Text>
                        ) : (
                            null
                        )}
                        {!passwordsMatch && <Text style={styles.errorText}>Passwords do not match</Text>}
                        <POButton
                            title="Register"
                            onPress={OnRegister}
                            style={styles.loginButton}
                            titleStyle={styles.buttonText}
                        />
                    </View>
                </ScrollView>

            </View>

        </View>
    );
};

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#3A9EC2',
//     },
//     topView: {
//         marginTop: 60,
//         marginHorizontal: 24,
//         backgroundColor: '#3A9EC2',
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     headingText: {
//         position: 'absolute',
//         top: 10,
//         textAlign: 'center',
//         fontSize: 30,
//         color: '#fff',
//         fontWeight: 'bold',
//     },
//     bottomView: {
//         flex: 9,
//         backgroundColor: '#fff',
//         borderTopLeftRadius: 50,
//         marginTop: 20,
//         borderTopRightRadius: 50,
//     },
//     titleText: {
//         marginHorizontal: 26,
//         marginVertical: 20,
//         fontWeight: 'bold',
//         fontSize: 20,
//     },
//     searchbar: {
//         flexDirection: "row",
//         backgroundColor: "#fff",
//         alignItems: "center",
//         width: "95%",
//         height: 50,
//         borderRadius: 30,
//         marginBottom: 25,
//         //bottom:50,
//         left: 10
//     },
//     circle: {
//         borderRadius: 25,
//         height: 50,
//         width: 50,
//         backgroundColor: "#fff"
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
//     inputContainer: {
//         marginTop: 20,
//         paddingHorizontal: 20,
//     },
//     backButton: {
//         position: 'absolute',
//         left: 0,
//         bottom:9,
//     },
//     loginButton: {
//         backgroundColor: '#35A2C1',
//         height: 50,
//         borderRadius: 8,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: 10,
//     },
//     buttonText: {
//         color: '#FFFFFF',
//         fontWeight: 'bold',
//         fontSize: 18,
//     },
//     errorText: {
//         color: 'red',
//         marginBottom: 10,
//     },
//     animation: {
//         position: 'absolute',
//         width: '140%',
//         height: '140%',
//     },

// });
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3A9EC2',
    },
    topView: {
        marginTop: hp('5%'), // Convert marginTop to responsive height
        marginHorizontal: wp('5%'), // Convert marginHorizontal to responsive width
        backgroundColor: '#3A9EC2',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headingText: {
        position: 'absolute',
        top: hp('1%'), // Convert top to responsive height
        textAlign: 'center',
        fontSize: wp('5%'), // Convert fontSize to responsive width
        color: '#fff',
        fontWeight: 'bold',
    },
    bottomView: {
        flex: 9,
        backgroundColor: '#fff',
        borderTopLeftRadius: hp('2%'), // Convert borderTopLeftRadius to responsive height
        marginTop: hp('2%'), // Convert marginTop to responsive height
        borderTopRightRadius: hp('2%'), // Convert borderTopRightRadius to responsive height
    },
    titleText: {
        marginHorizontal: wp('5%'), // Convert marginHorizontal to responsive width
        marginVertical: hp('2%'), // Convert marginVertical to responsive height
        fontWeight: 'bold',
        fontSize: wp('4%'), // Convert fontSize to responsive width
    },
    searchbar: {
        flexDirection: "row",
        backgroundColor: "#fff",
        alignItems: "center",
        width: wp('95%'), // Convert width to responsive width
        height: hp('7%'), // Convert height to responsive height
        borderRadius: wp('15%'), // Convert borderRadius to responsive width
        marginBottom: hp('3%'), // Convert marginBottom to responsive height
        left: wp('2.5%'), // Convert left to responsive width
    },
    circle: {
        borderRadius: wp('12.5%'), // Convert borderRadius to responsive width
        height: hp('7%'), // Convert height to responsive height
        width: hp('7%'), // Convert width to responsive height
        backgroundColor: "#fff"
    },
    customCardContainer: {
        backgroundColor: 'gray',
        marginHorizontal: wp('5%'), // Convert marginHorizontal to responsive width
        marginTop: hp('-4%'), // Convert marginTop to responsive height
        padding: wp('8%'), // Convert padding to responsive width
        borderRadius: wp('2.5%'), // Convert borderRadius to responsive width
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputContainer: {
        marginTop: hp('4%'), // Convert marginTop to responsive height
        paddingHorizontal: wp('5%'), // Convert paddingHorizontal to responsive width
    },
    backButton: {
        position: 'absolute',
        left: 0,
        bottom: hp('1%'), // Convert bottom to responsive height
    },
    loginButton: {
        backgroundColor: '#35A2C1',
        height: hp('7%'), // Convert height to responsive height
        borderRadius: wp('4%'), // Convert borderRadius to responsive width
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp('2%'), // Convert marginBottom to responsive height
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: wp('4.5%'),
    },
    errorText: {
        color: 'red',
        marginBottom: hp('2%'), 
    },
    animation: {
        position: 'absolute',
        width: wp('140%'), 
        height: hp('140%'), 
    },
});

export default RegistrationScreen;
