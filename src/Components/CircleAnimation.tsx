import React from 'react';
import { View, StyleSheet, Text, Animated, Easing } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CircleAnimation = ({ pct, size }) => {
  const circleSize = size;
  const rotation = new Animated.Value(0);

  const rotateCircle = () => {
    Animated.timing(rotation, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      rotation.setValue(0);
    });
  };

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const fontSize = circleSize / 4;

  return (
    <View style={[styles.circleContainer, { width: circleSize, height: circleSize, borderRadius: circleSize / 2 }]}>
      <Animated.View
        style={[
          styles.fill,
          {
            height: `${pct}%`,
            transform: [{ rotate: spin }],
            backgroundColor: '#3A9EC2', // Set the color to #3A9EC2
            bottom: '0%', // Start the fill from the bottom
            top: null, // Reset the top value
          },
        ]}
      />
      <View style={styles.textContainer}>
        <Text style={[styles.text, { fontSize }]}>{pct}%</Text>
      </View>
    </View>
  );
};

// const styles = StyleSheet.create({
//   circleContainer: {
//     borderWidth: 1,
//     borderColor: 'gray',
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflow: 'hidden',
//   },
//   fill: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: '0%', // Start the fill from the bottom
//     top: null, // Reset the top value
//   },
//   textContainer: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontWeight: 'bold',
//     color: 'black',
//     fontSize: 15,
//   },
// });

const styles = StyleSheet.create({
  circleContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width: wp('10%'), 
    height: wp('10%'), 
    borderRadius: wp('5%'), 
  },
  fill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '0%', 
    top: null, 
  },
  textContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: hp('2.5%'), 
  },
});

export default CircleAnimation;
