import React, { createContext, useState, useContext } from 'react';

const RegionContext = createContext();

export const RegionProvider = ({ children }) => {
  const [selectedRegionId, setSelectedRegionId] = useState('pavlodar'); // Default region

  return (
    <RegionContext.Provider value={{ selectedRegionId, setSelectedRegionId }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => useContext(RegionContext);
