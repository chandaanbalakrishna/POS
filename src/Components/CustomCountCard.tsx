import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
interface CustomCardProps {
  children: ReactNode;
  elevated?: boolean;
  style?: ViewStyle;
}

const CustomCountCard: React.FC<CustomCardProps> = ({ children, elevated = false, style }) => {
  const cardStyle = elevated ? [styles.card, styles.elevatedCard, style] : [styles.card, style];

  return <View style={cardStyle}>{children}</View>;
};

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//   },
//   elevatedCard: {
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
// });

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    padding: wp('3%'), 
    marginBottom: hp('2.5%'), 
  },
  elevatedCard: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp('0.5%') },
    shadowOpacity: 0.2,
    shadowRadius: hp('0.5%'), 
  },
});


export default CustomCountCard;
