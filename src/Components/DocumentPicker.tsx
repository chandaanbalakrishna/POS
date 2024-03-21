import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Platform, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { File } from '../Models/request/File';
import POButton from './POButton';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface Props {
  setImages: any;
  setDocument1: any;
  documentName: any;
  setDocumentCount2: any;
}

const UploadDocumentPicker: React.FC<Props> = ({ setDocument1, setDocumentCount2 }) => {
  const [document, setDocument] = useState<File[]>([]);
  const [DocumentCount, setDocumentCount] = useState<number>(0);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: true,
      // type: 'application/pdf',
      // aspect: [4,3]
    });
    // alert(result.uri);
    // console.log(result);
    //if (!result) {
    // setDocument(result.uri);
    if (!result.canceled) {
      const newDocuments = Object.assign([], document);

      const documentr = await fetch(result.uri);
      const blob = await documentr.blob();
      let newDocument: File = {
        name: result.name,
        type: result.type!,
        path: result.uri,
        blob: blob,
        base64: '',
      };
      console.log(newDocument.name);
      newDocuments.push(newDocument);
      setDocument(newDocuments);
      setDocument1(newDocuments);
      setDocumentCount(DocumentCount + 1);
      setDocumentCount2(DocumentCount + 1);
      // setImages(result.uri);
    } else {
      alert('documentnotselected');
    }
  };
  const DeleteDocument = async (position: number) => {
    debugger;
    var image = document[position];

    // var readfilebefore = FileSystem.getInfoAsync(path);
    // console.log(readfilebefore);
    // var readfile = FileSystem.getInfoAsync(path);
    // console.log(readfile);
    const newImages = Object.assign([], document);
    delete newImages[position];
    setDocument(newImages);
    setDocument1(newImages);
    setDocumentCount(DocumentCount - 1);
    setDocumentCount2(DocumentCount - 1);
  };
  const onPressImage = (key) => async () => {
    debugger;
    if (Platform.OS === 'web') {
      alert('Delete File');
    } else {
      Alert.alert('Delete document', 'Are you sure you want to delete the document?', [
        { text: 'Yes', onPress: () => DeleteDocument(key) },
        { text: 'No', onPress: () => console.log('No Pressed') },
      ]);
    }
    return;
  };

  return (
    <View>
     <POButton title={'Choose File'} onPress={pickDocument} style={styles.loginButton} titleStyle={styles.buttonText} />
      {document.map((doc, index) => (
        <View style={styles.document}>
         <View style={styles.container} key={index}>
         <TouchableOpacity onPress={onPressImage(index)}>
        <Text style={{fontSize:hp('2%'),marginBottom:-hp('1%'),fontWeight:'bold'}} key={index}>{doc.name}</Text>
        </TouchableOpacity>
        </View>
        </View>
      ))}
      </View>
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  document: {
  top:-hp('8%'),
  marginTop:hp('2%'),
    
  },
  loginButton: {
    backgroundColor: '#808080',
    height: hp('6.4%'),
    borderRadius: wp('2%'),
    margin: wp('23%'),
    left: -hp('10%'),
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: wp('4.5%'),
  },
});

export default UploadDocumentPicker;
