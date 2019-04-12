import React from 'react';

import { MapView, Location, Permissions, Constants } from "expo";

export default class HomeScreen extends React.Component {

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
  
    this.getZoomLevel(center);
    this.fetchMarkerData();
    this.props.onUpdate(center);
  }

  getZoomLevel(region) {
    let zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
    let precision = zoom / 2;
    if (precision > 8) {
      precision = 8;
    }    
    this.setState({
      precision: precision
    });
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
          
          if(marker.valueRange == "low"){
            return (
              <MapView.Circle
                  key={index}
                  center={coords}
                  radius = {this.radius}
                  strokeWidth = { 1 }
                  strokeColor = { 'blue' }
                  fillColor = {'blue'}
              />
            );
          }
          else if(marker.valueRange == "medium"){
            return (
              <MapView.Circle
                  key={index}
                  center={coords}
                  radius = {this.radius}
                  strokeWidth = { 1 }
                  strokeColor = { 'yellow' }
                  fillColor = {'yellow'}
              />
            );
          }
          else if(marker.valueRange == "high"){
            return (
              <MapView.Circle
                  key={index}
                  center={coords}
                  radius = {this.radius}
                  strokeWidth = { 1 }
                  strokeColor = {'red'}
                  fillColor = {'red'}
              />
            );
          }
        })}
      </MapView>
    );
  }
}

