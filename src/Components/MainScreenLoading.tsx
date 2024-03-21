import React from 'react';
import { View, ViewStyle,StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import AnimationProps  from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface LottieAnimationProps extends AnimationProps {
  style?: ViewStyle;
  source: any;
  autoPlay: boolean;
  loop: boolean;
  visible:boolean;
}

const MainAnimation: React.FC<LottieAnimationProps> = ({
  source,
  autoPlay,
  loop,
  style,
  visible,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      <View style={[styles.animationContainer, style]}>
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
//     bottom: 0,
//     left: 0,
//     right: 0,
//     top: 0,
//     zIndex: 999,
//     backgroundColor: 'transparent',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//   },
//   overlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     top: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//   },
//   animationContainer: {
//     width: '100%',
//     height: '70%',
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   animation: {
//     width: '100%',
//     height: '100%',
//   },
// });
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 999,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  animationContainer: {
    width: '100%',
    height: hp('70%'), 
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('4%'), 
    borderTopRightRadius: wp('4%'), 
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});



export default MainAnimation;
