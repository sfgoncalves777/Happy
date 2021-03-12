import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { MapEvent, Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import mapMarkerImg from '../../../images/map-marker.png';

import styles from './style';

const SelectMapPosition: React.FC = () => {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const navigation = useNavigation();

  useEffect(() => {
    async function loadPosition(){
      const { status } = await Location.requestPermissionsAsync();

      if (status !== "granted"){
        Alert.alert('Oooops', 'Precisamos de sua permição para obter localização');
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      setInitialPosition([latitude, longitude]);
    }

    loadPosition();

  }, [])

  function handleSelectMapPosition(event: MapEvent) {
    setPosition(event.nativeEvent.coordinate);
  }

  function handleNextStep() {
    navigation.navigate('OrphanageData', {position});
  }

  return (
    <View style={styles.container}>
      <MapView 
        initialRegion={{
          latitude: initialPosition[0],
          longitude: initialPosition[1],
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        style={styles.mapStyle}
        onPress={handleSelectMapPosition}
      >
        {
          position.latitude != 0 && (
            <Marker 
              icon={mapMarkerImg}
              coordinate={{ latitude: position.latitude, longitude: position.longitude, }}
            />
          )
        }
      </MapView>

      {
        position.latitude != 0 && (
          <RectButton style={styles.nextButton} onPress={handleNextStep}>
            <Text style={styles.nextButtonText}>Próximo</Text>
          </RectButton>
        )
      }
    </View>
  )
}

export default SelectMapPosition;