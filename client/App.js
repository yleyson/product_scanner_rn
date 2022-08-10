import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppState, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NavigationComp from './Routs/NavigationComp';
import UserContextProvider from './Context/UserContext';



export default function App() {


  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="gray" barStyle="light-content" />
      <UserContextProvider>
        <NavigationComp />
      </UserContextProvider>
    </SafeAreaProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  },
});


