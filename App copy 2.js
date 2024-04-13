import React, { useState, useEffect,useRef   } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity,Text,Alert } from 'react-native';

// version everything inside tick
const App = () => {
  const numRows = 5;
  const numColumns = 3;
  // Create a state to track the active squares
  const [activeSquares, setActiveSquares] = useState({});
  const [points, setPoints] = useState(0);

  //const updateInterval = 1000; // Update every 500ms (2 times per second)
  //const [updateInterval, setUpdateInterval] = useState(1000);
  const updateInterval = 1000;
  let lastUpdateTime = useRef(Date.now());
  let decrement = useRef(0); 
  let lostRef = useRef(false);
  let workingType = 'prod' //prod or dev 

  //
  const tick = () => {
    const now = Date.now();
    if (now - lastUpdateTime.current >= updateInterval) {

        if(workingType != 'dev')
        //decrement.current = Math.min(900, decrement.current + 10);
        lastUpdateTime.current = now - decrement.current;
        
      if(!lostRef.current || workingType == 'dev'){
            const row = Math.floor(Math.random() * numRows);
            const col = Math.floor(Math.random() * numColumns);
            const key = `${row}-${col}`;

        setActiveSquares(prevActiveSquares => {
          const newActiveSquares = { ...prevActiveSquares, [key]: true };
          
          // Check for game over condition
          const activeCount = Object.values(newActiveSquares).filter(val => val).length;
          if (activeCount > 1) {
            // Game over logic
            if(workingType != 'dev') {
              // Trigger game over actions
              lostRef.current = true;
              Alert.alert("Game Over", "You lose! Try again?", [
                { 
                  text: "Yes",
                  onPress:  () => {
                    lostRef.current= false;
                    setActiveSquares({});
                    decrement.current = 0;
                    setPoints(0);
                  }
                }]);
            }
            return prevActiveSquares; // Keep the state as is if game is over
          }
          
          return newActiveSquares;
        });
      }
    }
    requestAnimationFrame(tick);
  };

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);
  //


  /*
  useEffect(() => {
    
    const count = Object.values(activeSquares).filter(value => value).length;
    if (count > 1) {
      if(workingType != 'dev'){
        Alert.alert(
          "Game Over",
          "You lose! Try again?",
          [
            { 
              text: "Yes", 
              onPress: () => {
                lostRef.current= false;
                setActiveSquares({});
                decrement.current = 0;
                setPoints(0);
              }
            }
          ],
          { cancelable: false }
        );
      }
      
      lostRef.current= true;
    }
  }, [activeSquares]);
  */

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
    <>
      <View style={styles.newView}>
        
        <Text>My name  {lastUpdateTime.current}</Text>
        <Text >points: {points}</Text>
      </View>
      <View style={styles.container}>
        {Array.from({ length: numRows }, (_, row) => renderRow(row))}
      </View>
    </>
  );
};

const squareSize = Dimensions.get('window').width / 3;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    width: squareSize,
    height: squareSize,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
  },
  activeSquare: {
    backgroundColor: 'red',
  },
  newView: {
    height: screenHeight * 0.1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Example background color
  },
});

export default App;