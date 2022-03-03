import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AppContext = React.createContext(null);

const AppContextProvider = ({ children }) => {
  const [active, setActive] = useState(null);

  const context = {
    active,
    setActive
  };

  return (
    <AppContext.Provider value={context}>
      {children}
    </AppContext.Provider>
  );
};

AppContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

AppContextProvider.defaultProps = {
  children: null
};

export default AppContext;

export {
  AppContextProvider
};

