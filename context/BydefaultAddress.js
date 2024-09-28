"use client"
import React, { createContext, useContext, useState } from 'react';

export const BydefaultAddressContext = createContext();

export const BydefaultAddressProvider = ({ children }) => {
  const [bydefaultAddress, setBydefaultAddress] = useState(0);
  
  return (
    <BydefaultAddressContext.Provider value={{ bydefaultAddress, setBydefaultAddress }}>
      {children}
    </BydefaultAddressContext.Provider>
  );
};