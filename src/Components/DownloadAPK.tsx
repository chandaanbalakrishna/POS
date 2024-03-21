import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, ToastAndroid, ActivityIndicator, View,Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system';
import { useAxios } from '../Contexts/Axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Props {
  SelectedAPK:string
}

const APKDownload: React.FC<Props> = ({ SelectedAPK}) => {
  
  
  // Function to download the APK file
  const pickDocuments = async () => {
    debugger
    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      return;
    }
   
   
    const base64Data = SelectedAPK; // Assuming setDocument is already the base64-encoded APK data
    let fileName = "something.apk"

    try {
     
      await StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, 'application/vnd.android.package-archive')
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
          ToastAndroid.showWithGravity(
            'APK File Downloaded Successfully',
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
      throw new Error();
    }

   // const mediaResult = await MediaLibrary.saveToLibraryAsync(fileName);
  }

  return (
    <>
      <View>
        <TouchableOpacity onPress={pickDocuments}>
          <Text >Download APK</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

// const styles = StyleSheet.create({
//   image: {
//     width: 40,
//     height: 50,
//   },
// });

const styles = StyleSheet.create({
  image: {
    width: wp('10%'), // Use responsive width
    height: hp('10%'), // Use responsive height
  },
});
export default APKDownload;