import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import { MapView } from "expo";

export default class HomeScreen extends React.Component {

  values = [];
  min_value = 0;
  max_value = 0;
  avg1_value = 0;
  avg2_value = 0;
  avg3_value = 0;
  avg4_value = 0;
  radius = 300;

  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      markers: [],
      region: {
        latitude: 43.85350367054343,
        longitude: -79.48147913441062,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    };
  }

  fetchMarkerData() {
    
    fetch('https://gsqztydwpe.execute-api.us-east-1.amazonaws.com/latest/geoHash', {
      method: "post",
      headers: {
          "Content-type": "application/json",
          "Accept": "application/json",
      },
      body: JSON.stringify({
          "timestampMs": {
              "from": 1239065720835,
              "to": 1870217733565
            },
            "boundary": {
              "topLeft": {
                "lat": this.state.region.latitude + this.state.region.latitudeDelta / 2,
                "lon": this.state.region.longitude - this.state.region.longitudeDelta / 2
              },
              "bottomRight": {
                "lat": this.state.region.latitude - this.state.region.latitudeDelta / 2,
                "lon": this.state.region.longitude + this.state.region.longitudeDelta / 2         
              }
            },
            "precision": 5,
            "timeoutMs": 30000
      })
    })
    .then(response => response.json())
    .then(data => {
      this.setState({
        isLoading: false,
        markers: data
      });
      data.forEach(item => {
        this.values.push(item.value);
      });
      this.min_value = Math.min.apply(null, this.values);
      this.max_value = Math.max.apply(null, this.values);
      this.avg1_value = this.min_value + (this.max_value - this.min_value) / 5;
      this.avg2_value = this.min_value + (this.max_value - this.min_value) / 5 * 2;
      this.avg3_value = this.min_value + (this.max_value - this.min_value) / 5 * 3;
      this.avg4_value = this.min_value + (this.max_value - this.min_value) / 5 * 4;
    })
    .catch(error => console.error(error))
  }

  componentDidMount() {
    this.fetchMarkerData();
  }

  onMapRegionChange(center){
    this.setState({
      region: center
    });
    this.fetchMarkerData();
  }

  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        region={this.state.region}
        onRegionChangeComplete={this.onMapRegionChange.bind(this)}
      >
        {this.state.isLoading ? null : this.state.markers.map((marker, index) => {
          const coords = {
            latitude: marker.location.lat,
            longitude: marker.location.lon
          };
          if((this.min_value <= marker.value) && (marker.value <= this.avg1_value)){
            return (
              <MapView.Circle
                  key={index}
                  center={coords}
                  radius = {this.radius}
                  strokeWidth = { 1 }
                  strokeColor = { 'rgb(57, 198, 57)' }
                  fillColor = {'rgba(57, 198, 57, 0.5)'}
              />
            );
          }
          if((this.avg1_value <= marker.value) && (marker.value <= this.avg2_value)){
            return (
              <MapView.Circle
                  key={index}
                  center={coords}
                  radius = {this.radius}
                  strokeWidth = { 1 }
                  strokeColor = { 'rgb(255, 230, 153)' }
                  fillColor = {'rgba(255, 230, 153, 0.5)'}
              />
            );
          }
          if((this.avg2_value <= marker.value) && (marker.value <= this.avg3_value)){
            return (
              <MapView.Circle
                  key={index}
                  center={coords}
                  radius = {this.radius}
                  strokeWidth = { 1 }
                  strokeColor = { 'rgb(255, 191, 0)' }
                  fillColor = {'rgba(255, 191, 0, 0.5)'}
              />
            );
          }
          if((this.avg3_value <= marker.value) && (marker.value <= this.avg4_value)){
            return (
              <MapView.Circle
                  key={index}
                  center={coords}
                  radius = {this.radius}
                  strokeWidth = { 1 }
                  strokeColor = { 'rgb(255, 51, 0)' }
                  fillColor = {'rgba(255, 51, 0, 0.5)'}
              />
            );
          }
          if((this.avg4_value <= marker.value) && (marker.value <= this.max_value)){
            return (
              <MapView.Circle
                  key={index}
                  center={coords}
                  radius = {this.radius}
                  strokeWidth = { 1 }
                  strokeColor = { 'rgb(204, 0, 0)' }
                  fillColor = {'rgba(204, 0, 0, 0.5)'}
              />
            );
          }
        })}
      </MapView>
    );
  }
}

