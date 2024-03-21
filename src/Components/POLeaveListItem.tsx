import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Props {
  LeaveType: string;
  LeaveSubtype: string;
  LeaveReason: string;
  CreatedDate: Date;
  Status:string;
  onPress: (id: number) => void; // Add a function prop to handle the press event with an ID
  itemId: number;
}



const POLeaveListItem: React.FC<Props> = ({
    LeaveType,
    LeaveSubtype,
    LeaveReason,
    CreatedDate,
    Status,
    onPress,
    itemId,
}) => {

    const formattedDate = CreatedDate
    ? new Date(CreatedDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '';


  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(itemId)}>
      <View>
        <Text style={styles.boldText}>
          LeaveType: <Text style={styles.normalText}>{LeaveType}</Text>
        </Text>
        {LeaveType === 'DayOff' && (
          <Text style={styles.boldText}>
            LeaveSubtype: <Text style={styles.normalText}>{LeaveSubtype}</Text>
          </Text>
        )}
        <Text style={styles.boldText}>
          LeaveReason: <Text style={styles.normalText}>{LeaveReason}</Text>
        </Text>
        <Text style={styles.boldText}>
          CreatedDate: <Text style={styles.normalText}>{formattedDate}</Text>
        </Text>
        <Text style={styles.boldText}>
          Status: <Text style={styles.normalText}>{Status}</Text>
        </Text>
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
    borderRadius: wp('7%'), 
    padding: wp('2%'), 
    marginBottom: hp('3%'), 
    elevation: 5,
    marginHorizontal: wp('3.5%'),
  },
  boldText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
    fontFamily: 'Roboto',
    marginLeft:wp('2%')
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
export default POLeaveListItem;


