import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Props {
    taskName: string;
    description: string;
    estTime: number;
    percentage: number;
    status: string;
}

const EmployeeTaskListCard: React.FC<Props> = ({
    taskName,
    description,
    estTime,
    percentage,
    status,
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
        <TouchableOpacity style={styles.container}>
            <View>
                <Text style={styles.boldText}>
                    Task Name: <Text style={styles.normalText}>{taskName}</Text>
                </Text>
                <Text style={styles.boldText}>
                    Description: <Text style={styles.normalText}>{description}</Text>
                </Text>
                <Text style={styles.boldText}>
                    Est Time: <Text style={styles.normalText}>{estTime}</Text>
                </Text>
                <View style={styles.row}>
                    <Text style={styles.boldText}>Status: </Text>
                    <View style={styles.progressBar}>
                        <ProgressBar progress={percentage / 100} color={progressColor} style={styles.progress} />
                    </View>
                    <Text style={styles.normalText}>{percentage} %</Text>
                </View>
                <Text style={styles.boldText}>
                    Status: <Text style={styles.normalText}>{status}</Text>
                </Text>
            </View>
        </TouchableOpacity>
    );
};

// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: '#DFF6FF',
//         borderRadius: 30,
//         padding: 16,
//         marginBottom: 16,
//         elevation: 5,
//         margin: 15,
//     },
//     boldText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginBottom: 4,
//         fontFamily: 'Roboto',
//     },
//     normalText: {
//         fontSize: 16,
//         marginBottom: 4,
//         fontFamily: 'Roboto',
//         fontWeight: 'normal',
//     },
//     row: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 4,
//     },
//     progressBar: {
//         flex: 1,
//         height: 10,
//         borderRadius: 5,
//         backgroundColor: '#E0E0E0',
//         marginLeft: 8,
//         marginRight: 4,
//     },
//     progress: {
//         height: 10,
//         borderRadius: 5,
//     },
// });

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#DFF6FF',
      borderRadius: wp('7%'), 
      padding: wp('2%'), 
      marginBottom: hp('2%'), 
      elevation: 5,
      marginHorizontal: wp('4%'),
    },
    boldText: {
      fontSize: wp('4.2%'), 
      fontWeight: 'bold',
      marginBottom: hp('1%'), 
      fontFamily: 'Roboto',
    },
    normalText: {
      fontSize: wp('4.2%'), 
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
      height: hp('1%'), 
      borderRadius: wp('2.5%'), 
      backgroundColor: '#E0E0E0',
      marginLeft: wp('1.5%'), 
      marginRight: wp('0.5%'), 
    },
    progress: {
      height: hp('1%'), 
      borderRadius: wp('2.5%'),
    },
  });
export default EmployeeTaskListCard;