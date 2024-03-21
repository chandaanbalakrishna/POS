import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Props {
  Name: string;
  onPress: () => void;
}

const POTeamDetailsListItem: React.FC<Props> = ({
  Name,
  onPress,
}) => {

  return (
    <View style={styles.itemContainer}>

      <LinearGradient
        colors={['white', '#6CB9D8']}
        start={{ x: 1, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientContainer}
      >

        <TouchableOpacity onPress={onPress}>

          <View style={styles.rowContainer}>
            <View style={styles.circle} />
            <Text style={styles.normalText}>{Name}</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#DFF6FF',
//     borderRadius: 30,
//     padding: 16,
//     //marginBottom: 16,
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
//     padding: 10,
//     marginLeft: 20
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   rowContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   circle: {
//     borderRadius: 25,
//     height: 45,
//     width: 45,
//     backgroundColor: "#fff"
//   },
//   gradientContainer: {
//     borderRadius: 30,
//     padding: 20,
//     elevation: 5,
//   },
//   itemContainer: {
//     marginRight: 16,
//     width: '80%',
//     margin: 10,
//   },
// });

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DFF6FF',
    borderRadius: wp('10%'), // Use responsive border radius
    padding: wp('4%'), // Use responsive padding
    elevation: 5,
    margin: wp('3%'), // Use responsive margin
  },
  boldText: {
    fontSize: wp('4%'), // Use responsive font size
    fontWeight: 'bold',
    marginBottom: hp('1%'), // Use responsive margin
    fontFamily: 'Roboto',
  },
  normalText: {
    fontSize: wp('4%'), // Use responsive font size
    marginBottom: hp('1%'), // Use responsive margin
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    padding: wp('2%'), // Use responsive padding
    marginLeft: wp('4%'), // Use responsive margin
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'), // Use responsive margin
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    borderRadius: wp('12.5%'), // Use responsive border radius
    height: hp('9%'), // Use responsive height
    width: hp('9%'), // Use responsive width
    backgroundColor: '#fff',
  },
  gradientContainer: {
    borderRadius: wp('10%'), // Use responsive border radius
    padding: wp('5%'), // Use responsive padding
    elevation: 5,
  },
  itemContainer: {
    marginRight: wp('3%'), // Use responsive margin
    width: wp('80%'), // Use responsive width
    margin: wp('2%'), // Use responsive margin
  },
});

export default POTeamDetailsListItem;
