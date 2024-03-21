import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const InternetCheckScreen = () => {
    const [isInternetReachable, setIsInternetReachable] = useState(true);
    const [showInternetAlert, setShowInternetAlert] = useState(false);
    const [loading, setLoading] = React.useState(false);
  
    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        setIsInternetReachable(state.isInternetReachable);
        setShowInternetAlert(!state.isInternetReachable);
      });
     
  
      return () => {
        unsubscribe();
       
      };
    }, []);
  
    return (
        <Modal isVisible={showInternetAlert} style={styles.modalContainer} backdropOpacity={0.5}>
        <Animatable.View animation="slideInDown" style={styles.slideInContainer}>
          <LottieView 
            source={require('../../assets/icons/Internet.json')}
            autoPlay
            loop
            style={styles.animation}
          />
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>No Internet Connection</Text>
            <Text style={styles.modalText}>
              Please turn on the internet and try again.
            </Text>
          </View>
        </Animatable.View>
      </Modal>
    );
  };
  
  // const styles = StyleSheet.create({
  //   modalContainer: {
  //       marginHorizontal:20,
  //       height:30,
  //       justifyContent: 'center',
  //       margin: 0,
  //     },
  //     slideInContainer: {
  //       backgroundColor: 'white',
  //       padding: 15,
  //       borderRadius: 15,
  //       marginTop: 50, 
  //     },
  //     animation: {
  //       width: 100,
  //       height: 100,
  //       alignSelf: 'center',
  //       marginBottom: 10,
  //     },
  //     modalContent: {
  //       alignItems: 'center',
  //     },
  //     modalText: {
  //       fontSize: 16,
  //       marginBottom: 10,
  //       color: 'red',
  //     },
  // });
  const styles = StyleSheet.create({
    modalContainer: {
      marginHorizontal: wp('5%'), 
      height: hp('4%'), 
      justifyContent: 'center',
      margin: 0,
    },
    slideInContainer: {
      backgroundColor: 'white',
      padding: wp('4%'),
      borderRadius: wp('3%'), 
      marginTop: hp('10%'), 
    },
    animation: {
      width: wp('30%'), 
      height: wp('30%'), 
      alignSelf: 'center',
      marginBottom: hp('2%'), 
    },
    modalContent: {
      alignItems: 'center',
    },
    modalText: {
      fontSize: wp('4.2%'), 
      marginBottom: hp('1%'), 
      color: 'red',
    },
  });

  
  export default InternetCheckScreen;
  