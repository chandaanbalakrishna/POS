import React from 'react';
import { View, StyleSheet, Text ,TextInput,FlatList, TouchableOpacity,Modal, KeyboardAvoidingView,SafeAreaView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAxios } from '../../Contexts/Axios';
import POProjectListItem from '../../Components/POProjectListItem';
import { UserInterface } from '../../Models/UserInterfaceModel';
import TaskDetailsPopup from '../../Components/CreateTaskPopup';
import { useAuth } from '../../Contexts/Auth';
import { Task } from '../../Models/Task';
import { Status } from '../../Constants/Status';
import ProgressTrackerCard from '../../Components/ProgressTrackerCard';
import LottieAnimation from '../../Components/Animation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import POButton from '../../Components/POButton';
import DocumentuploadPopup from '../../Components/documentuploadPopup';
import { showMessage } from 'react-native-flash-message';
import POProjectList from '../../Components/POProjectList';

type UIListScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "UIList">;
type UIListProp = RouteProp<EmployeeStackParamList, "UIList">;


const UIlistScreen: React.FC = () => {
const axios = useAxios();
const auth = useAuth();
const [loading, setLoading] = React.useState(false);
const [list, setList] = React.useState<UserInterface[]>([]);
  const navigation = useNavigation<UIListScreenProp>();
  const route = useRoute<UIListProp>();
  const [projectId] = React.useState(route.params.ProjectId)
  //const [isUSApplicable] = React.useState(route.params.isUSApplicable);
  const [isPopupVisible, setIsPopupVisible] = React.useState(false);
  const [Name] = React.useState<string>(route.params.Name);
  const [categoryId] = React.useState(route.params.CategoryIds);
  const [UserName, setUserName] = React.useState<string>("");
  const [description, setDesciption] = React.useState<string>("");
  const employeeId = auth.loginData.employeeId;
  const [estTime, setEstTime] = React.useState('');
  const [error,setError]=React.useState<string>();
  const [status, setStatus] = React.useState<string>('Pending');
  const [UIId, setUIId] = React.useState<number>(0);
  const [UserStoryId] = React.useState<number>(route.params.UserStoryId);
  const [CategoryName] = React.useState<string>(route.params.CategoryName);
  const [SubCategoryName] = React.useState<string>(route.params.subCategoryName);
  const [USName] = React.useState<string>(route.params.USName);
  const [originalList, setOriginalList] = React.useState<UserInterface[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");



  const handlePress = async (uIId: number, data: UserInterface) => {
    if(Name == "upload"){
      return false;
    }
    else{
      navigation.navigate("UICreateTask", {
        userInterfaceId: uIId,
        projectId: projectId,
        CategoryIds: categoryId,
        UIName: data.name,
        Description: data.description,
        UserStoryId:UserStoryId,
        CategoryName:CategoryName,
        subCategoryName:SubCategoryName,
        Name:Name,
        USName:USName,
      });
    setUIId(uIId);
  };
    }
      
    const uploadDocument = (itemId) => {
      setIsPopupVisible(true);
      setUIId(itemId);
    };

    const handleClosePopup = () => {
      setIsPopupVisible(false);
    };

  const handleBackPress = () => {
    navigation.goBack();
  };
  const searchFunction = async (text: string) => {
    if (text) {
      const updatedData = originalList.filter((item) => {
        const Name = `${item.name.toUpperCase()}`;
        const Type = `${item.status}`;
        const Description = `${item.description}`;
        const textData = text.toUpperCase();
        return (
          Name.indexOf(textData) > -1 ||
          Type.indexOf(textData) > -1 ||
          Description.indexOf(text) > -1
        );
      });
      setList(updatedData);
      setSearchValue(text);
    } else {
      setList(originalList);
      setSearchValue("");
    }
  };

  const loadConnectionList = async () => {
    debugger
    setLoading(true);
    setTimeout(() => {
    axios.privateAxios
      .get<UserInterface[]>("/app/Task/GetUserInterfacelist?UserStoryId="+ UserStoryId )
      .then((response) => {
        setLoading(false);
        setList(response.data);
        setOriginalList(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response.data);
      });
    }, 1000);
  };

  const isFormValid = () => {
    debugger
    if (
        (estTime === null || estTime === undefined)          
    ) {
        setError("Estimation Required");
      return false;
    }
    return true;
  };
  const handleSubmit = (estStartDate: Date, estTime: string, comments: string , estEndDate:Date) => {
    setLoading(true);
    if (!isFormValid()) {
        return;
      }
      const newCreateTask : Task ={
        employeeId:employeeId,
        userStoryUIId: undefined,
        projectId: projectId,
        categoryId: categoryId,
        uIId:UIId,
        userStoryId:undefined,
        name: UserName,
        estTime: parseInt(estTime),
        description: description,
        status: status,
        percentage: 0,
        actTime: 0,
        startDate: undefined,
        endDate: undefined,
        weekEndingDate: undefined,
        priority: '',
        Comment:comments,
        EstimateStartDate:estStartDate,
        EstimateEndDate:estEndDate,
    }
axios.privateAxios.post<string>("/app/Task/CreateTask",newCreateTask )
  .then((response) => {
    console.log(response.data)
    setLoading(false);
    navigation.navigate("Home")
  })
  .catch((error) => {
    setLoading(false);
    console.log(error.response.data)
  });
};

  React.useEffect(() => {
    debugger
    loadConnectionList();
  }, []);


  const submit = async (TaskTypeValue: string, selectedDocument: File[]) => {
    debugger;
    setLoading(true);
  
    for (const file of selectedDocument) {
      await document(file, TaskTypeValue,UIId);
    }
 
    setLoading(false);
    debugger
    showMessage({
      message: 'Document Uploaded Successfully!',
      type: 'success',
      duration: 3000,
      floating: true,
      icon: () => (
          <Ionicons name="checkmark-circle-outline" size={20} />
      ),
  });
  navigation.navigate("Home");
  };
  
  const document = async (file: File, TaskTypeValue: string,UIId:number) => {
    debugger
    try {
      const formData = new FormData();
      let filename = file.name;
      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `application/${match[1]}` : `application`;
      let imageToUpload = {
        type: type,
        name: filename,
        uri: file.path,
      };
  
      formData.append("DocType", TaskTypeValue);
      formData.append("ProjectId", projectId.toString());
      formData.append("File", imageToUpload);
      formData.append("FileName", filename);
      formData.append("FileType", type);
      formData.append("AttributeId", UIId.toString());
      formData.append("TableName", "UserInterface");
      formData.append("IsActive", "true");
      formData.append("CreatedBy", "user");
      formData.append("UpdatedBy", "user");
  
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
  
      const response = await axios.privateAxios.post<string>(
        "/app/Project/UploadFiles",
        formData,
        config
      );
    debugger
    handleClosePopup()
    } catch (error) {
      console.log(error.response.data);
      // Handle the error here if needed
    }
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
        
        <Text style={styles.headingText}>UI List</Text>
      </View>
      <View style={styles.searchbar}>
            <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
            <TextInput placeholder="Search" style={styles.searchInput} value={searchvalue} onChangeText={(text) => searchFunction(text)} />
          </View>
      <View style={styles.bottomView}>
      <SafeAreaView style={styles.progress}>
      {Name != "upload"?(
       <ProgressTrackerCard></ProgressTrackerCard>
      ):("")
    }
     
      
  </SafeAreaView>
        <Text style={styles.titleText}>Choose UI Screens</Text>
        {loading && (
                    <LottieAnimation
                        source={require('../../../assets/icons/Loading.json')}
                        autoPlay={true}
                        loop={true}
                        visible={loading}
                    />
                )}

     {Name == "upload"?( 
      <FlatList
  data={list}
  renderItem={({ item }) => (
    <POProjectListItem
      Name={item.name}
      Type={item.status}
      Description={item.description}
      percentage={item.percentage}
      onPress={() => handlePress(item.id, item)}
      onUploadDocument={() => uploadDocument(item.id)}
      itemId={item.id} 
    />
  )}
/>  ):(
  <FlatList
  data={list}
  renderItem={({ item }) => (
    <POProjectList
      Name={item.name}
      Type={item.status}
      Description={item.description}
      percentage={item.percentage}
      onPress={() => handlePress(item.id, item)}
    />
  )}
/>


)}

        
        {/* <TaskDetailsPopup
          isVisible={isPopupVisible}
          onClose={handleClosePopup}
          onSubmit={handleSubmit}
        /> */}
       
      </View>
      
      <DocumentuploadPopup
        isVisible={isPopupVisible}
        onClose={handleClosePopup}
        onSubmit={submit}
        itemId={UIId}
        tableName={'UserInterface'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A9EC2',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: wp('4.5%'),
  },
  loginButton: {
    backgroundColor: '#35A2C1',
    height: hp('6.5%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    margin: wp('23%'),
    marginBottom:hp('4%')
  },
  topView: {
    marginTop: hp('2%'),
    marginHorizontal: wp('5%'),
    backgroundColor: '#3A9EC2',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headingText: {
    marginRight: wp('15%'),
    top: hp('1%'),
    textAlign: 'center',
    fontSize: hp('3.8%'),
    color: '#fff',
    fontWeight: 'bold',
  },
  progress:{
    top: hp('1%'),
  },
  bottomView: {
    flex: 6,
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('12%'),
    marginTop: hp('2.5%'),
    borderTopRightRadius: wp('12%'),
    paddingBottom: hp('5%'),
  },
  titleText: {
    marginHorizontal: wp('10%'),
    marginVertical: hp('2.5%'),
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
  },
  searchbar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    width: wp('93%'),
    height: hp('6%'),
    borderRadius: wp('15%'),
    marginBottom: hp('3.5%'),
    left: wp('3.5%'),
  },
  circle: {
    borderRadius: wp('12.5%'),
    height: hp('7%'),
    width: hp('7%'),
    backgroundColor: "#fff"
  },
  ProfileIcon: {
    width: wp('10%'),
    transform: [{ rotateY: '180deg' }]
  },
  searchInput: {
    color: "#BEBEBE",
    marginLeft: wp('2%'), // Adjust the margin left for smaller screens
    opacity: 0.5,
    fontSize: wp('5%'), // Adjust the font size for smaller screens
},
  customCardContainer: {
    backgroundColor: 'gray',
    marginHorizontal: wp('5%'),
    marginTop: hp('-5%'),
    padding: wp('8%'),
    borderRadius: wp('2.5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    left: -wp('7.5%'),
    top: hp('0.6%'),
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContent: {
    backgroundColor: '#fff',
    borderRadius: wp('5%'),
    padding: hp('5%'),
    marginHorizontal: wp('5%'),
    alignSelf: 'stretch',
    height: hp('70%'),
    width: wp('90%'),
  },
  popupTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    marginBottom: hp('2.5%'),
  },
  popupButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  popupButton: {
    backgroundColor: '#35A2C1',
    height: hp('7%'),
    borderRadius: wp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: wp('2.5%'),
  },
  popupButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: hp('2%'),
  },
  heading: {
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
    marginLeft: wp('5%'),
    marginTop: hp('2.5%'),
  },
  animation: {
    position: 'absolute',
    width: '140%',
    height: '140%',
  },
});
export default UIlistScreen;
