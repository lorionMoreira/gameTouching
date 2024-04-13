import React, { useState, useEffect,useRef   } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity,Text,Alert, StatusBar   } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient'
import { useContext } from 'react';

import { LastPointerContext } from '../store/context/lastPointer-context';

const GameScreen = ({  route,navigation }) => {
  const lastPointerCtx = useContext(LastPointerContext);

    const numRows = 5;
    const numColumns = 3;
    // Create a state to track the active squares
    const [activeSquares, setActiveSquares] = useState({});
    const [points, setPoints] = useState(0);
    const [highpoints, setHighpoints] = useState(0);
    const [paused, setPaused] = useState(false);
  
    //const updateInterval = 1000; // Update every 500ms (2 times per second)
    //const [updateInterval, setUpdateInterval] = useState(1000);
    const updateInterval = 1000;
    let lastUpdateTime = useRef(Date.now());
    let decrement = useRef(0); 
    let lostRef = useRef(false); // jogo perdido
    //let pausedRef = useRef(false);
    let workingType = 'prod' //prod or dev 
  
    //
    const tick = () => {

      
        const now = Date.now();
        if (now - lastUpdateTime.current >= updateInterval) {
    
          if(workingType != 'dev' && lostRef.current ==false )
          decrement.current = Math.min(900, decrement.current + 10);
          lastUpdateTime.current = now - decrement.current;
          
          if(!lostRef.current || workingType == 'dev'){
              const row = Math.floor(Math.random() * numRows);
              const col = Math.floor(Math.random() * numColumns);
              const key = `${row}-${col}`;
              setActiveSquares(prevActiveSquares => ({
                ...prevActiveSquares,
                [key]: true
            }));
          }
          //setUpdateInterval(prevInterval => Math.max(100, prevInterval * 0.9)); // Decrease interval over time
        }
      

      requestAnimationFrame(tick);
    };
  
    useEffect(() => {
      const updatedPoints = route.params?.highPoints;
      setHighpoints(updatedPoints);
      
    }, []);

    useEffect(() => {
      const animationFrameId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(animationFrameId);
    }, []);

    //

    const savePoints = async (newPoints) => {
      try {

        const highScore = await AsyncStorage.getItem('highScore');
        const currentHighScore = highScore ? JSON.parse(highScore) : 0;
        if (newPoints > currentHighScore) {
          // Only save if new points are higher than the high score
          await AsyncStorage.setItem('highScore', JSON.stringify(newPoints));
        }
        lastPointerCtx.setHavePlayed(true);
        lastPointerCtx.setUserPoints(newPoints);
        console.log(newPoints);
        console.log(highScore);
        console.log(lastPointerCtx.lastPoint);
      } catch (error) {
        // Error saving data
        console.error("AsyncStorage error: ", error.message);
      }
    };

    useEffect(() => {
      
      const count = Object.values(activeSquares).filter(value => value).length;
      if (count > 1) {
        if(workingType != 'dev'){
          Alert.alert(
            "Game Over",
            `Your score was ${points} points ! Try again?`,
            [
              { 
                text: "Yes", 
                onPress: () => {
                  lostRef.current= false;
                  setActiveSquares({});
                  decrement.current = 0;
                  savePoints(points);
                  setPoints(0);
                }
              },
              { 
                text: "No", 
                onPress: async () => {
                  //await navigation.navigate('Initial');
                   await savePoints(points);
                   navigation.navigate('Initial', { updatedPoints: points });

                }
              },
            ],
            { cancelable: false }
          );
        }
        
        lostRef.current= true;
      }
    }, [activeSquares]);

    const handleAlertPress = () => {
      
      lostRef.current= true;
      Alert.alert(
        "Paused",
        "Game is paused.",
        [
          { 
            text: "Continue", 
            onPress: () => {
              lostRef.current= false;
 
              //setActiveSquares({});
              //decrement.current = 0;
              //setPoints(0);
            }
          },
          { 
            text: "Abort", 
            onPress: () => {
              navigation.navigate('Initial')
            }
          },
        ],
        { cancelable: false }
      );
    };
  
    const toggleSquare = (row, col) => {
      const key = `${row}-${col}`;
  
      if (activeSquares[key]) {
        setPoints(prevPoints => prevPoints + 1); // Increment points for correct click
      } else {
        // Handle click on inactive square if needed
      }
  
      setActiveSquares(prev => 
        ({ 
          ...prev, 
          [key]: !prev[key] // se undefined fica true , se true fica falso
        }));
    };
  
    const renderSquare = (row, col) => {// aqio faz a criacao e e mapeia sendo row passado e col mapeado
      const isActive = activeSquares[`${row}-${col}`];// na primeira vez é falso
      return (
        <TouchableOpacity 
          key={`${row}-${col}`} // logo vai ser apenas styles square
          style={[styles.square, isActive && styles.activeSquare]} 
          onPress={() => toggleSquare(row, col)}
        />
      );
    };
  
    const renderRow = (row) => {// aqio faz a criacao e e mapeia sendo row passado e col mapeado
      return (
        <View key={row} style={styles.row}>
          {Array.from({ length: numColumns }, (_, col) => renderSquare(row, col))}
        </View>
      );
    };
  
    return (// aqio faz a criacao e e mapeia sendo row = 0 ,1,2,3,4,5
    <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="black" /> 

        <View style={styles.gameGrid}>
          {Array.from({ length: numRows }, (_, row) => renderRow(row))}
        </View>

        <View style={styles.footer}>
            {/*<Text style={styles.points}>{lastUpdateTime.current}</Text>*/}
            <View style={styles.subfooter}>
                <View style={styles.dropdownLeft}>
                    <Text style={styles.points}>Higher Points: {highpoints}</Text>
                </View>
            </View>
            <View style={styles.subfooter}>
                <TouchableOpacity 
                    style={styles.buttonStyle} 
                    onPress={handleAlertPress}>
                    <Text style={styles.textStyle}>II</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.subfooter}>
            <View style={styles.dropdownRight}>
                    <Text style={styles.points}>Points: {points}</Text>
                </View>
            </View>
        </View>
    </View>
    );
};

const squareSize = Dimensions.get('window').width / 3;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        alignItems: 'center',
        backgroundColor: '#85C6FD', // Assuming a white background
      },
      gameGrid: {
      width: '90%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#85C6FD'
    },
    row: {
      flexDirection: 'row',
    },
    square : {
      width: '33%',
      height: squareSize,
      borderWidth: 1,
      borderColor: 'black',
      backgroundColor: 'white',
    },
    activeSquare: {
      backgroundColor: 'red',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%', // Footer takes full width
        alignItems: 'center', // Center footer content horizontally
        padding: 16, // Add padding for footer content
        backgroundColor: '#85C6FD', // Example background color for the footer
      },
      subfooter: {
        width: '33%', 
        justifyContent: 'center',
        alignItems: 'center',
      },
      dropdownLeft: {
        borderWidth: 3, // Set the border width
        borderColor: 'black', // Set the border color
        borderTopRightRadius: 10, // Only round the top-right corner
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 10,
        flexDirection: 'row', // Align the text and icon in a row
        alignItems: 'center', // Center items vertically
        justifyContent: 'space-between', // Place the text on one side and the icon on the other
        padding: 8, // Inner spacing between border and content
        backgroundColor: '#FFF', // If you have a specific background color
        maxWidth: 120,
        minWidth: 120,
      },
      dropdownRight: {
        borderWidth: 3, // Set the border width
        borderColor: 'black', // Set the border color
        borderTopRightRadius: 0, // Only round the top-right corner
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 0,
        flexDirection: 'row', // Align the text and icon in a row
        alignItems: 'center', // Center items vertically
        justifyContent: 'space-between', // Place the text on one side and the icon on the other
        padding: 8, // Inner spacing between border and content
        backgroundColor: '#FFF', // If you have a specific background color
        maxWidth: 120,
        minWidth: 120,
        maxHeight:63.2,
        minHeight:63.2
      },
      points: {
        fontSize: 16,
        fontWeight: '500',
        color: 'black'
      },
      buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 70, // Diameter of the circle
        height: 70, // Diameter of the circle
        paddingVertical: 10, // Adjust the vertical padding as needed
        paddingHorizontal: 20, // Adjust the horizontal padding as needed
        backgroundColor: '#FEA737', // Background color for the button
        borderRadius: 20, // Half the width/height to create a circle shape
        borderWidth:2,
        borderColor: 'black',
        elevation: 2, // Optional, for Android shadow
        shadowColor: '#000', // Optional, for iOS shadow
        shadowOffset: { width: 0, height: 2 }, // Optional, for iOS shadow
        shadowRadius: 4, // Optional, for iOS shadow
        shadowOpacity: 0.3, // Optional, for iOS shadow
      },
      textStyle: {
        color: 'black', // Text color
        fontSize: 18, // Text size
        fontWeight: 'bold', // Text weight
      },
  });

export default GameScreen;