import React from 'react';
import {
   StyleSheet, 
   Text, 
   View,
   Animated,
} from 'react-native';
import { RectButton, RectButtonProps} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { SvgFromUri } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface PlantProps extends RectButtonProps{
   data: {
      name: string;
      photo: string;
      hour: string;
   }

   handleRemove: () => void;
}

export const PlantCardSecondary = ({ data, handleRemove, ... rest } : PlantProps) => {
   return(
      <Swipeable
         overshootRight={false}
         renderRightActions={() => (
            <Animated.View>
               <View>
                  <RectButton
                     style={ styles.buttonRemove }
                     onPress={ handleRemove }
                  >
                     <Feather
                        name="trash"
                        size={24}   
                        color={ colors.white }
                     />
                  </RectButton>
               </View>
            </Animated.View>
         )}
      >
         <RectButton
            style={ styles.container}
            { ... rest }
         >
            <SvgFromUri
               uri={data.photo}
               width={55}
               height={55}
            />
            <Text style={ styles.title}>
               {data.name}
            </Text>
            <View style={ styles.details }>
               <Text style={ styles.timeLabel }>
                  Regar às
               </Text>
               <Text style={ styles.time }>
                  {data.hour}
               </Text>
            </View>
         </RectButton>
      </Swipeable>
   )
}

const styles = StyleSheet.create({
   container: {
      flexDirection: 'row',
      width: '100%',

      paddingHorizontal: 10,
      paddingVertical: 25,      
      marginVertical: 5,
      borderRadius: 20,

      alignItems: 'center',
      backgroundColor: colors.shape,
   },

   title: {
      color: colors.heading,
      flex: 1,
      marginLeft: 10,
      fontSize: 17,
      fontFamily: fonts.heading,
   },

   details: {
      alignItems: 'flex-end',
   },

   timeLabel: {
      color: colors.body_light,
      fontSize: 16,
      fontFamily: fonts.text,
   },

   time: {
      color: colors.body_dark,
      marginTop: 5,
      fontSize: 16,
      fontFamily: fonts.heading,
   },

   buttonRemove: {
      width: 100,
      height: 103,
      position: 'relative',
      right: 20,

      paddingLeft: 15,
      marginTop: 6,
      borderRadius: 15,

      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.red,
   },
});

