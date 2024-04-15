import React, { useState, useEffect} from 'react';
import { View, Text, Button, StyleSheet,Image,TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';

import { LastPointerContext } from '../store/context/lastPointer-context';

import { UserContext } from '../store/context/user-context';

const InitialScreen = ({ navigation }) => {
  const lastPointerCtx = useContext(LastPointerContext);
  const userContext = useContext(UserContext);
  
  const [highScore, setHighScore] = useState();

  const loadHighScore = async () => {
    try {
      const savedHighScore = await AsyncStorage.getItem('highScore');
      const currentHighScore = savedHighScore ? JSON.parse(savedHighScore) : 0;
      setHighScore(currentHighScore);

    } catch (error) {
      // Error retrieving data
      console.error("AsyncStorage error: ", error.message);
    }
  };

  const removeData = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadHighScore);
    loadHighScore();
  }, [navigation]);



  return (
    <View style={styles.container}>
      <Text style={styles.title}>High Score: {highScore}</Text>

      {lastPointerCtx.haveplayed && (
      <Text style={styles.title2}>Last Score: {lastPointerCtx.lastPoint}</Text>
      )}

      


      <Image
        source={require('../assets/images/main.png')} // Replace with the actual path to your image file
        style={styles.gameIcon}
      />
        <TouchableOpacity 
        style={styles.buttonStyle} 
        onPress={() => navigation.navigate('GameScreen', { highPoints: highScore })}>
            <Text style={styles.textStyle}>Play</Text>
        </TouchableOpacity>
        <Text style={styles.title}>criador: {userContext.user}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F8FA',
  },
  title: {
    fontSize: 42,
    marginBottom: 10,
    color: '#031F43', // Bluish color
    fontWeight: 'bold'
  },
  title2: {
    fontSize: 32,
    marginBottom: 20,
    color: '#031F43', // Bluish color
    fontWeight: 'bold'
  },
  gameIcon: {
    width: 300, // Set the width of your image
    height: 300, // Set the height of your image
    resizeMode: 'contain', // or 'cover', 'stretch', etc.
    marginBottom: 10,
  },
  buttonStyle: {
    backgroundColor: '#1C005A', // Replace with the appropriate color
    paddingHorizontal: 30, // Horizontal padding
    paddingVertical: 10, // Vertical padding
    borderRadius: 30, // Adjust to match the rounded corners
    shadowColor: '#000', // Shadow Color
    shadowOffset: {
      width: 5, // Horizontal shadow offset
      height: 2, // Vertical shadow offset
    },
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 5, // Shadow blur radius
    elevation: 5, // Elevation for Android
    alignItems: 'center', // Center the text inside the button
    justifyContent: 'center', // Center the text vertically
    marginBottom: 80
  },
  textStyle: {
    color: '#FFF', // Text color
    fontSize: 18, // Text size
    fontWeight: 'bold', // Text weight
  },
});

export default InitialScreen;
