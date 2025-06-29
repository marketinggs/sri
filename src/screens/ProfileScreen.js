import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const colors = {
  primary: '#FFDB01',
  background: '#1D1D1D',
  text: '#FFFFFF'
};

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.text}>John Doe</Text>
      <Text style={styles.text}>johndoe@example.com</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20
  },
  text: {
    color: colors.text,
    marginBottom: 5
  }
});
