import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default function Servicos() {
  return (
    <View style={[styles.container]}>
        <Text>SERVIÇOS</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});