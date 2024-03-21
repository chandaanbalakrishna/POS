import React, { useState } from 'react';
import { View,  StyleSheet, TouchableOpacity,Image ,Text} from 'react-native';
import Modal from 'react-native-modal';
import PODateTimePicker from './PODateTimePicker';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Chip } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface FilterDetailsPopupProps {
  onFilterChange: boolean;
  Status:string[];
  onSubmit: (status: string[]) => void;
}
const LeaveFilterComponent : React.FC<FilterDetailsPopupProps> = ({
  onFilterChange,
  Status,
  onSubmit,
}) => {
  
  const [showModal, setShowModal] = useState(false);
  const [StatusValue, setStatusValue] = useState('');
  const handleTaskTypeSelect = (text: string) => {
    setStatusValue(text);
  };
 
  const [selectedChips, setSelectedChips] = useState([]);
  const handleStatusChipPress = (text) => {
    if (selectedChips.includes(text)) {
      setSelectedChips(selectedChips.filter((item) => item !== text));
    } else {
      setSelectedChips([...selectedChips, text]);
    }
  };
 console.log(selectedChips)


  const handleFilterApply = () => {
    onSubmit(selectedChips)
    setShowModal(false);
  };
  const handleReset = () => {
    setSelectedChips([]); // Reset selected status filters
  }
    const handleClose = () => {
      
      setShowModal(false);
  };
  return (
    <View >
      <TouchableOpacity  onPress={() => setShowModal(true)}>
      <Ionicons name="filter" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
      </TouchableOpacity>

      <Modal
        isVisible={showModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}
        //onBackdropPress={() => setShowModal(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <FontAwesome name="close" size={24} color="#999" />
          </TouchableOpacity>
          <Text style={styles.modalHeader}>Filter Options</Text>
            <Text style={styles.modalHeader}>Status</Text>
 <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {Status.map((text, index) => (
        <Chip
          key={index}
          style={{
            margin: 5,
            backgroundColor: selectedChips.includes(text) ? '#90EE90' : '#A9A9A9',
          }}
          textStyle={{ color: selectedChips.includes(text) ? '#000000' : '#FFFFFF' }}
          onPress={() => handleStatusChipPress(text)}
        >
          {text}
        </Chip>
      ))}
    </View>
          <TouchableOpacity style={styles.applyButton} onPress={handleFilterApply}>
            <Text style={styles.applyButtonText}>Apply Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

// const styles = StyleSheet.create({
 
//   filterButtonImage: {
//     width: 24, // Set the width of the image as needed
//     height: 24, // Set the height of the image as needed
//     resizeMode: 'contain', // Adjust the resizeMode as per your image requirements
//   },
//   searchBarContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '30%', // Adjust the width to control spacing between containers
//     height: 35, // Adjust the height for a medium-sized container
//     borderRadius: 20,
//     marginBottom: 3,
//     marginLeft: 10,
//   },
  
//   searchbar: {
//     flexDirection: 'row',
//     backgroundColor: '#0b628a', // Set the initial background color to blue
//     alignItems: 'center',
//     flex: 1,
//     height: '65%',
//     borderRadius: 20,
//     paddingRight: 5,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 5, // Adjust the margin for medium-sized text
//     opacity: 1,
//     fontSize: 16, // Adjust the font size for medium-sized text
//   },
//   filterButton: {
//     backgroundColor: 'blue',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   modal: {
//     justifyContent: 'flex-end', // Align the modal at the bottom
//     margin: 0,
//   },
//   filterButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   modalContent: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 8,
//     width: '100%',
//   },
//   modalHeader: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   pickerContainer: {
//     height: 40,
//     marginBottom: 16,
//   },
//   picker: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//   },
//   dropDown: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//   },
//   dateLabel: {
//     fontSize: 16,
//     marginBottom: 8,
//     textDecorationLine: 'underline',
//   },
//   applyButton: {
//     backgroundColor: 'blue',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   ProfileIcon: {
//     width: 40,
//     transform: [{ rotateY: '180deg' }]
//   },
//   applyButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   resetButton: {
//     backgroundColor: 'red', // Set your desired background color for the "Reset" button
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   resetButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 999,
//   },
// });

const styles = StyleSheet.create({
  filterButtonImage: {
    width: wp('4%'), // Adjust the width using responsive percentage
    height: hp('2.5%'), // Adjust the height using responsive percentage
    resizeMode: 'contain', // Adjust the resizeMode as per your image requirements
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('30%'), // Adjust the width using responsive percentage
    height: hp('3.5%'), // Adjust the height using responsive percentage
    borderRadius: hp('2%'), // Adjust the border radius using responsive percentage
    marginBottom: hp('0.5%'), // Adjust the margin using responsive percentage
    marginLeft: wp('2.5%'), // Adjust the margin using responsive percentage
  },
  searchbar: {
    flexDirection: 'row',
    backgroundColor: '#0b628a',
    alignItems: 'center',
    flex: 1,
    height: hp('6.5%'), // Adjust the height using responsive percentage
    borderRadius: hp('3%'), // Adjust the border radius using responsive percentage
    paddingRight: wp('1%'), // Adjust the paddingRight using responsive percentage
  },
  searchInput: {
    flex: 1,
    marginLeft: wp('5%'), // Adjust the margin using responsive percentage
    opacity: 1,
    fontSize: hp('2%'), // Adjust the font size using responsive percentage
  },
  filterButton: {
    backgroundColor: 'blue',
    padding: hp('1.5%'), // Adjust the padding using responsive percentage
    borderRadius: hp('1.5%'), // Adjust the border radius using responsive percentage
    alignItems: 'center',
    marginTop: hp('2%'), // Adjust the margin using responsive percentage
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: hp('2%'), // Adjust the font size using responsive percentage
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: hp('1%'), // Adjust the padding using responsive percentage
    borderRadius: hp('1%'), // Adjust the border radius using responsive percentage
    width: wp('100%'),
    marginBottom:wp('1%') // Adjust the width using responsive percentage
  },
  modalHeader: {
    fontSize: hp('2.5%'), // Adjust the font size using responsive percentage
    fontWeight: 'bold',
    marginBottom: hp('0.5%'), // Adjust the margin using responsive percentage
  },
  label: {
    fontSize: hp('2%'), // Adjust the font size using responsive percentage
    fontWeight: 'bold',
    marginBottom: hp('1%'), // Adjust the margin using responsive percentage
  },
  pickerContainer: {
    height: hp('5%'), // Adjust the height using responsive percentage
    marginBottom: hp('1.5%'), // Adjust the margin using responsive percentage
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: hp('1.5%'), // Adjust the border radius using responsive percentage
  },
  dropDown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: hp('1.5%'), // Adjust the border radius using responsive percentage
  },
  dateLabel: {
    fontSize: hp('2%'), // Adjust the font size using responsive percentage
    marginBottom: hp('1%'), // Adjust the margin using responsive percentage
    textDecorationLine: 'underline',
  },
  applyButton: {
    backgroundColor: 'blue',
    padding: hp('1.5%'), // Adjust the padding using responsive percentage
    borderRadius: hp('1.5%'), // Adjust the border radius using responsive percentage
    alignItems: 'center',
    marginTop: hp('2%'), // Adjust the margin using responsive percentage
  },
  ProfileIcon: {
    width: wp('10%'), // Adjust the width using responsive percentage
   marginLeft:wp('51%'),
    transform: [{ rotateY: '180deg' }],
  },
  applyButtonText: {
    color: '#fff',
    fontSize: hp('2%'), // Adjust the font size using responsive percentage
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: 'red',
    padding: hp('1.5%'), // Adjust the padding using responsive percentage
    borderRadius: hp('1.5%'), // Adjust the border radius using responsive percentage
    alignItems: 'center',
    marginTop: hp('2%'), // Adjust the margin using responsive percentage
  },
  resetButtonText: {
    color: '#fff',
    fontSize: hp('2%'), // Adjust the font size using responsive percentage
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: hp('0.5%'), // Adjust the margin using responsive percentage
    right: wp('3.5%'), // Adjust the margin using responsive percentage
    zIndex: 999,
  },
});

export default LeaveFilterComponent;


