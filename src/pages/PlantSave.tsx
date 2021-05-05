import React, { useState }from 'react';
import{
   Alert,
   StyleSheet,
   Text,
   View,
   Image,
   ScrollView,
   Platform,
   TouchableOpacity
} from 'react-native';
import { SvgFromUri } from 'react-native-svg';
import { getBottomSpace, getStatusBarHeight } from 'react-native-iphone-x-helper';
import { useNavigation, useRoute } from '@react-navigation/core';
import DatetimePicler, { Event } from '@react-native-community/datetimepicker';
import { format, isBefore } from 'date-fns';
import { PlantProps, savePlant } from '../libs/storage';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../components/Button';

import waterdrop from '../assets/waterdrop.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

// pegar detalhes da planta atraves da function handlePlantSelect de PlantSelect
interface Params{
   plant: PlantProps
}

export function PlantSave(){
   // data para lembrar de regar as plantas
   const [ selectedDateTime, setSelectedDateTime ] = useState(new Date());
   const [ showDatePicker, setShowDatePicker ] = useState(Platform.OS == 'ios');

   // receber informacoes das plantas
   const route = useRoute();
   const { plant } = route.params as Params; 

   const navigation = useNavigation();

   function handleChangeTime(event: Event, dateTime: Date | undefined){
      if(Platform.OS === 'android'){
         setShowDatePicker(oldState => !oldState);
      }

      // agendamentos futuros
      if(dateTime && isBefore(dateTime, new Date())){
         setSelectedDateTime(new Date());
         return Alert.alert('Escolha uma hora no futuro! ⏰');
      }

      if(dateTime)
         setSelectedDateTime(dateTime);
   }

   function handleOpenDateTimePickerForAndroid(){
      setShowDatePicker(oldState => !oldState);
   }

   async function handleSave(){
      try{
         await savePlant({
            ...plant,
            dateTimeNotification: selectedDateTime
         });

         navigation.navigate('Confirmation', {
            title: 'Tudo certo',
            subtitle: 'Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com bastante amor.',
            buttonTitle: 'Muito Obrigado :D',
            icon: 'hug',
            nextScreen: 'MyPlants',
         });
      }catch{
         Alert.alert('Não foi possível salvar. 😕');
      }
   }

   return(
      <ScrollView
         showsVerticalScrollIndicator={false}
         contentContainerStyle={ styles.container }
      >
         <View style={ styles.container }>
            <View style={styles.containerBack}>
                  <TouchableOpacity 
                     onPress={() => navigation.navigate("PlantSelect")}
                  >
                     <Ionicons 
                        name="chevron-back-outline" 
                        size={28} 
                        color="black" 
                     />
                  </TouchableOpacity>
            </View>
            
            <View style={ styles.plantInfo }>
               <SvgFromUri
                  uri={plant.photo}
                  height={130}
                  width={130}
               />

               <Text style={ styles.plantName }>
                  {plant.name}
               </Text>
               <Text style={ styles.plantAbout }>
                  {plant.about}
               </Text>
            </View>
            
            <View style={ styles.controller }>
               <View style={ styles.tipContainer }>
                  <Image
                     source={ waterdrop }
                     style={ styles.tipImage }
                  />

                  <Text style={ styles.tipText }>
                     {plant.water_tips}
                  </Text>
               </View>

               <Text style={ styles.alertLabel }>
                  Escolha o melhor horário para ser lembrado:
               </Text>

               {showDatePicker && (
                  <DatetimePicler
                     value={ selectedDateTime }
                     mode="time"
                     display="spinner"
                     onChange={ handleChangeTime }
                  />
               )}

               {
                  Platform.OS ==='android' && (
                     <TouchableOpacity 
                        style={ styles.dateTimePickerButton }
                        onPress={ handleOpenDateTimePickerForAndroid }
                     >
                        <Text style={ styles.dateTimePickerText }>
                           {`🕑 Alarme: ${format(selectedDateTime, 'HH:mm')}`}
                        </Text>
                     </TouchableOpacity>
                  )
               }

               <Button
                  title="Cadastrar planta"
                  onPress={ handleSave } // nao faz nada
               />

            </View>
         </View>
      </ScrollView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: colors.shape,
   },

   containerBack:{
      marginHorizontal: 20,
      marginTop: getStatusBarHeight() || 40,
      alignSelf:'flex-start',
      alignItems: 'center',
      borderRadius: 100,
      backgroundColor: colors.white
   },

   plantInfo: {
      flex: 1,
      paddingHorizontal: 30,
      paddingVertical: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.shape,
   },

   controller: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: getBottomSpace() || 20,
      backgroundColor: colors.white,
   },

   plantName: {
      color: colors.heading,
      marginTop: 15,
      fontSize: 24,
      fontFamily: fonts.heading,
   },

   plantAbout: {
      color: colors.heading,
      marginTop: 10,
      fontSize: 17,
      textAlign: 'center',
      fontFamily: fonts.text,
   },

   tipContainer: {
      flexDirection: 'row',
      padding: 20,
      position: 'relative',
      bottom: 70,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.blue_light,
   },

   tipImage: {
      width: 56,
      height: 56,
   },

   tipText: {
      color: colors.blue,
      flex: 1,
      marginLeft: 20,
      fontSize: 17,
      textAlign: 'left',
      fontFamily: fonts.text,
   },

   alertLabel: {
      color: colors.heading,
      marginBottom: 5,
      fontSize: 12,
      textAlign: 'center',
      fontFamily: fonts.complement,
   },

   dateTimePickerButton:{
      width: '100%',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 20,
      paddingVertical: 20,
      borderRadius: 12,
      backgroundColor: colors.green_light,
   },

   dateTimePickerText: {
      color: colors.heading,
      fontSize: 24,
      fontFamily: fonts.text,
   }
});