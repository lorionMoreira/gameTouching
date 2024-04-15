import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InitialScreen from './screens/InitialScreen'; // Import your initial screen
import GameScreen from './screens/GameScreen'; 
import LastPointerContextProvider from './store/context/lastPointer-context';
import UserContextProvider from './store/context/user-context';
const Stack = createNativeStackNavigator();

// version tick with useeffect;
const App = () => {
  return (
    <UserContextProvider>
      <LastPointerContextProvider>
        <NavigationContainer>
          <Stack.Navigator 
          initialRouteName="Initial">
            <Stack.Screen name="Initial"
            component={InitialScreen} 
            options={{ headerShown: false }}
            />
            <Stack.Screen name="GameScreen" 
            component={GameScreen}
            options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </LastPointerContextProvider>
    </UserContextProvider>
  );
};



export default App;