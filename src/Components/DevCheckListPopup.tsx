import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, KeyboardAvoidingView, Vibration, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { CheckBox } from 'react-native-elements';
import { useAxios } from '../Contexts/Axios';
import { useAuth } from '../Contexts/Auth';
import LottieAnimation from './Animation';
import { TaskCheckListModel } from '../Models/TaskCheckListModel';
import FloatingButton from './FloatingButton';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface DevChecklistPopupProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: () => void;
    taskChecklistData: TaskCheckListModel[];
    categoryName: string;
    subcategoryName: string;
}

const DevChecklistPopup: React.FC<DevChecklistPopupProps> = ({ isVisible, onClose, onSubmit, taskChecklistData, categoryName, subcategoryName }) => {

    const axios = useAxios();
    const auth = useAuth();
    const navigation = useNavigation();

    //const [percentageValue] = React.useState(route.params.Percentage)
    const [loading, setLoading] = useState(false);
    const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);


    useEffect(() => {
        const initialCheckedState: { [id: number]: boolean } = {};
        taskChecklistData.forEach((item) => {
            initialCheckedState[item.id] = false;
        });
        setCheckedItems(initialCheckedState);
    }, [taskChecklistData]);

    const handleCheckboxChange = (id: number) => {
        const newCheckedItems = { ...checkedItems };
        newCheckedItems[id] = !newCheckedItems[id];
        setCheckedItems(newCheckedItems);
        setSelectedItemId(id);
        if (newCheckedItems[id]) {
            setSelectedItemIds((prevIds) => [...prevIds, id]);
        } else {
            setSelectedItemIds((prevIds) => prevIds.filter((itemId) => itemId !== id));
        }
    };
    const handleSubmit = () => {
        if (selectedItemId !== null) {
            onSubmit(selectedItemIds);
            setSelectedItemId(null);
            onClose();
        }
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent>
            <KeyboardAvoidingView behavior="height" style={styles.popupContainer}>
                <View style={styles.popupContent}>
                    {loading && (
                        <View style={styles.loadingContainer}>
                            <LottieAnimation
                                source={require('../../assets/icons/Loading.json')}
                                autoPlay={true}
                                loop={true}
                                visible={loading}
                            />
                        </View>
                    )}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <FontAwesome name="close" size={24} color="#999" />
                    </TouchableOpacity>
                    <Text style={styles.popupTitle}>Update Task Details</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {taskChecklistData.map((item) => (
                            <View style={[styles.card, styles.checklistItem]} key={item.id}>
                                <View style={styles.descriptionContainer}>
                                    <Text style={styles.checklistDescriptionHeading}>Check List Description :</Text>
                                    <Text style={styles.checklistDescription}>{item.checkListDescription}</Text>
                                </View>
                                <View style={styles.checkboxCard}>
                                    {categoryName === 'QA' && subcategoryName === 'Testing' ? (
                                        <View style={styles.checkboxContainer}>
                                            <Text style={styles.checkboxText}>Dev Check</Text>
                                            {item.userTaskCheckList ? (
                                                item.userTaskCheckList.map((userTask) => (
                                                    (userTask.isDevChecked && userTask.isLatest) ? (
                                                        <CheckBox
                                                            key={userTask.id}
                                                            checked={userTask.isDevChecked && userTask.isLatest}
                                                            containerStyle={styles.checkbox}
                                                        />
                                                    ) : null
                                                ))
                                            ) : (
                                                <View></View>
                                            )}

                                        </View>
                                    ) : null}

                                    <TouchableOpacity onPress={() => handleCheckboxChange(item.id)}>
                                        <View style={styles.checkboxContainer}>
                                            <Text style={styles.checkboxText}>{categoryName === 'QA' && subcategoryName === 'Testing' ? 'QA Check' : 'Dev Check'}</Text>
                                            <CheckBox
                                                checked={checkedItems[item.id] || false}
                                                onPress={() => handleCheckboxChange(item.id)}
                                                containerStyle={styles.checkbox}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}

                    </ScrollView>
                    {selectedItemId !== null && selectedItemIds.length > 0 && (
                        <FloatingButton
                            title="Submit"
                            variant="contained"
                            onPress={handleSubmit}
                            style={styles.popupButton}
                            titleStyle={styles.popupButtonText}
                            icon="arrow-right-bold-circle"
                        />
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

// const styles = StyleSheet.create({
//     popupContainer: {
//         flex: 1,
//         justifyContent: 'flex-end',
//     },
//     popupContent: {
//         backgroundColor: '#fff',
//         borderTopLeftRadius: 15,
//         borderTopRightRadius: 15,
//         padding: 30,
//         paddingTop: 40,
//         height: '85%',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//         paddingBottom: 80
//     },
//     popupTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     popupButtonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     popupButton: {
//         backgroundColor: '#35A2C1',
//         height: 50,
//         borderRadius: 8,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginRight: -10,
//         width: "70%",
//         marginTop: 60
//     },
//     popupButtonText: {
//         color: '#FFFFFF',
//         fontWeight: 'bold',
//         fontSize: 14,
//     },
//     cancelPopupButton: {
//         height: 50,
//         borderRadius: 25,
//         alignItems: 'center',
//         justifyContent: 'center',
//         right: 20,
//     },
//     cancelPopupButtonText: {
//         color: '#35A2C1',
//         fontWeight: 'bold',
//         fontSize: 14,
//     },
//     errorText: {
//         color: 'red',
//         marginBottom: 10,
//     },
//     loadingContainer: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(255, 255, 255, 1)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 999,
//     },
//     container: {
//         flex: 1,
//         backgroundColor: '#3A9EC2',
//     },
//     topView: {
//         marginTop: 30,
//         marginHorizontal: 24,
//         backgroundColor: '#3A9EC2',
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         flexDirection: 'row',
//     },
//     headingText: {
//         marginRight: 50,
//         top: 15,
//         textAlign: 'center',
//         fontSize: 30,
//         color: '#fff',
//         fontWeight: 'bold',
//     },
//     backButton: {
//         left: -5,
//         top: 8,
//     },
//     checklistItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 15,
//     },
//     checkboxContainer: {
//         flexDirection: 'column',
//         alignItems: 'flex-end',
//         marginTop: 10,
//         backgroundColor: 'transparent',
//         borderWidth: 0,
//     },
//     checklistDescriptionHeading: {
//         fontSize: 16,
//         color: '#000',
//         fontWeight: 'bold'
//     },
//     descriptionContainer: {
//         flex: 1,
//     },
//     checkbox: {
//         alignSelf: 'center',
//     },
//     card: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderRadius: 15,
//         backgroundColor: '#b7e0ea',
//         padding: 15,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 0 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },

//     closeButton: {
//         position: 'absolute',
//         top: 10,
//         right: 10,
//         zIndex: 2,
//     },
//     checklistDescription: {
//         fontSize: 16,
//         color: '#000',
//     },

//     checkboxCard: {
//         flexDirection: 'column',
//         alignItems: 'flex-end',
//         marginTop: 10,
//         backgroundColor: '#c9f4d1',
//         borderRadius: 20,
//         padding: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 0 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//         marginLeft: 25
//     },
//     checkboxText: {
//         fontWeight: 'bold',

//     },

// });

const styles = StyleSheet.create({
    popupContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    popupContent: {
      backgroundColor: '#fff',
      borderTopLeftRadius: wp('4%'), // Use responsive borderRadius
      borderTopRightRadius: wp('4%'), // Use responsive borderRadius
      padding: wp('8%'), // Use responsive padding
      paddingTop: wp('10%'), // Use responsive padding
      height: hp('85%'), // Use responsive height
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      paddingBottom: hp('10%'), // Use responsive padding
    },
    popupTitle: {
      fontSize: wp('4.5%'), // Use responsive fontSize
      fontWeight: 'bold',
      marginBottom: hp('2%'), // Use responsive margin
    },
    popupButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    popupButton: {
      backgroundColor: '#35A2C1',
      height: hp('6%'), // Use responsive height
      borderRadius: wp('4%'), // Use responsive borderRadius
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: -wp('2%'), // Use responsive margin
      width: '70%', // Use responsive width
      marginTop: hp('8%'), // Use responsive margin
    },
    popupButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: wp('4%'), // Use responsive fontSize
    },
    cancelPopupButton: {
      height: hp('6%'), // Use responsive height
      borderRadius: wp('12%'), // Use responsive borderRadius
      alignItems: 'center',
      justifyContent: 'center',
      right: wp('4%'), // Use responsive margin
    },
    cancelPopupButtonText: {
      color: '#35A2C1',
      fontWeight: 'bold',
      fontSize: wp('4%'), // Use responsive fontSize
    },
    errorText: {
      color: 'red',
      marginBottom: hp('2%'), // Use responsive margin
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    },
    container: {
      flex: 1,
      backgroundColor: '#3A9EC2',
    },
    topView: {
      marginTop: hp('3%'), // Use responsive margin
      marginHorizontal: wp('4%'), // Use responsive margin
      backgroundColor: '#3A9EC2',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    headingText: {
      marginRight: wp('10%'), // Use responsive margin
      top: hp('1.5%'), // Use responsive margin
      textAlign: 'center',
      fontSize: wp('6%'), // Use responsive fontSize
      color: '#fff',
      fontWeight: 'bold',
    },
    backButton: {
      left: -wp('1%'), // Use responsive margin
      top: hp('1%'), // Use responsive margin
    },
    checklistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: hp('2%'), // Use responsive margin
    },
    checkboxContainer: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      marginTop: hp('1.5%'), // Use responsive margin
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    checklistDescriptionHeading: {
      fontSize: wp('4%'), // Use responsive fontSize
      color: '#000',
      fontWeight: 'bold',
    },
    descriptionContainer: {
      flex: 1,
    },
    checkbox: {
      alignSelf: 'center',
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: wp('3%'), // Use responsive borderRadius
      backgroundColor: '#b7e0ea',
      padding: wp('4%'), // Use responsive padding
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      marginLeft: wp('6%'), // Use responsive margin
    },
  
    closeButton: {
      position: 'absolute',
      top: hp('1%'), // Use responsive margin
      right: wp('1%'), // Use responsive margin
      zIndex: 2,
    },
    checklistDescription: {
      fontSize: wp('4%'), // Use responsive fontSize
      color: '#000',
    },
  
    checkboxCard: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      marginTop: hp('1.5%'), // Use responsive margin
      backgroundColor: '#c9f4d1',
      borderRadius: wp('6%'), // Use responsive borderRadius
      padding: wp('2%'), // Use responsive padding
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      marginLeft: wp('5%'), // Use responsive margin
    },
    checkboxText: {
      fontWeight: 'bold',
    },
  });
  

export default DevChecklistPopup;
