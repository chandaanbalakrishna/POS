import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Props {
  Name: string;
  Type: string;
  onDownload: () => void; 
}

const POProjectList: React.FC<Props> = ({
  Name,
  Type,
  onDownload 
}) => {

    const handleDownloadClick = () => {
        onDownload(); 
      };

  return (
    <TouchableOpacity style={styles.container}>
    <View style={styles.row}>
      <Text style={styles.boldText}>
       File Name: <Text style={styles.normalText}>{Name}</Text>
      </Text>
      <TouchableOpacity onPress={handleDownloadClick}>
      <MaterialCommunityIcons name="download-circle" size={32} color="black" />
      </TouchableOpacity>
    </View>
    <Text style={styles.boldText}>
      Doc Type: <Text style={styles.normalText}>{Type}</Text>
    </Text>
  </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DFF6FF',
    borderRadius: wp('6%'), 
    padding: wp('3%'), 
    marginBottom: hp('3%'), 
    elevation: 5,
    marginHorizontal: wp('1%'),
    marginRight:wp('2%'),
    right:wp('0.5%')
  },
  boldText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
    fontFamily: 'Roboto',
  },
  normalText: {
    fontSize: wp('4%'), 
    marginBottom: hp('1%'), 
    fontFamily: 'Roboto',
    fontWeight: 'normal',
  },
  row: {
    flexDirection: 'row',
    justifyContent:'space-between',
    marginBottom: hp('1%'), 
  },
  
});
export default POProjectList;
