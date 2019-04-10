import React from 'react';

import { MapView, Location, Permissions, Constants } from "expo";

export default class HomeScreen extends React.Component {

  values = [];
  min_value = 0;
  max_value = 0;
  avg1_value = 0;
  avg2_value = 0;
  avg3_value = 0;
  avg4_value = 0;
  radius = 250;
  old_latitudeDelta = 0;
  new_latitudeDelta = 0.0922;

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
      },
      precision: 6,
    };
  }

  componentDidMount() {
    // this._getLocationAsync();
    this.fetchMarkerData();
  }

  // Get user current location
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
        location,
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    
    this.setState({ 
      region: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      } 
    });
    // this.fetchMarkerData();
  };

  // Get marker data from server and fetch marker data
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
            "precision": this.state.precision,
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

  //When google map region change, get changed google map region information
  onMapRegionChange(center){
    this.setState({
      region: center
    });
    this.old_latitudeDelta = this.new_latitudeDelta;
    this.new_latitudeDelta = this.state.region.latitudeDelta;
    this.radius = this.new_latitudeDelta / this.old_latitudeDelta * this.radius; 
    if((this.state.region.latitudeDelta >= 0.09) && (this.state.region.latitudeDelta <= 150)){
      this.setState({
        precision: 6
      });
    }
    else if((this.state.region.latitudeDelta >= 0.01) && (this.state.region.latitudeDelta <= 0.09)){
      this.setState({
        precision: 5
      });
    }
    else{
      this.setState({
        precision: 4
      });
    }
    this.fetchMarkerData();
    this.props.onUpdate(center);
  }

  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        region={this.state.region}
        showsUserLocation={true}
        onRegionChangeComplete={this.onMapRegionChange.bind(this)}
      >
        {this.state.isLoading ? null : this.state.markers.map((marker, index) => {
          const coords = {
            latitude: marker.location.lat,
            longitude: marker.location.lon
          };

          // apply different colors based on values
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
          else if((this.avg1_value <= marker.value) && (marker.value <= this.avg2_value)){
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
          else if((this.avg2_value <= marker.value) && (marker.value <= this.avg3_value)){
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
          else if((this.avg3_value <= marker.value) && (marker.value <= this.avg4_value)){
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
          else if((this.avg4_value <= marker.value) && (marker.value <= this.max_value)){
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

