import React from 'react';
import { AppContextProvider } from '../context/AppContext';
import Router from '../router';
import Navbar from '../common/navbar';

const App = () => {
  return (
    <AppContextProvider>
      <Navbar />
      <Router />
    </AppContextProvider>
  );
};

export default App;
