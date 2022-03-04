import React, { useState } from 'react';
import PropTypes from 'prop-types';

const DevicesContext = React.createContext(null);

const DevicesContextProvider = ({ children }) => {
  const [devices, setDevices] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [current, setCurrent] = useState(null);

  const context = {
    devices, setDevices,
    fetchError, setFetchError,
    loading, setLoading,
    shouldFetch, setShouldFetch,
    current, setCurrent
  };

  return (
    <DevicesContext.Provider value={context}>
      {children}
    </DevicesContext.Provider>
  );
};

DevicesContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

DevicesContextProvider.defaultProps = {
  children: null
};

export default DevicesContext;

export {
  DevicesContextProvider
};
