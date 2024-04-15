import React, { createContext, useContext, useState } from 'react';

// Create the User context with default values
export const UserContext = createContext({
    user: 'Lorion',
    isAuthenticated: false,
    setUser: () => {},
    setAuthStatus: () => {}
});

function UserContextProvider({ children }) {
    const [user, setUser] = useState('Lorion');
    const [isAuthenticated, setAuthStatus] = useState(false);

    // Function to update the user state
    const updateUser = (newUser) => {
        setUser(newUser);
    };

    // Function to update the authentication status
    const updateAuthStatus = (status) => {
        setAuthStatus(status);
    };

    // The value object to be passed to the provider
    const value = {
        user: user,
        isAuthenticated: isAuthenticated,
        setUser: updateUser,
        setAuthStatus: updateAuthStatus
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;