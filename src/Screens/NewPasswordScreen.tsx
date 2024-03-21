import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import POButton from '../Components/POButton';
import { useAxios } from '../Contexts/Axios';
import { PasswordRequest } from '../Models/Login/PasswordRequest';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../Routes/AuthStack';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { EmailRequest } from '../Models/Login/EmailRequest';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { Ionicons } from '@expo/vector-icons';
import POInputField from '../Components/POSInputField';

type LoginScreenProp = NativeStackNavigationProp<AuthStackParamList, "EmployeeLogin">;

const NewPasswordScreen: React.FC = () => {
    const axios = useAxios();
    const [newPassword, setNewPassword] = React.useState<string>("");
    const [confirmPW, setConfirmPW] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");
    const [emailerror, setemailError] = React.useState<string>("");
    const [otperror, setotpError] = React.useState<string>("");
    const [confirmerror, setconfirmError] = React.useState<string>("");

    const [otp, setOtp] = useState<string>("");
    const [email, setEmail] = React.useState<string>("");
    const [data, setdata] = React.useState<boolean>(false);
    const [data1, setdata1] = React.useState<boolean>(false);
    const [valid, setValid] = React.useState<string>("");
    const [verifyOtp, setVerifyOtp] = React.useState<string>("");
    const navigation = useNavigation<LoginScreenProp>();
    

    const back = async () => {
        navigation.navigate("EmployeeLogin");
    };


    const handleBackPress = () => {
        navigation.goBack();
    };

    const isPWFormValid = () => {
        debugger
        if (email === "") {
            setemailError("Please enter your email");
            //isLoading(false);
            return false;
        }
        return true;
    };

    const isOtpValid = () => {
        debugger
        if (verifyOtp === "") {
            setotpError("Please enter your otp");
            //isLoading(false);
            return false;
        }
        return true;
    };

    const isFPFormValid = () => {
        if (newPassword === "") {
            setconfirmError("Enter New Password");
            return false;
        } else if (confirmPW === "") {
            setconfirmError("Enter Confirm Password");
            return false;
        }
        return true;
    };

    const isFormValid = () => {
        if (newPassword !== confirmPW) {
            setError("Entered Password Mismatch");
            return false;
        }
        return true;
    };

    const isLengthValid = () => {
        if (newPassword.length < 6 || newPassword.length > 12 || confirmPW.length < 6 || confirmPW.length > 12) {
            setError("Password must be between 6 and 12 characters");
            return false;
        }
        return true;
    };

    const Save = async () => {
        setError("");

        if (!isPWFormValid()) {
            //  isLoading(false);
            return;
        }

        if (!isFPFormValid()) {
            return;
        }

        if (!isFormValid()) {
            return;
        }

        if (!isLengthValid()) {
            return;
        }

        const passwordSave: PasswordRequest = {
            Email: email,
            Password: newPassword,
            ConfirmPassword: confirmPW,
        };

        axios.publicAxios
            .post<PasswordRequest>("/Auth/ChangePW", passwordSave)
            .then((response) => {
                console.log(response.data);
                showMessage({
                    message: 'Password changed successfully',
                    type: 'success',
                    duration: 2000,
                    floating: true,
                    icon: () => (
                        <Ionicons name="checkmark-circle-outline" size={20} />
                    ),
                });
                back();
            })
            .catch((error) => {
                // setLoading(false);
                setError(error.response.data);
            });
    };


    const sendOtp = async() => {
        debugger
        if (!isPWFormValid()) {
            return;
        }
        const generatedOtp = generateOTP(); 
        debugger // Generate OTP immediately
        setOtp(generatedOtp); 

        if (generatedOtp && email) {
            const passwordSave: EmailRequest = {
                Email: email,
                verifyOtp:undefined,
                Otp: generatedOtp
            };
            axios.publicAxios
                .post<boolean>("/Auth/SendEmail", passwordSave)
                .then((response) => {
                    debugger
                    setdata(response.data) 
                    if (response.data === false) {
                        showMessage({
                            message: 'User does not exist',
                            type: 'danger',
                            duration: 2000,
                            floating: true,
                            icon: () => (
                                <Ionicons name="alert-circle-outline" size={20} />
                            ),
                        });
                    }

                })
                .catch((error) => {
                    setError(error.response.data);
                });
        };
      };


      const verify = () => {
        if (!isOtpValid()) {
            return;
        }

        debugger
        if (verifyOtp && email) {

            const passwordSave: EmailRequest = {
                Email: email,
                verifyOtp :verifyOtp,
                Otp:undefined
            };
            axios.publicAxios
                .post<string>("/Auth/VerifyOTP", passwordSave)
                .then((response) => {
                    debugger
                    setValid(response.data)
                    setdata1(true)
                    if (response.data === "Enter valid otp") {
                    showMessage({
                        message: 'Otp invalid',
                        type: 'danger',
                        duration: 2000,
                        floating: true,
                        icon: () => (
                            <Ionicons name="alert-circle-outline" size={20} />
                        ),
                    });
                }
                if (response.data === "OTP is valid") {
                    showMessage({
                        message: 'Otp verified',
                        type: 'success',
                        duration: 2000,
                        floating: true,
                        icon: () => (
                            <Ionicons name="checkmark-circle-outline" size={20} />
                        ),
                    });
                }

                })
                .catch((error) => {
                    setError(error.response.data);
                });
        };
      }

      const generateOTP = () => {
        const min = 1000;
        const max = 9999;
        const randomOTP = Math.floor(Math.random() * (max - min + 1)) + min;
        setOtp(randomOTP.toString()); 
        return randomOTP.toString(); 
    };




    return (
        <View style={styles.container}>
            <FlashMessage position="top" style ={{height:60,marginTop:40}} textStyle ={{marginTop:10,fontSize:18}}/>
            <View style={styles.topView}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons
                        name="chevron-back"
                        size={32}
                        color="#fff"
                    />
                </TouchableOpacity>
                <Text style={styles.headingText}>Create New Password</Text>
                <Text style={styles.keySymbol}>🔑</Text>
            </View>
            <View style={styles.bottomView}>
            <Text style={styles.titleText}>Enter the Details</Text>
            <View style={styles.inputContainer}>

             {
                  (valid == '' || valid !== "OTP is valid")?(
                    <POInputField 
                    label="Email"
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    secureTextEntry={false}
                   
                />
                  ):(
                       null
                  )
             }   
           
             {email.length == 0 ?(<Text style={{ color: 'red', margin: 5 }}>{emailerror}</Text>):(
                null
             )}  
                 {data == true && valid == ""? (
                    <POInputField
                            label="OTP"
                            placeholder="OTP"
                            value={verifyOtp}
                            onChangeText={setVerifyOtp}
                            secureTextEntry={false}
                           
                        />
                 ):(
                    null
                 )}
             
              {verifyOtp.length == 0 ? (<Text style={{ color: 'red', margin: 5 }}>{otperror}</Text>):(
                null
              )} 

             {data === false ?(
                <POButton
                    title="Send Otp"
                    onPress={sendOtp}
                    style={styles.loginButton}
                    titleStyle={styles.buttonText}
                />
             ):(
                null
             )}

              {
                data === true && data1 === false?(
                    <View style={styles.buttonContainer}>
                     <POButton
                    title="Resend Otp"
                    onPress={sendOtp}
                    style={styles.loginButton1}
                    titleStyle={styles.buttonText}
                />
                 <POButton
                    title="Verify"
                    onPress={verify}
                    style={styles.loginButton1}
                    titleStyle={styles.buttonText}
                />

                </View>
                ):(
                   ''
                )
               }

               
{
                    valid == "OTP is valid"?(
                     <POInputField
                            label="New Password"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={false}
                           
                        />
                       
                      
                        ):(
                            ""
                        )
                    }
             {
                    valid == "OTP is valid"?(
                     <POInputField
                            label="Confirm Password"
                            placeholder="Enter Confirm Password"
                            value={confirmPW}
                            onChangeText={setConfirmPW}
                            secureTextEntry={false}
                           
                        />
                        ):(
                            ""
                        )
                    }
 {confirmPW.length == 0 ? (<Text style={{ color: 'red', margin: 5 }}>{confirmerror}</Text>):(
                null
              )} 
  <Text style={{ color: 'red', margin: 5 }}>{error}</Text>
{
                valid == "OTP is valid"?(
                    <View style={styles.buttonContainer}>
                     <POButton
                    title="Save"
                    onPress={Save}
                    style={styles.loginButton1}
                    titleStyle={styles.buttonText}
                />
                 <POButton
                    title="Cancel"
                    onPress={back}
                    style={styles.loginButton1}
                    titleStyle={styles.buttonText}
                />

                </View>
                ):(
                   ''
                )
               }
             </View>
            </View>
         </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3A9EC2',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: wp('80%'), // Use wp for width percentage
        paddingHorizontal: wp('1%'),
        left:wp('4%') // Use wp for width percentage
    },
    titleText: {
        marginHorizontal: wp('27%'), // Convert marginHorizontal to responsive width
        marginVertical: hp('4%'), // Convert marginVertical to responsive height
        fontWeight: 'bold',
        fontSize: wp('5%'), // Convert fontSize to responsive width
    },
    loginButton: {
        backgroundColor: '#35A2C1',
        height: hp('7%'), // Convert height to responsive height
        borderRadius: wp('4%'), // Convert borderRadius to responsive width
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp('2%'),
        marginHorizontal:wp('20%') // Convert marginBottom to responsive height
    },
    loginButton1: {
        backgroundColor: '#35A2C1',
        height: hp('7%'), // Convert height to responsive height
        borderRadius: wp('4%'), // Convert borderRadius to responsive width
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp('2%'),
        marginHorizontal:wp('10%') // Convert marginBottom to responsive height
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: wp('4.5%'),
    },
    inputContainer: {
        marginTop: hp('4%'), // Convert marginTop to responsive height
        paddingHorizontal: wp('5%'), // Convert paddingHorizontal to responsive width
    },
    bottomView: {
        flex: 7,
        backgroundColor: '#fff',
        borderTopLeftRadius: hp('3%'), // Convert borderTopLeftRadius to responsive height
        marginTop: hp('2%'), // Convert marginTop to responsive height
        borderTopRightRadius: hp('3%'),
    },
    backButton: {
        position: 'absolute',
        left: 0,
        bottom: hp('9.5%'), 
    },
    keySymbol: {
        fontSize: wp('10%'), // Use wp for width percentage
        color: 'white',
        top: hp('5%'),
    },
    topView: {
        marginTop: hp('5%'), // Convert marginTop to responsive height
        marginHorizontal: wp('5%'), // Convert marginHorizontal to responsive width
        backgroundColor: '#3A9EC2',
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headingText: {
        position: 'absolute',
        top: hp('7%'), // Convert top to responsive height
        textAlign: 'center',
        fontSize: wp('6%'), // Convert fontSize to responsive width
        color: '#fff',
        fontWeight: 'bold',
    },
});


export default NewPasswordScreen;
