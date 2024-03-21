import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Props {
  Name: string;
  Type: string;
  Description: string;
  onPress: () => void;
  onUploadDocument: (itemId: number) => void;
  percentage: number;
  itemId: number;
}

const POProjectListItem: React.FC<Props> = ({
  Name,
  Type,
  Description,
  onPress,
  percentage,
  onUploadDocument,
  itemId
}) => {
  let progressColor = '#4287f5'; // Default color

  if (percentage >= 0 && percentage < 25) {
    progressColor = 'red';
  } else if (percentage >= 25 && percentage < 50) {
    progressColor = 'yellow';
  } else if (percentage >= 50 && percentage < 95) {
    progressColor = 'orange';
  } else if (percentage >= 95 && percentage <= 100) {
    progressColor = 'green';
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View>
      <TouchableOpacity onPress={() => onUploadDocument(itemId)} style={styles.uploadButton}>
      <FontAwesome5 name="file-upload" size={30} color="black" />
      <Text style={{left:wp('3%'),fontWeight:'bold'}}>Upload</Text>
     </TouchableOpacity>
        <Text style={styles.boldText}>
          Name: <Text style={styles.normalText}>{Name}</Text>
        </Text>
        <Text style={styles.boldText}>
          Type: <Text style={styles.normalText}>{Type}</Text>
        </Text>
        <Text style={styles.boldText}>
          Description: <Text style={styles.normalText}>{Description}</Text>
        </Text>
        <View style={styles.row}>
          <Text style={styles.boldText}>Status: </Text>
          <View style={styles.progressBar}>
            <ProgressBar progress={percentage / 100} color={progressColor} style={styles.progress} />
          </View>
          <Text style={styles.normalText}>{percentage} %</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#DFF6FF',
//     borderRadius: 30,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 5,
//     margin: 15,
//   },
//   boldText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 4,
//     fontFamily: 'Roboto',
//   },
//   normalText: {
//     fontSize: 16,
//     marginBottom: 4,
//     fontFamily: 'Roboto',
//     fontWeight: 'normal',
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   progressBar: {
//     flex: 1,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#E0E0E0',
//     marginLeft: 8,
//     marginRight: 4,
//   },
//   progress: {
//     height: 10,
//     borderRadius: 5,
//   },
// });

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DFF6FF',
    borderRadius: wp('8%'), 
    padding: wp('2%'), 
    marginBottom: hp('3%'), 
    elevation: 5,
    marginHorizontal: wp('3.5%'),
  },
  uploadButton: {
    borderRadius: wp('3%'), // Adjust the border radius
    alignItems: 'flex-end',
    justifyContent: 'center',
    Top: -hp('2%'),
    marginHorizontal:wp('23%'),
    left:wp('20%') 
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: wp('4%'), // Adjust the font size
    paddingVertical: hp('1%'), // Adjust the padding
    paddingHorizontal: wp('3%'), // Adjust the padding
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
    alignItems: 'center',
    marginBottom: hp('1%'), 
  },
  progressBar: {
    flex: 1,
    height: hp('0.7%'), 
    borderRadius: hp('0.5%'), 
    backgroundColor: '#E0E0E0',
    marginLeft: wp('1.5%'), 
    marginRight: wp('1%'), 
  },
  progress: {
    height: hp('0.7%'),
    borderRadius: hp('0.5%'), 
  },
});
export default POProjectListItem;
