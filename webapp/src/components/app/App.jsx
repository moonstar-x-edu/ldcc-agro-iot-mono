import React from 'react';
import Router from '../router';
import { AppContextProvider } from '../context/AppContext';

const App = () => {
  return (
    <AppContextProvider>
      <Router />
    </AppContextProvider>
  );
};

export default App;
