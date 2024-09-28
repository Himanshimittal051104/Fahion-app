"use client"
import React, { createContext, useContext, useState } from 'react';

export const AddressesContext = createContext();

export const AddressesProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  
  return (
    <AddressesContext.Provider value={{ addresses, setAddresses }}>
      {children}
    </AddressesContext.Provider>
  );
};