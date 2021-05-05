import React, { useEffect, useState } from 'react';
import {
   StyleSheet,
   View,
   Text,
   Image,
   FlatList,
   Alert
} from 'react-native';
import { Header } from '../components/Header';
import { PlantProps, loadPlant, removePlant } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';
import { useNavigation } from '@react-navigation/core';

import waterdrop from '../assets/waterdrop.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function MyPlants(){
   // estado para plantas
   const [ myPlants, setMyPlants ] = useState<PlantProps[]>([]);

   // estado para regar
   const [ loading, setLoading ] = useState(true);
   const [ nextWaterd, setNextWaterd ] = useState<string>();

   // navegacao
   const navigation = useNavigation();

   function handleRemove(plant: PlantProps){
      Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
         {
            text: 'Não 🌵',
            style: 'cancel'
         },

         {
            text: 'Sim 🗑',
            onPress: async () => {
               try{
                  await removePlant(plant.id);
                  
                  setMyPlants((oldData) =>
                     oldData.filter((item) => item.id !== plant.id)
                  );
               }catch(error){ 
                  Alert.alert('Não foi possível remover! 😕');
               }
            }
         }
      ])
   }

   useEffect(() => {
      async function loadStorageData(){
         try{
            const plantsStoraged = await loadPlant();

            const nextTime = formatDistance( 
               new Date(plantsStoraged[0].dateTimeNotification).getTime(),
               new Date().getTime(),
               { locale: pt }
            );

            setNextWaterd(
               `Não esqueça de regar a ${plantsStoraged[0].name} em ${nextTime}.`
            )

            setMyPlants(plantsStoraged);
            setLoading(false);
         }catch{
            Alert.alert('Sem plantas cadastradas!');
            setLoading(false);         
         }
      }

      loadStorageData();
   }, [])

   // navagecao na planta
   function handlePlantSelect(plant: PlantProps){
      navigation.navigate('PlantSave', { plant });
   }

   if(loading)
      return <Load />

   return(
      <View style={ styles.container }>
         <Text style={ styles.greeting }>Minhas</Text>
         <Text style={ styles.plantinhas }>
            Plantinhas 
         </Text>

         <View style={ styles.spotlight }>
            <Image
               source={waterdrop}
               style={ styles.stoplightImage }
            />

            <Text style={ styles.spotlightText }>
               { nextWaterd ? nextWaterd : 'Você não tem plantas cadastradas!'}
            </Text>
         </View>

         <View style={ styles.plants }>
            <Text style={ styles.plantsTitle }>
               Próximas regadas
            </Text>

            <FlatList 
               data={myPlants}
               keyExtractor={(item) => String(item.id)}
               renderItem={({ item }) => (
                  <PlantCardSecondary 
                     data={item}
                     handleRemove={() => {handleRemove(item)}}
                     onPress={() => handlePlantSelect(item)}
                  />
               )}
               showsVerticalScrollIndicator={false}
            />
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingTop: 50,
      paddingHorizontal: 30,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.background,
   },

   greeting: {
      width: '100%',
      color: colors.heading,
      fontSize: 32,
      fontFamily: fonts.text,
   },

   plantinhas: {
      width: '100%',
      color: colors.heading,
      marginBottom: 25,
      fontSize: 32,
      lineHeight: 40,
      fontFamily: fonts.heading,
   },

   spotlight: {
      flexDirection: 'row',
      height: 110,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.blue_light,
   },

   stoplightImage:{
      width: 60,
      height: 60,
   },

   spotlightText: {
      flex: 1,
      color: colors.blue,
      paddingHorizontal: 15,
   },

   plants: {
      flex: 1,
      width: '100%',
   },
   
   plantsTitle: {
      color: colors.heading,
      marginVertical: 20,
      fontSize: 24,
      fontFamily: fonts.heading,
   }
});