import React, { useEffect, useState } from 'react';
import { 
   View, 
   Text,
   StyleSheet,
   FlatList, // renderizar listas
   ActivityIndicator
} from 'react-native';
import { EnviromentButton } from '../components/EnviromentButton';
import { useNavigation } from '@react-navigation/core';

import { Header } from '../components/Header';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Load } from '../components/Load';
import { PlantProps } from '../libs/storage';

import api from '../services/api';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnviromentProps{
   key: string;
   title: string;
}

export function PlantSelect(){
   const [ enviroments, setEnviroments ] = useState<EnviromentProps[]>([]);

   // plantas e filtro
   const [ plants, setPlants ] = useState<PlantProps[]>([]);
   const [ filteredPlants, setFilteredPlants ] = useState<PlantProps[]>([]); // auxiliar (para nao ficar fazendo requisicoes sempre na api)
   const [ enviromentsSelected, setEnviromentsSelected ] = useState('all');
   const [ loading, setLoading ] = useState(true); // carregamento das plantas

   // paginacao
   const [ page, setPage ] = useState(1);
   const [ loadingMore, setLoadingMore ] = useState(false);

   const navigation = useNavigation();

   function handleEnviromentSelected(enviroment: string){
      setEnviromentsSelected(enviroment);

      if(enviroment == 'all')
         return setFilteredPlants(plants);

      const filtered = plants.filter(plant =>
         plant.environments.includes(enviroment)
      );

      setFilteredPlants(filtered);
   }

   async function fetchPlants(){
      const{ data } = await api
      .get(`plants?_sort=name&order=asc&_page=${page}$_limit=8`);

      if(!data)
         return setLoading(true);
      
      if(page > 1){
         setPlants(oldValue => [ ...oldValue, ...data ])
         setFilteredPlants(oldValue => [ ...oldValue, ...data ])
      }else {
         setPlants(data);
         setFilteredPlants(data);
      }         

      setLoading(false);
      setLoadingMore(false);
   }

   function handleFetchMore(distance: number){
      if(distance < 1)
         return;
      
         setLoadingMore(true);
         setPage(oldValue => oldValue + 1);
         fetchPlants();
   }

   // navagecao na planta
   function handlePlantSelect(plant: PlantProps){
      navigation.navigate('PlantSave', { plant });
   }

   useEffect(() => { // carrega antes da tela ser carregada
      async function fetchEnviroment(){
         const{ data } = await api.get('plants_environments?_sort=title&_order=asc');
         setEnviroments([
            {
               key: 'all',
               title: 'Todos',
            },
            ... data
         ]);
      }

      fetchEnviroment();
   },[])

   useEffect(() => {
      fetchPlants();
   },[])

   if(loading)
      return <Load/>

   return(
      <View style={ styles.container }>
         <View style={ styles.header }>
            <Header/>
            <Text style={ styles.title }>
               Em qual ambiente
            </Text>
            <Text style={ styles.subtitle }>
               você quer colocar sua planta?
            </Text>
         </View>
         
         <View>
            <FlatList
               data={enviroments}
               keyExtractor={(item) => String(item.key)} //vai extrair do item a chave
               renderItem={({ item }) => (
                  <EnviromentButton 
                     title={item.title}
                     active={item.key === enviromentsSelected}
                     onPress={() => handleEnviromentSelected(item.key)}
                  />
               )}
               horizontal // lista horizontal
               showsHorizontalScrollIndicator={false} // retirar scroll visual
               contentContainerStyle={ styles.enviromentList } // estilizar a lista
               ListHeaderComponent={<View />} // visualizar
               ListHeaderComponentStyle={{ marginRight: 32 }} // margin nao funciona muito bem com listas no style
            />
         </View>

         <View style={ styles.plants }>
            <FlatList
               data={filteredPlants}
               keyExtractor={(item) => String(item.id)} 
               renderItem={({ item }) => (
                  <PlantCardPrimary 
                     data={item}
                     onPress={() => handlePlantSelect(item)}
                  />
               )}
               numColumns={2} // lista com duas colunas
               showsVerticalScrollIndicator={false}
               onEndReachedThreshold={0.1}
               onEndReached={({ distanceFromEnd }) => 
                  handleFetchMore(distanceFromEnd)
               } 
               ListFooterComponent={
                  loadingMore ? <ActivityIndicator color={colors.green}/> : <></>
               }
            />
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.background
   },

   header: {
      paddingHorizontal: 30
   },

   title: {
      color: colors.heading,
      marginTop: 15,
      fontSize: 17,
      lineHeight: 20,
      fontFamily: fonts.heading,
   },

   subtitle: {
      color: colors.heading,
      fontSize: 17,
      lineHeight: 20,
      fontFamily: fonts.text,
   },

   enviromentList: {
      height: 40,
      marginVertical: 32,
      justifyContent: 'center',
   },

   // Cards
   plants: {
      flex: 1,
      paddingHorizontal: 32,
      justifyContent: 'center',
   },
});  