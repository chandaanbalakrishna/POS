import React, { useState, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Animated, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const DraggableProgressBar = ({ onPercentageChange }) => {
  const [percentage, setPercentage] = useState(0);

  const progressWidth = 320; // Change this to the desired width of the progress bar
  const handlerWidth = 25; // Change this to the desired width of the handler

  const pan = useState(new Animated.Value(0))[0];

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset(pan._value);
      pan.setValue(0);
    },
    onPanResponderMove: (_, gestureState) => {
      const { moveX } = gestureState;
      const newPercentage = Math.ceil((moveX / progressWidth) * 100);

      if (newPercentage >= 0 && newPercentage <= 100) {
        setPercentage(newPercentage);
        onPercentageChange(newPercentage);
        pan.setValue(moveX - handlerWidth / 2);
      }
    },
    onPanResponderRelease: () => {
      pan.flattenOffset();
    },
  });

  useEffect(() => {
    pan.addListener((value) => {
      const newPercentage = Math.ceil((value.value / progressWidth) * 100);
      if (newPercentage >= 0 && newPercentage <= 100) {
        setPercentage(newPercentage);
        onPercentageChange(newPercentage);
      }
    });

    return () => {
      pan.removeAllListeners();
    };
  }, [pan, progressWidth, onPercentageChange]);

  const getProgressBarColor = () => {
    if (percentage > 0 && percentage <= 30) {
      return '#FF9800';
    } else if (percentage >= 31 && percentage <= 90) {
      return 'yellow';
    } else if (percentage >= 91) {
      return 'green';
    }
    return '#3A9EC2'; // Default color
  };

  const handlerPosition = Math.max(0, Math.min(progressWidth - handlerWidth, Math.round((progressWidth - handlerWidth) * (percentage / 100))));

  return (
    <View style={styles.container}>
      <View style={styles.progressBar} {...panResponder.panHandlers}>
        <View style={[styles.progress, { width: `${percentage}%`, backgroundColor: getProgressBarColor() }]} />
        <TouchableOpacity activeOpacity={1} style={[styles.handler, { left: handlerPosition }]} />
      </View>
      <View style={styles.percentageContainer}>
        <Text style={styles.percentageText}>Percentage: {percentage}%</Text>
      </View>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   progressBar: {
//     width: 320, // Change this to the desired width of the progress bar
//     height: 20,
//     backgroundColor: '#E0E0E0',
//     borderRadius: 10,
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   handler: {
//     position: 'absolute',
//     width: 25,
//     height: 25,
//     borderRadius: 15,
//     backgroundColor: '#3A9EC2',
//     top: -3,
//   },
//   progress: {
//     height: '100%',
//     backgroundColor: '#3A9EC2',
//   },
//   percentageContainer: {
//     marginTop: 10,
//   },
//   percentageText: {
//     marginBottom: 2,
//     paddingBottom: 5,
//     fontWeight: 'bold',
//     color: '#256D85',
//     justifyContent: 'flex-start',
//     position: 'absolute',
//     right: 40,
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    width: wp('80%'), 
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  handler: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: '#3A9EC2',
    top: -3,
  },
  progress: {
    height: '100%',
    backgroundColor: '#3A9EC2',
  },
  percentageContainer: {
    marginTop: 10,
  },
  percentageText: {
    marginBottom: 2,
    paddingBottom: 5,
    fontWeight: 'bold',
    color: '#256D85',
    justifyContent: 'flex-start',
    position: 'absolute',
    right: wp('10%'), 
  },
});
export default DraggableProgressBar;
