import { createContext, useState } from 'react';

export const LastPointerContext = createContext({
    lastPoint: 0,
    haveplayed: false,
    setUserPoints: () => {} ,
    setHavePlayed: () => {}
  });
  
  function LastPointerContextProvider({ children }) {

    const [state, setState] = useState({
        lastPoint: 0, // Initial user points
        haveplayed: false,
      });
  
      const setUserPoints = (points) => {
        setState(prevState => ({
          ...prevState,
          lastPoint: points 
        }));
      };

      const setHavePlayed = (value) => {
        setState(prevState => ({
          ...prevState,
          haveplayed: value 
        }));
      };

        const value = {
            lastPoint: state.lastPoint,
            haveplayed: state.haveplayed,
            setUserPoints: setUserPoints,
            setHavePlayed: setHavePlayed,
        };
  
    return (
      <LastPointerContext.Provider value={value}>
        {children}
      </LastPointerContext.Provider>
    );
  }
  
  export default LastPointerContextProvider;