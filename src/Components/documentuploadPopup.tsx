import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, KeyboardAvoidingView, Vibration, ScrollView, FlatList, Alert, ToastAndroid, TextInput } from 'react-native';
import PODateTimePicker from './PODateTimePicker';
import POInputField from './POSInputField';
import POInputBoxField from './POInputBoxField';
import POButton from './POButton';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import DropDown from './DropDown';
import { CommonMaster } from '../Models/CommonMaster';
import { useAxios } from '../Contexts/Axios';
import DatePickerWeekEndingDate from './DatePickerWeekEndingDate';
import LottieAnimation from './Animation';
import FloatingButton from './FloatingButton';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { TaskClassification } from '../Models/TaskClassification';
import DocumenrtPicker from './DocumentPicker';
import UploadDocumentPicker from './DocumentPicker';
import { DocumentModel } from '../Models/DocumentModel';
import PoDocumentList from './PoDocumentList';
import * as FileSystem from 'expo-file-system';


import { StorageAccessFramework } from 'expo-file-system';

interface TaskDetailsPopupProps {
  isVisible: boolean;
  onClose: () => void;
  itemId: number;
  tableName: string;
  onSubmit: (TaskTypeValue: String, selectedDocument: File[]) => void;
}

const TaskDetailsPopup: React.FC<TaskDetailsPopupProps> = ({
  isVisible,
  onClose,
  onSubmit,
  itemId,
  tableName
}) => {
  const axios = useAxios();
  const [estStartDate, setEstStartDate] = useState('');
  const [estEndDate, setEstEndDate] = useState('');
  const [estTime, setEstTime] = useState('');
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');

  interface Option {
    label: string;
    value: string;
  }
  const [TaskTypeValue, setTaskTypeValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = React.useState<File[]>([]);
  const [selectedDocumentCount, setDocumentCount] = React.useState<any>(0);
  const [isDocumentPickerVisible, setDocumentPickerVisible] = useState(false);
  const [tasktypeerror, setTaskTypeError] = React.useState<string>("");
  const [documenterror, setdocumenterror] = React.useState<string>("");
  const [list, setList] = React.useState<DocumentModel[]>([]);
  const [originalList, setOriginalList] = React.useState<DocumentModel[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");

  const TaskTypeOptions = [
    { label: "Input", value: "Input" },
    { label: "Output", value: "Output" },
    { label: "Process", value: "Process" },
    { label: "Sample Code", value: "Sample Code" },

  ]


  const handleTaskTypeSelect = (text: string) => {
    setTaskTypeValue(text);
    setTaskTypeError('');
  };
  const openDocumentPicker = () => {
    setDocumentPickerVisible(true);
  };

  const handleClose = () => {
    onClose();
    setTaskTypeError('');
    setdocumenterror('');
    setTaskTypeValue('');
  };

  const handleSubmit = () => {
    if (TaskTypeValue.length === 0 && selectedDocument.length === 0) {
      setTaskTypeError("Please Select Document Type");
      setdocumenterror("Please Choose File");
      return;
    }

    if (TaskTypeValue.length === 0) {
      setTaskTypeError("Please Select Document Type");
      return;
    }

    if (selectedDocument.length === 0) {
      setdocumenterror("Please Choose File");
      return;
    }

    // If both conditions are met, submit the form
    onSubmit(TaskTypeValue, selectedDocument);
  };

  useEffect(() => {
    if (isVisible) {
      loadConnectionList();
    }
  }, [isVisible]);


  const loadConnectionList = async () => {
    debugger
    setLoading(true);
    setTimeout(() => {
      axios.privateAxios
        .get<DocumentModel[]>(`/app/Project/getdocumentlist?id=${itemId}&tableName=${tableName}`)
        .then((response) => {
          debugger
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

  

  const DownloadDocuments = async (Selected, fileName) => {
    debugger;
    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      console.log('Permission denied');
      return;
    }

    const base64Data = Selected;
    let filename = fileName;
    
    try {
      console.log('Creating file...');
      await StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, 'application/octet-stream')
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
          ToastAndroid.showWithGravity(
            'File Downloaded Successfully',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        })
        .catch((e) => {
          ToastAndroid.showWithGravity(
            'Download Failed',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        });
    } catch (e) {
      console.log('Error:', e);
      throw new Error();
    }
  };

  const handleDownload = async (itemId, fileName) => {
    debugger;
    setLoading(true);
    try {
      const response = await axios.privateAxios.get(`/app/Project/DownloadFile?id=${itemId}`, {
        responseType: 'blob', // Specify response type as blob
      });
      debugger;
      setLoading(false);

      if (response.data) {
        // Convert the file to base64
        const base64Data = await convertFileToBase64(response.data);
        const lastTwoDigits = new Date().getTime().toString().slice(-1); 
        const uniqueFileName = `${lastTwoDigits}_${fileName}`; 
        if (base64Data) {
          DownloadDocuments(base64Data, uniqueFileName);
        } else {
          console.log("Error converting file to base64");
        }
      } else {
        console.log("No file found");
      }
    } catch (error) {
      setLoading(false);
      console.log("Download error:", error);
    }
  };

  async function convertFileToBase64(file) {
    return new Promise(async (resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          // The result is a Data URL, so we need to extract the base64 portion.
          const dataUrl = reader.result.toString();
          const base64Data = dataUrl.split(",")[1]; // Get the base64 data
          resolve(base64Data);
        } else {
          reject("Error reading file");
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };

      try {
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  }


  const searchFunction = async (text: string) => {
    if (text) {
      const updatedData = originalList.filter((item) => {
        const Name = `${item.fileName.toUpperCase()}`;
        const Type = `${item.docType.toUpperCase()}`;
        const textData = text.toUpperCase();
        return (
          Name.indexOf(textData) > -1 ||
          Type.indexOf(textData) > -1
        );
      });
      setList(updatedData);
      setSearchValue(text);
    } else {
      setList(originalList);
      setSearchValue("");
    }
  };
  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior="height" style={styles.popupContainer}>
        <View style={styles.popupContent}>
          {loading && (
            <View style={styles.loadingContainer}>
              <LottieAnimation
                source={require('../../assets/icons/Loading.json')}
                autoPlay={true}
                loop={false}
                visible={loading}
              />
            </View>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <FontAwesome name="close" size={24} color="#999" />
          </TouchableOpacity>
          <Text style={styles.popupTitle}>Upload Document Details</Text>

          <ScrollView >
            <UploadDocumentPicker
              setDocument1={setSelectedDocument}
              setDocumentCount2={setDocumentCount}
            ></UploadDocumentPicker>
            {selectedDocument.length === 0 && <Text style={{ color: 'red' }}>{documenterror}</Text>}
            <View>
              {TaskTypeOptions.length != 0 ?
                <>
                  <DropDown
                    label="Document Type"
                    placeholder="Select an option"
                    data={TaskTypeOptions}
                    value={TaskTypeValue}
                    disable={false}
                    setValue={setTaskTypeValue}
                    onChange={handleTaskTypeSelect}
                  />
                  {TaskTypeValue.length === 0 && <Text style={{ color: 'red' }}>{tasktypeerror}</Text>}
                </> : ""}
            </View>
            <View style={styles.popupButtonContainer}>
              <FloatingButton
                title="Submit"
                variant='contained'
                onPress={handleSubmit}
                style={styles.popupButton}
                titleStyle={styles.popupButtonText}
                icon='arrow-right-bold-circle'
              />
            </View>
            <Text style={styles.Text}>Uploaded Documents</Text>
            <View style={styles.searchbar}>
              <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
              <TextInput placeholder="Search" style={styles.searchInput} value={searchvalue} onChangeText={(text) => searchFunction(text)} />
            </View>
            <View style={styles.list}>
              <FlatList 
               scrollEnabled={false}
                data={list}
                renderItem={({ item }) => (
                  <PoDocumentList
                    Name={item.fileName}
                    Type={item.docType}
                    onDownload={() => handleDownload(item.id, item.fileName)}
                  />
                )}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};


const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  list: {
    top: hp('2%')
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: wp('4.5%'),
  },
  searchInput: {
    color: "#BEBEBE",
    marginLeft: wp('2%'), // Adjust the margin left for smaller screens
    opacity: 0.5,
    fontSize: wp('5%'), // Adjust the font size for smaller screens
  },
  searchbar: {
    flexDirection: "row",
    backgroundColor: "#3A9EC2",
    alignItems: "center",
    width: wp('85%'),
    height: hp('5.5%'),
    borderRadius: wp('15%'),
    marginTop: wp('2%'),
    left: wp('0%'),
  },
  Text: {
    fontWeight: 'bold',
    fontSize: wp('4.5%'),
    left: wp('2%')
  },
  ProfileIcon: {
    width: wp('10%'),
    transform: [{ rotateY: '180deg' }]
  },
  popupContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('4%'),
    borderTopRightRadius: wp('4%'),
    padding: hp('3%'),
    paddingTop: hp('4%'),
    height: hp('85%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp('0.25%') },
    shadowOpacity: 0.25,
    shadowRadius: wp('1.5%'),
    elevation: 5,
  },
  loginButton: {
    backgroundColor: '#FFD700',
    height: hp('6.4%'),
    borderRadius: wp('2%'),
    margin: wp('24%'),
    left: -hp('10%')
  },
  popupTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    marginBottom: hp('1.5%'),
  },

  popupButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  popupButton: {
    backgroundColor: '#35A2C1',
    height: hp('6.5%'),
    borderRadius: wp('6.5%') / 2,
    alignItems: 'center',
    justifyContent: 'center',
    left: wp('5%'),
    marginBottom: hp('5%')
  },
  CancelpopupButton: {
    height: hp('6.5%'),
    borderRadius: wp('6.5%') / 2,
    alignItems: 'center',
    justifyContent: 'center',
    right: wp('5%'),
  },
  popupButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: wp('3.5%'),
  },
  CancelpopupButtonText: {
    color: '#35A2C1',
    fontWeight: 'bold',
    fontSize: wp('3.5%'),
  },
  errorText: {
    color: 'red',
    marginBottom: hp('1.5%'),
  },
  closeButton: {
    position: 'absolute',
    top: hp('1%'),
    right: wp('1%'),
    zIndex: 999,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
export default TaskDetailsPopup;
