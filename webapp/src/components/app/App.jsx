import React from 'react';
import { AppContextProvider } from '../context/AppContext';
import { UserContextProvider } from '../context/UserContext';
import AppWithData from './AppWithData';

const App = () => {
  return (
    <AppContextProvider>
      <UserContextProvider>
        <AppWithData />
      </UserContextProvider>
    </AppContextProvider>
  );
};

export default App;
