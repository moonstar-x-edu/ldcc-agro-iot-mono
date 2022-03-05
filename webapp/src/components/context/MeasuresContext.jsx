import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MeasuresContext = React.createContext(null);

const MeasuresContextProvider = ({ children }) => {
  const [measures, setMeasures] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);

  const addMeasure = (measure) => {
    setMeasures([...measures, measure]);
  };

  const context = {
    measures, setMeasures,
    addMeasure,
    fetchError, setFetchError,
    loading, setLoading,
    shouldFetch, setShouldFetch
  };

  return (
    <MeasuresContext.Provider value={context}>
      {children}
    </MeasuresContext.Provider>
  );
};

MeasuresContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

MeasuresContextProvider.defaultProps = {
  children: null
};

export default MeasuresContext;

export {
  MeasuresContextProvider
};
