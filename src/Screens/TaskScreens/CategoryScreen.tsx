import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import POButton from '../../Components/POButton';
import PODropDown from '../../Components/PODropDown';
import { useAxios } from '../../Contexts/Axios';
import { Category } from '../../Models/CategoryModel';
import { Task } from '../../Models/Task';
import { useAuth } from '../../Contexts/Auth';
import CategoryPopup from '../../Components/CategoryPopup';
import { Status } from '../../Constants/Status';
import ProgressTrackerCard from '../../Components/ProgressTrackerCard';
import LottieAnimation from '../../Components/Animation';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { EmployeeDailyTask } from '../../Models/EmployeeDailyTask';
import { TaskModel } from '../../Models/TaskModel';
import { DayPlanModel } from '../../Models/DayPlanModel';

type CategoryScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "Category">;
type CategoryProp = RouteProp<EmployeeStackParamList, "UIList">;
type Categoryprops  = RouteProp<EmployeeStackParamList, "Category">;

const CategoryScreen: React.FC = () => {
  const navigation = useNavigation<CategoryScreenProp>();
  const route1 = useRoute<Categoryprops>();
  const route = useRoute<CategoryProp>();
  const axios = useAxios();
  const auth = useAuth();

  const [loading, setLoading] = React.useState(false);
  const [selectedCategoryValue, setSelectedCategoryValue] = useState('');
  const [selectedSubCategoryValue, setSelectedSubCategoryValue] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [projectid] = React.useState(route.params?.ProjectId);
  const [userStoryId] = React.useState(route1.params?.UserStoryId);
  const [userStoryName] = React.useState(route1.params?.UserStoryName);
  const [Description] = React.useState(route1.params?.Description);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<string[]>([]);
  const [selectedSubcategoryOptions, setSelectedSubcategoryOptions] = useState<string[]>([]);
  const [applicableList, setApplicableLists] = useState<string[]>([]);
  const [Name] = React.useState<string>(route.params.Name);
  const employeeId = auth.loginData.employeeId;
  const [dropdown1Open, setDropdown1Open] = useState(false);
  const [dropdown2Open, setDropdown2Open] = useState(false);


  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCategorySelect = (value: string) => {
    const subCategoryOptions = subcategoryOptions.filter((item) => item.value.startsWith(value));
    setSelectedCategoryValue(value);
    setSelectedSubcategoryOptions(subCategoryOptions);
  };

  const handleSubCategorySelect = (value: string) => {

    setSelectedSubCategoryValue(value);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const handleSubmit = (estStartDate: Date, estTime: string, comments: string, estEndDate: Date, name: string, description: string, taskType: string, classification: string, weekEndDate: Date, TaskDescription: string,Priority:string,assignTaskForMyself:boolean,addDayPlan:boolean) => {

    const newCreateTask: Task = {
      employeeId: employeeId,
      userStoryUIId: undefined,
      projectId: projectid,
      categoryId: CategoryId(),
      uIId: 0,
      userStoryId: 0,
      name: name,
      estTime: parseInt(estTime),
      description: description,
      status: Status.UnAssigned,
      percentage: 0,
      actTime: 0,
      startDate: undefined,
      endDate: undefined,
      weekEndingDate: weekEndDate,
      priority: Priority,
      Comment: comments,
      EstimateStartDate: estStartDate,
      EstimateEndDate: estEndDate,
      taskType: taskType,
      classification: classification,
      taskDescription: TaskDescription,
      createdBy:'',
      updatedBy:''
    }
    if(assignTaskForMyself === false && addDayPlan === false){
    axios.privateAxios
      .post<string>("/app/Task/CreateTask", newCreateTask)

      .then((response) => {
        console.log(response.data)
        showMessage({
          message: 'Task Created Successfully!',
          type: 'success',
          duration: 3000,
          floating: true,
          icon: () => (
            <Ionicons name="checkmark-circle-outline" size={20} />
          ),
        });
        navigation.navigate("Home")
      })
      .catch((error) => {
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
      });
    }else if(assignTaskForMyself === true && addDayPlan === false){
      axios.privateAxios
        .post<TaskModel>("/app/Task/CreateTask", newCreateTask)
        .then((response) => {
            console.log(response.data) 
            const AssignRequest: DayPlanModel = {
              employeeId: employeeId,
              taskId: response.data.id,
              projectId: projectid,
              name: name,
              description: TaskDescription,
              startDate: estStartDate,
              endDate: estEndDate,
              estTime: parseInt(estTime),
              actTime: 0,
              weekEndingDate: weekEndDate,
              status: Status.InProgress,
              priority: Priority,
              percentage: 0,
              estStartDate: estStartDate,
              estEndDate: estEndDate,
              Comment: comments,
              createdBy: employeeId.toString()
          };
          axios.privateAxios
          .post<DayPlanModel>("/app/EmployeeTask/AssignEmployeeTask", AssignRequest)
          .then((response) => {
              console.log(response.data) 
            showMessage({
                message: 'Task Created and assigned Successfully!',
                type: 'success',
                duration: 3000,
                floating: true,
                icon: () => (
                    <Ionicons name="checkmark-circle-outline" size={20} />
                ),
            });
            navigation.navigate("Home")
        })
      })
        .catch((error) => {
            console.log(error.response.data)
            showMessage({
                message: 'error occured',
                type: 'danger',
                duration: 3000,
                floating: true,
                icon: () => (
                    <Ionicons name="alert-circle-outline" size={20} />
                ),
            });
        });
    }
    else{
      debugger
      axios.privateAxios
        .post<TaskModel>("/app/Task/CreateTask", newCreateTask)
        .then((response) => {
          debugger
            console.log(response.data) 
            const AssignRequest: DayPlanModel = {
              employeeId: employeeId,
              taskId: response.data.id,
              projectId: projectid,
              name: name,
              description: TaskDescription,
              startDate: estStartDate,
              endDate: estEndDate,
              estTime: parseInt(estTime),
              actTime: 0,
              weekEndingDate: weekEndDate,
              status: Status.InProgress,
              priority: Priority,
              percentage: 0,
              estStartDate: estStartDate,
              estEndDate: estEndDate,
              Comment: comments,
              createdBy: employeeId.toString()
          };
          axios.privateAxios
          .post<DayPlanModel>("/app/EmployeeTask/AssignEmployeeTask", AssignRequest)
          .then((response) => {
            debugger
              console.log(response.data) 
              const DayPlanRequest: EmployeeDailyTask = {
                employeeId: employeeId,
                taskId: response.data.taskId,
                employeeTaskId: response.data.id,
                projectObjectiveId: 1,
                projectId: projectid,
                name: name,
                employeeName : "",
                projectName: "",
                comment : "",
                status:"In-Progress",
                description: TaskDescription,
                estTime: Number(estTime),
                weekEndingDate: undefined,
                priority: Priority,
                workedOn:estStartDate
            };
            axios.privateAxios
            .post<EmployeeDailyTask>("/app/EmployeeDailyTask/AddEmployeeDayPlan", DayPlanRequest)
            .then((response) => {
              console.log(response.data) 
            showMessage({
              message: 'Task assigned && Day Plan Added Successfully!',
                type: 'success',
                duration: 3000,
                floating: true,
                icon: () => (
                    <Ionicons name="checkmark-circle-outline" size={20} />
                ),
            });
            navigation.navigate("Home")
        })
      })
        .catch((error) => {
            console.log(error.response.data)
            showMessage({
                message: 'error occured',
                type: 'danger',
                duration: 3000,
                floating: true,
                icon: () => (
                    <Ionicons name="alert-circle-outline" size={20} />
                ),
            });
        });
      });
    }
  };


  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.privateAxios.get<Category[]>("/app/Common/GetCategoriesList");
      const categorySet = new Set();
      response.data.forEach((item) => {
        categorySet.add(item.categories);
      });
      const categories = Array.from(categorySet).map((category) => ({
        label: category,
        value: category,
      }));
      const subcategories = response.data.map((item) => ({
        label: item.subCategory,
        value: `${item.categories}_${item.subCategory}`,
      }));
      const applicableList = response.data.map((item) => ({
        label: item.subCategory,
        value1: item.uiApplicable,
        value2: item.userStoryApplicable,
        value3: item.id,
      }));
      setLoading(false);
      setCategoryOptions(categories);
      setSubcategoryOptions(subcategories);
      setApplicableLists(applicableList);
      console.log(applicableList)
    } catch (error) {
      setLoading(false);
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const isUIApplicable = (): boolean => {
    debugger
    const selectedSubcategory = selectedSubCategoryValue;
    const trimmedString = selectedSubcategory.split('_')[1];
    const applicable = applicableList.find(
      (item) => item.label === trimmedString
    );

    return applicable?.value1 || false;
  };

  const isUSApplicable = (): boolean => {
    const selectedSubcategory = selectedSubCategoryValue;
    const trimmedString = selectedSubcategory.split('_')[1];
    const applicable = applicableList.find(
      (item) => item.label === trimmedString
    );

    return applicable?.value2 || false;
  };

  const subCategory = selectedSubCategoryValue.split('_')[1];

  const CategoryId = () => {
    debugger
    const selectedSubcategory = selectedSubCategoryValue;
    const trimmedString = selectedSubcategory.split('_')[1];
    const applicable = applicableList.find(
      (item) => item.label === trimmedString
    );

    const categoryId = applicable ? applicable.value3 : null;
    return categoryId;
  };

  const renderButton = () => {
    debugger
    if (isUSApplicable() && isUIApplicable()) {
      return (
        <POButton
          title="Continue To User Interface"
          onPress={ContinueTask}
          style={styles.loginButton}
          titleStyle={styles.buttonText}
        />
      );
    } 
    else if(isUSApplicable() && !isUIApplicable()){
      return (
        <POButton
          title="Continue To Create Task"
          onPress={ContinueTask}
          style={styles.loginButton}
          titleStyle={styles.buttonText}
        />
      );
    }
    else if (selectedCategoryValue && selectedSubCategoryValue) {
      return (
        <POButton
          title="Create Task"
          onPress={CreateTask}
          style={styles.loginButton}
          titleStyle={styles.buttonText}
        />
      );
    } 
    else if(isUIApplicable && !isUSApplicable){
      return (
        <POButton
          title="Create Task"
          onPress={CreateTask}
          style={styles.loginButton}
          titleStyle={styles.buttonText}
        />
      );
    }
    else {
      return (
        <POButton
          title="Create Task"
          onPress={CreateTask}
          style={[styles.loginButton]}
          titleStyle={styles.buttonText}
          disabled
        />
      );
    }
  };



  const CreateTask = () => {
    setIsPopupVisible(true);
  };

  const ContinueTask = () => {
    debugger
    if (isUIApplicable()) {
      debugger
      //navigation.navigate("USList", { ProjectId: projectid, Name: Name, CategoryIds: CategoryId(), isUIApplicable: isUIApplicable(), CategoryName: selectedCategoryValue, subCategoryName: subCategory });
      navigation.navigate("UIList", { ProjectId: projectid, Name: Name, CategoryIds:CategoryId(),UserStoryId:userStoryId,USName:userStoryName,CategoryName:selectedCategoryValue,subCategoryName:subCategory});
    }
    else {
      navigation.navigate("Assign", {
        userStoryId:userStoryId,
        projectId: projectid,
        CategoryIds:CategoryId(),
        USName: userStoryName,
        Description: Description,
        Name:Name,
        CategoryName:selectedCategoryValue,
        subCategoryName:subCategory
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlashMessage position="top" style ={{height:60,marginTop:40}} textStyle ={{marginTop:10,fontSize:18}}/>
      <View style={styles.topView}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={30} color="#fff" style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.welcomeMessage}>Category</Text>
      </View>
      <View style={styles.bottomView}>
        <SafeAreaView>
          <ProgressTrackerCard selectedCategory={selectedCategoryValue} selectedSubCategory={subCategory}></ProgressTrackerCard>

        </SafeAreaView>

        <Text style={styles.title}>Select Your Category</Text>
        {loading && (
          <LottieAnimation
            source={require('../../../assets/icons/Loading.json')}
            autoPlay={true}
            loop={true}
            visible={loading}
          />
        )}
         <ScrollView nestedScrollEnabled={!dropdown1Open && !dropdown2Open}>
        <PODropDown
          title="Category"
          placeholder="Select an option"
          data={categoryOptions}
          value={selectedCategoryValue}
          disable={false}
          setValue={setSelectedCategoryValue}
          onChange={handleCategorySelect}
          open={dropdown2Open}
          setOpen={setDropdown2Open}
        />
        <PODropDown
          title="Sub-Category"
          placeholder="Select an option"
          data={selectedSubcategoryOptions}
          value={selectedSubCategoryValue}
          disable={!selectedCategoryValue}
          setValue={setSelectedSubCategoryValue}
          onChange={handleSubCategorySelect}
          open={dropdown2Open}
          setOpen={setDropdown2Open}
        />
         <View>
          {renderButton()}
        </View>
       
        <CategoryPopup
        isVisible={isPopupVisible}
        onClose={handleClosePopup}
        onSubmit={handleSubmit}
        categoryId={CategoryId()}
      />
     </ScrollView>
      </View>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#3A9EC2',
//   },
//   topView: {
//     marginTop: 20,
//     marginHorizontal: 24,
//     backgroundColor: '#3A9EC2',
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   welcomeMessage: {
//     color: '#fff',
//     fontSize: 30,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     bottom: 15,
//   },
//   bottomView: {
//     flex: 6,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 50,
//     borderTopRightRadius: 50,
//   },
//   title: {
//     marginHorizontal: 26,
//     marginVertical: 16,
//     fontWeight: 'bold',
//     fontSize: 20,
//   },
//   backButton: {
//     position: 'absolute',
//     left: 0,
//     bottom: 25,
//   },
//   popupContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   popupContent: {
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 50,
//     marginHorizontal: 20,
//     alignSelf: 'stretch',
//     height: 500,
//     width: '90%',
//   },
//   popupTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 8,
//     marginBottom: 10,
//   },
//   textarea: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 8,
//     height: 100,
//     marginBottom: 10,
//   },
//   popupButtonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   popupButton: {
//     backgroundColor: '#35A2C1',
//     height: 50,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//     marginRight: 10,
//   },
//   popupButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   loginButton: {
//     backgroundColor: '#35A2C1',
//     height: 50,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     top: 20,
//     margin: 20,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   heading: {
//     fontWeight: 'bold',
//     fontSize: 20,
//     marginLeft: 20,
//     marginTop: 10,
//   },
//   errorText: {
//     color: 'red',
//     marginTop: 5,
//   },
//   animation: {
//     position: 'absolute',
//     width: '140%',
//     height: '140%',
//   },

// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A9EC2',
  },
  topView: {
    marginTop: hp('3%'),
    marginHorizontal: wp('5%'),
    backgroundColor: '#3A9EC2',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  welcomeMessage: {
    color: '#fff',
    fontSize: hp('3.7%'),
    fontWeight: 'bold',
    textAlign: 'center',
    bottom: hp('-0.5%'),
  },
  bottomView: {
    flex: 6,
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('10%'),
    borderTopRightRadius: wp('10%'),
   
  },
  title: {
    marginHorizontal: wp('8%'),
    marginVertical: hp('1%'),
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
  },
  backButton: {
    position: 'absolute',
    left: wp('2%'),
    bottom: hp('2%'),
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContent: {
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    padding: wp('10%'),
    marginHorizontal: wp('4%'),
    alignSelf: 'stretch',
    height: hp('40%'),
    width: wp('90%'),
  },
  popupTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp('2%'),
    padding: wp('2%'),
    marginBottom: hp('1%'),
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp('2%'),
    padding: wp('2%'),
    height: hp('10%'),
    marginBottom: hp('1%'),
  },
  popupButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  popupButton: {
    backgroundColor: '#35A2C1',
    height: hp('7%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: wp('2%'),
  },
  popupButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: hp('2%'),
  },
  loginButton: {
    backgroundColor: '#35A2C1',
    height: hp('6%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    top: -hp('1%'),
    margin: wp('5%'),
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: hp('2.3%'),
  },
  heading: {
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
    marginLeft: wp('5%'),
    marginTop: hp('1%'),
  },
  errorText: {
    color: 'red',
    marginTop: hp('0.5%'),
  },
  animation: {
    position: 'absolute',
    width: '140%',
    height: '140%',
  },
});

export default CategoryScreen;
