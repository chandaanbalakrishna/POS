import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Props {
  title: string;
  isLoading?: boolean;
  onPress: () => void;
  style?: any;
  titleStyle?: any;
  disabled?: boolean; // Added disabled prop
}

const POButton: React.FC<Props> = ({
  title,
  isLoading = false,
  onPress,
  style = {},
  titleStyle = {},
  disabled = false, // Added disabled prop with default value
}) => {
  const handlePress = () => {
    if (!disabled) {
      onPress(); // Trigger onPress only if the button is not disabled
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabledButton]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled} // Set the disabled prop of TouchableOpacity
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" animating={true} size="small" />
      ) : (
        <Text style={[styles.text, titleStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

// const styles = StyleSheet.create({
//   button: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 32,
//     borderRadius: 15,
//     elevation: 3,
//     backgroundColor: '#256D85',
//     marginTop: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 2,
//   },
//   disabledButton: {
//     opacity: 0.5, // Adjust the opacity to indicate the disabled state
//   },
//   text: {
//     fontSize: 16,
//     lineHeight: 21,
//     fontWeight: 'bold',
//     letterSpacing: 0.25,
//     color: 'white',
//   },
// });

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('2%'),        // Responsive paddingVertical
    paddingHorizontal: wp('8%'),     // Responsive paddingHorizontal
    borderRadius: wp('5%'),           // Responsive borderRadius
    elevation: 3,
    backgroundColor: '#256D85',
    marginTop: hp('2%'),              // Responsive marginTop
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  disabledButton: {
    opacity: 0.5, // Adjust the opacity to indicate the disabled state
  },
  text: {
    fontSize: wp('4%'),               // Responsive fontSize
    lineHeight: hp('2.5%'),           // Responsive lineHeight
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});









export default POButton;
