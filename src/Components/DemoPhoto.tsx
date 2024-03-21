import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';


const DemoPhoto: React.FC = () => {
debugger;
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  console.log(imageBase64)
  useEffect(() => {
    convertImageToBase64();
  }, []);

  const convertImageToBase64 = async () => {
    try {
      const imageUri = require("../../assets/icons/camera.png") // Replace with the path to your image in the assets folder
      const base64String = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setImageBase64(`data:image/jpeg;base64,${base64String}`);
    } catch (error) {
      console.error('Error converting image to base64:', error);
    }
  };

  return (
    <View style={styles.container}>
      {imageBase64 && <Image source={{ uri: imageBase64 }} style={styles.image} />}
    </View>
    
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default DemoPhoto;
