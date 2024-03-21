import React from 'react';
import { View, StyleSheet, Text ,TextInput,FlatList, TouchableOpacity,Modal, KeyboardAvoidingView ,SafeAreaView} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAxios } from '../../Contexts/Axios';
import POProjectListItem from '../../Components/POProjectListItem';
import { UserStory } from '../../Models/UserStoryModel';
import ProgressTrackerCard from '../../Components/ProgressTrackerCard';
import LottieAnimation from '../../Components/Animation';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import POProjectList from '../../Components/POProjectList';
import DocumentuploadPopup from '../../Components/documentuploadPopup';

type USListScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "USList">;
type UsListProp = RouteProp<EmployeeStackParamList, "USList">;
const USlistScreen: React.FC = () => {
  const axios = useAxios();
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<UserStory[]>([]);
  const navigation = useNavigation<USListScreenProp>();
  const route = useRoute<UsListProp>();
  const [projectId] = React.useState(route.params.ProjectId);
  const [Name] = React.useState<string>(route.params.Name);
  const [CategoryId] = React.useState<number>(route.params.CategoryIds);
  const [isUIApplicable] = React.useState<boolean>(route.params.isUIApplicable);
  const [CategoryName] = React.useState<string>(route.params.CategoryName);
  const [SubCategoryName] = React.useState<string>(route.params.subCategoryName);
  const [originalList, setOriginalList] = React.useState<UserStory[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");
  const [isPopupVisible, setIsPopupVisible] = React.useState(false);
  const [USId, setUSId] = React.useState<number>(0);



  const onSelect = async (data: UserStory) => {
    debugger
    if(Name == "upload"){
      navigation.navigate("UIList", { ProjectId: projectId, Name: Name, CategoryIds:CategoryId,UserStoryId:data.id,USName:data.name,CategoryName:CategoryName,subCategoryName:SubCategoryName  });
    }
    else{
      navigation.navigate("Category",{ProjectId:projectId,Name:Name,UserStoryId:data.id,UserStoryName:data.name,Description:data.description})
    }

    // else if (isUIApplicable == true) {
    //   navigation.navigate("UIList", { ProjectId: projectId, Name: Name, CategoryIds:CategoryId,UserStoryId:data.id,USName:data.name,CategoryName:CategoryName,subCategoryName:SubCategoryName  });
    // } 
    // else {
    //   navigation.navigate("Assign", {
    //     userStoryId:data.id,
    //     projectId: projectId,
    //     CategoryIds: CategoryId,
    //     USName: data.name,
    //     Description: data.description,
    //     Name:Name,
    //     CategoryName:CategoryName,
    //     subCategoryName:SubCategoryName
    //   });
    // }
    //navigation.navigate("Assign", { userStoryId: data.id,projectId:data.projectId,USName:data.name,Description:data.description,CategoryIds:CategoryId});

}

const uploadDocument = (itemId:number) => {
  setIsPopupVisible(true);
  setUSId(itemId);
};

const handleClosePopup = () => {
  setIsPopupVisible(false);
};

  const handleBackPress = () => {
    navigation.goBack();
  };

  const loadConnectionList = async () => {
    setLoading(true);
    setTimeout(() => {
    axios.privateAxios
      .get<UserStory[]>("/app/Task/GetProjectUSlist?ProjectId="+ projectId)
      .then((response) => {
        setLoading(false);
        setList(response.data);
        setOriginalList(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response.data);
      });
    },1000);
  };

  React.useEffect(() => {
    loadConnectionList();
  }, []);
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

  const submit = async (TaskTypeValue: string, selectedDocument: File[]) => {
    debugger;
    setLoading(true);
  
    for (const file of selectedDocument) {
      await document(file, TaskTypeValue,USId);
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
  
  const document = async (file: File, TaskTypeValue: string,USId:number) => {
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
      formData.append("AttributeId", USId.toString());
      formData.append("TableName", "UserStory");
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
    handleClosePopup()
    } catch (error) {
      console.log(error.response.data);
      // Handle the error here if needed
    }
  };


  return (
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
        
        <Text style={styles.headingText}>User Story List</Text>
      </View>
      <View style={styles.searchbar}>
            <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
            <TextInput placeholder="Search" style={styles.searchInput} value={searchvalue}  onChangeText={(text) => searchFunction(text)}/>
          </View>
      <View style={styles.bottomView}>
      <SafeAreaView>
    
      {Name != "upload"?(
        <ProgressTrackerCard ></ProgressTrackerCard>
      ):("")
    }
   
      
  </SafeAreaView>
        <Text style={styles.titleText}>Choose Your UserStory ({list.length})</Text>
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
      onPress={() => onSelect(item)}
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
      onPress={() => onSelect(item)}
    />
  )}
/>


)}


      </View>
      <DocumentuploadPopup
        isVisible={isPopupVisible}
        onClose={handleClosePopup}
        onSubmit={submit}
        itemId={USId}
        tableName={'UserStory'}
      />
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#3A9EC2',
//   },
//   topView: {
//     marginTop: 30,
//     marginHorizontal: 24,
//     backgroundColor: '#3A9EC2',
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   headingText: {
//     marginRight:50,
//     top: 10,
//     textAlign: 'center',
//     fontSize: 30,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   bottomView: {
//     flex:5,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 50,
//     marginTop: 20,
//     borderTopRightRadius: 50,
//     paddingBottom:80,
//   },
//   titleText: {
//     marginHorizontal: 26,
//     marginVertical: 20,
//     fontWeight: 'bold',
//     fontSize: 20,
//   },
//   searchbar: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     alignItems: "center",
//     width: "95%",
//     height: 50,
//     borderRadius: 30,
//     marginBottom: 25,
//     //bottom:50,
//     left:10
//   },
//   circle: {
//     borderRadius: 25,
//     height: 50,
//     width: 50,
//     backgroundColor: "#fff"
//   },
//   ProfileIcon: {
//     width: 40,
//     transform: [{ rotateY: '180deg' }]
//   },
//   searchInput: {
//     color: "#BEBEBE",
//     marginLeft: 15,
//     opacity: 0.5,
//     fontSize: 20
//   },
//   customCardContainer: {
//     backgroundColor: 'gray',
//     marginHorizontal: 24,
//     marginTop: -40,
//     padding: 30,
//     borderRadius: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   backButton: {
//     left:-8,
//     top:6,
// },
// heading: {
//   fontWeight: 'bold',
//   fontSize: 20,
//   marginLeft:20,
//   marginTop:10,
// },
// animation: {
//   position: 'absolute',
//   width: '140%',
//   height: '140%',
// },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A9EC2',
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
    marginRight: wp('10%'),
    top: hp('1%'),
    textAlign: 'center',
    fontSize: hp('3.5%'),
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomView: {
    flex: 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('12%'),
    marginTop: hp('2%'),
    borderTopRightRadius: wp('12%'),
    paddingBottom: hp('4%'),
  },
  titleText: {
    marginHorizontal: wp('12%'),
    marginVertical: hp('2.5%'),
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
    marginTop:hp('1%')
  },
  searchbar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    width: wp('94%'),
    height: hp('6%'),
    borderRadius: wp('15%'),
    marginBottom: hp('3%'),
    left: wp('3%'),
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
    left: -wp('4%'),
    top: hp('0.6%'),
  },
  heading: {
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
    marginLeft: wp('4%'),
    marginTop: hp('1%'),
  },
  animation: {
    position: 'absolute',
    width: '140%',
    height: '140%',
  },
});

export default USlistScreen;
