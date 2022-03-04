import React from 'react';
import { AppContextProvider } from '../context/AppContext';
import { UserContextProvider } from '../context/UserContext';
import { DevicesContextProvider } from '../context/DevicesContext';
import { MeasuresContextProvider } from '../context/MeasuresContext';
import AppWithData from './AppWithData';

const App = () => {
  return (
    <AppContextProvider>
      <UserContextProvider>
        <DevicesContextProvider>
          <MeasuresContextProvider>
            <AppWithData />
          </MeasuresContextProvider>
        </DevicesContextProvider>
      </UserContextProvider>
    </AppContextProvider>
  );
};

export default App;
