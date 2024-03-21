import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import LottieView  from 'lottie-react-native';
import  AnimationProps  from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface LottieAnimationProps extends AnimationProps {
  source: any;
  autoPlay: boolean;
  loop: boolean;
  visible: boolean;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  source,
  autoPlay,
  loop,
  visible,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      <View style={styles.animationContainer}>
        <LottieView
          source={source}
          autoPlay={autoPlay}
          loop={loop}
          style={styles.animation}
        />
      </View>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   overlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     top: 0,
//     backgroundColor: 'rgba(255, 255, 255, 0.6)',
//   },
//   animationContainer: {
//     aspectRatio: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '100%', 
//     height: '100%', 
//     alignSelf: 'center',
//     marginTop: '10%', 
//   },
  
//   animation: {
//     width: '80%', 
//     height: '80%',  
//     alignItems:'center'
//   },
  
// });

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  animationContainer: {
    aspectRatio: 1,
  alignItems: 'center',
  justifyContent: 'center',
  width:'100%',
  height: "100%", 
  alignSelf: 'center',
  marginTop: hp('10%'),
  },
  
  animation: {
    width: wp('40%'), 
    height: hp('40%'), 
    alignItems: 'center',
  },
});
export default LottieAnimation;
