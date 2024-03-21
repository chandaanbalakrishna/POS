import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import  { showMessage } from 'react-native-flash-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import POInputField from '../../Components/POSInputField';
import POButton from '../../Components/POButton';
import DropDown from '../../Components/DropDown';
import React, { useEffect, useState } from 'react';
import { useAxios } from '../../Contexts/Axios';
import { useAuth } from '../../Contexts/Auth';
import { QuestionPaperQuestion } from '../../Models/QuestionPaperQuestion';
import { AppAnswer } from '../../Models/AppAnswer';

type ScrumUpdateScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "ScrumUpdateScreen">;

const ScrumUpdateScreen: React.FC = () => {
 const navigation = useNavigation<ScrumUpdateScreenProp>();
 interface Option {
    label: string;
    value: string;
  }
  const axios = useAxios();
  const auth = useAuth();
  const employeeId = auth.loginData.employeeId;
 const [ScrumOptions, setScrumQuestions] = useState<Option[]>([]);
 const [ScrumTypeValue, setScrumTypeValue] = useState('');
 const [scrumresponse,setScrumResponse] = React.useState<QuestionPaperQuestion[]>([]);
 const [Initialscrumresponse,setInitialScrumResponse] = React.useState<QuestionPaperQuestion[]>([]);
 const [answerw, setAnswerw] = useState([]);
    const handleBackPress = () => {
        navigation.goBack();
    };
    const handleLeaveTypeSelect = (text: string) => {
        setScrumTypeValue(text);
       // console.log(ScrumTypeValue)
    };
    useEffect(() => {
        OnchangeDropDown()
      }, [ScrumTypeValue]); 
      const handleAnswerChange = (questionPaperId:any,questionid:any,answer:any) => {
        const existingAnswerIndex = answerw.findIndex(answer => answer.questionid === questionid);
        if (existingAnswerIndex !== -1) {
            const updatedAnswerw = [...answerw];
            updatedAnswerw[existingAnswerIndex].answer = answer;
            setAnswerw(updatedAnswerw);
        } else {
            setAnswerw(prevAnswerw => [
                ...prevAnswerw,
                {
                    questionid,
                    questionPaperId,
                    answer
                }
            ]);
        }
    }
    useEffect(() => {
        loadConnectionList();
    }, []);
    
    const loadConnectionList = async () => {
        debugger
        try {
          const response = await axios.publicAxios.get<QuestionPaperQuestion[]>("/app/Scrum/GetScrumQuestions");
          const leaveTypeSet = new Set<string>();
          response.data.forEach((item) => {
            debugger
                leaveTypeSet.add(item.questionPaper.name);
                setScrumResponse(response.data);
          });
          const ScrumOptions: Option[] = Array.from(leaveTypeSet).map((codeValue) => ({
            label: codeValue,
            value: codeValue,
          }));
          setScrumQuestions(ScrumOptions);
        } catch (error) {
          console.log(error.response?.data);
        }
      };
      const OnchangeDropDown = async () => {
        try {
            const questionId = scrumresponse.find(item => item.questionPaper.name === ScrumTypeValue)?.questionPaper.id;
          const response = await axios.publicAxios.get<QuestionPaperQuestion[]>("/app/Scrum/GetScrumQuestions?QuestionPaperId="+questionId);
          setInitialScrumResponse(response.data);
        } catch (error) {
          console.log(error.response?.data);
        }
      };
      const handleSubmit = () => {
        debugger
        // if (!isFormValid()) {
        //     return;
        //   }
      var content:Array<AppAnswer> = [] 
      answerw.map((answer)=>{
        const newQuestionPaper : AppAnswer ={
         employeeId:employeeId,
         questionPaperId:answer.questionPaperId,
         questionPaperQuestionID:answer.questionid,
         answerText:answer.answer,
         createdDate:new Date(),
         updatedDate:new Date(),
         createdBy:employeeId.toString(),
         updatedBy:employeeId.toString()
        }
        content.push(newQuestionPaper)
      })
        debugger;
        axios.publicAxios.post<boolean>("/app/Scrum/CreateScrumAnswers",content)
            .then((response) => {
                console.log(response.data);
                showMessage({
                    message: 'Scrum Answers Submitted Successfully!',
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
                <Text style={styles.headingText}>Scrum Details Screen</Text>
            </View>
            <View style={styles.bottomView}>
            <SafeAreaView>
           </SafeAreaView>
                <Text style={styles.titleText}>Scrum Details</Text>
                <ScrollView>
                    <View style={styles.inputContainer}>
                    <DropDown
                label="Choose the Role"
                placeholder="Select an option"
                data={ScrumOptions}
                value={ScrumTypeValue}
                disable={false}
                setValue={setScrumTypeValue}
                onChange={handleLeaveTypeSelect} open={false} setOpen={function (value: React.SetStateAction<boolean>): void {
                  throw new Error('Function not implemented.');
                } }                    />
            
        
   {Initialscrumresponse.map((qn) => {

if (qn.questionTypeName === "Descriptive") {
    //
    return (
        <POInputField
        label={qn.qText}
        placeholder={qn.qText}
        value={answerw.find(answer => answer.questionid === qn.id)?.answer || ""} 
        onChangeText={(text) => handleAnswerChange(qn.questionPaperId, qn.id, text)}
        secureTextEntry={false}
        keyboardType={"default"} NonEditablelabel={''}         
        ></POInputField>
    )
    
}
   })} 
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
export default ScrumUpdateScreen;