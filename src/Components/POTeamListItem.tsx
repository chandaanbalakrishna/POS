import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons'; // Import an icon library
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Props {
  Name: string;
  onPress: () => void;
}

const POTeamListItem: React.FC<Props> = ({
  Name,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
      <LinearGradient
        colors={['white', '#3A9EC2']}
        start={{ x: 1, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientContainer}
      >
        <View style={styles.rowContainer}>
          <View style={styles.circle}>
           
          </View>
          <Text style={styles.boldText}>{Name}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// const styles = StyleSheet.create({
//   itemContainer: {
//     marginVertical: 15,
//     marginHorizontal: 15,
//     borderRadius: 10,
//     overflow: 'hidden', // Clip the gradient and shadow
 
//   },
//   gradientContainer: {
//     borderRadius: 10,
//     padding: 12,
//     elevation: 4,
//   },
//   boldText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginLeft: 10,
//     fontFamily: 'Roboto',
//   },
//   rowContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   circle: {
//     borderRadius: 25,
//     height: 50,
//     width: 50,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 2,
//   },
// });

const styles = StyleSheet.create({
  itemContainer: {
    marginVertical: hp('2%'), // Use responsive margin
    marginHorizontal: wp('4%'), // Use responsive margin
    borderRadius: wp('4%'), // Use responsive border radius
    overflow: 'hidden', // Clip the gradient and shadow
  },
  gradientContainer: {
    borderRadius: wp('4%'), // Use responsive border radius
    padding: wp('3%'), // Use responsive padding
    elevation: 4,
  },
  boldText: {
    fontSize: wp('4.5%'), // Use responsive font size
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: wp('2%'), // Use responsive margin
    fontFamily: 'Roboto',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    borderRadius: wp('12.5%'), // Use responsive border radius
    height: hp('10%'), // Use responsive height
    width: hp('10%'), // Use responsive width
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
});


export default POTeamListItem;
