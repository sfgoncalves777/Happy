import React, { useEffect, useState } from 'react';
import { Image, View, ScrollView, Text, TouchableOpacity, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';

import mapMarkerImg from '../../images/map-marker.png';

import api from '../../services/api';
import styles from './style';

interface Params {
  id: number;
}

interface Orphanage {
  id: number;
  name: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images: [{
    id: number;
    url: string;
  }];
}

const OrphanageDetails: React.FC = () => {
  const [orphanage, setOrphanage] = useState<Orphanage>();
  const route = useRoute();

  const { id } = route.params as Params;

  useEffect(() => {
    api
      .get(`/orphanages/${id}`)
      .then(response => setOrphanage(response.data));
  }, [id])

  if (!orphanage) {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>Carregando...</Text>
      </View>
    )
  }

  function handleOpenMaps () {
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${orphanage?.latitude},${orphanage?.longitude}`)
  }

  function handleWhatsapp(){
    Linking.openURL(`whatsapp://send?phone=${orphanage?.whatsapp}&text=Tenho interesse sobre coleta de resíduo `);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imagesContainer}>
        <ScrollView horizontal pagingEnabled>
          {
            orphanage.images.map(image => (
              <Image 
                key={image.id}
                style={styles.image}
                source={{ uri: image.url }} 
              />
            ))
          }
        </ScrollView>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{orphanage.name}</Text>
        <Text style={styles.description}>{orphanage.about}</Text>
      
        <View style={styles.mapContainer}>
          <MapView 
            initialRegion={{
              latitude: orphanage.latitude,
              longitude: orphanage.longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }} 
            zoomEnabled={false}
            pitchEnabled={false}
            scrollEnabled={false}
            rotateEnabled={false}
            style={styles.mapStyle}
          >
            <Marker 
              icon={mapMarkerImg}
              coordinate={{ 
                latitude: orphanage.latitude,
                longitude: orphanage.longitude
              }}
            />
          </MapView>

          <TouchableOpacity onPress={handleOpenMaps} style={styles.routesContainer}>
            <Text style={styles.routesText}>Ver rotas no Google Maps</Text>
          </TouchableOpacity>
        </View>
      
        <View style={styles.separator} />

        <Text style={styles.title}>Instruções para visita</Text>
        <Text style={styles.description}>{orphanage.instructions}</Text>

        <View style={styles.scheduleContainer}>
          <View style={[styles.scheduleItem, styles.scheduleItemBlue]}>
            <Feather name="clock" size={40} color="#2AB5D1" />
            <Text style={[styles.scheduleText, styles.scheduleTextBlue]}>Segunda à Sexta {orphanage.opening_hours}</Text>
          </View>

          {
            orphanage.open_on_weekends ? (
              <View style={[styles.scheduleItem, styles.scheduleItemGreen]}>
                <Feather name="info" size={40} color="#39CC83" />
                <Text style={[styles.scheduleText, styles.scheduleTextGreen]}>Atendemos fim de semana</Text>
              </View>
            ) : (
              <View style={[styles.scheduleItem, styles.scheduleItemRed]}>
                <Feather name="info" size={40} color="#FF669D" />
                <Text style={[styles.scheduleText, styles.scheduleTextRed]}>Não atendemos fim de semana</Text>
              </View>
            )
          }
        </View>

        <RectButton style={styles.contactButton} onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={24} color="#FFF" />
          <Text style={styles.contactButtonText}>Entrar em contato</Text>
        </RectButton>
      </View>
    </ScrollView>
  )
}

export default OrphanageDetails;