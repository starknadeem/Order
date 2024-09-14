import React, { createContext, useState } from 'react';

// Create the context
export const MyContext = createContext();

// Provide the context
export const MyContextProvider = ({ children }) => {
    const [isactive, setIsactive] = useState(true); // Sidebar visibility state

    return (
        <MyContext.Provider value={{ isactive, setIsactive }}>
            {children}
        </MyContext.Provider>
    );
};
