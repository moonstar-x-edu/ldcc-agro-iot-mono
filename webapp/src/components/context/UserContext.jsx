import React, { useState } from 'react';
import PropTypes from 'prop-types';

const UserContext = React.createContext(null);

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);

  const context = {
    user, setUser,
    fetchError, setFetchError,
    loading, setLoading,
    shouldFetch, setShouldFetch
  };

  return (
    <UserContext.Provider value={context}>
      {children}
    </UserContext.Provider>
  );
};

UserContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

UserContextProvider.defaultProps = {
  children: null
};

export default UserContext;

export {
  UserContextProvider
};
