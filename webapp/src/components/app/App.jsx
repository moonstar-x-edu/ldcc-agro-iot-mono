import React from 'react';
import { AppContextProvider } from '../context/AppContext';
import Router from '../router';

const App = () => {
  return (
    <AppContextProvider>
      <Router />
    </AppContextProvider>
  );
};

export default App;
