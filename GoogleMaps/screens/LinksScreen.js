import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

  render() {
    const result = this.props.searchValue;
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{fontSize:20,fontWeight:'bold'}}>latitude: {JSON.stringify(result.latitude)}</Text>
        <Text style={{fontSize:20,fontWeight:'bold'}}>longitude: {JSON.stringify(result.longitude)}</Text>
        <Text style={{fontSize:20,fontWeight:'bold'}}>latitudeDelta: {JSON.stringify(result.latitudeDelta)}</Text>
        <Text style={{fontSize:20,fontWeight:'bold'}}>longitudeDelta: {JSON.stringify(result.longitudeDelta)}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
