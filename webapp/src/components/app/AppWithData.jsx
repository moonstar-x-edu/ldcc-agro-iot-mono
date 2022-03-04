import React, { useContext, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import Router from '../router';
import AlertBox from '../common/alertBox';
import LoadingSpinner from '../common/loadingSpinner';
import { getUser } from '../networking/api';

// Hardcoded since it's just a prototype. No login available.
const USER_ID = process.env.NODE_ENV === 'development' ?
  '622237f4810e5210d8a1beea' :
  '621c696708d49a59fdcdf6dc';

const AppWithData = () => {
  const {
    user, setUser,
    fetchError: userFetchError, setFetchError: setUserFetchError,
    loading: userLoading, setLoading: setUserLoading,
    shouldFetch: userShouldFetch, setShouldFetch: setUserShouldFetch
  } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async() => {
      if (userShouldFetch) {
        setUserLoading(true);
        setUserShouldFetch(false);

        try {
          setUser(await getUser(USER_ID));
          setUserLoading(false);
        } catch (error) {
          setUserFetchError(error);
          setUserLoading(false);
        }
      }
    };
    fetchUser();
  }, [
    user,
    setUser,
    userFetchError,
    setUserFetchError,
    userLoading,
    setUserLoading,
    userShouldFetch,
    setUserShouldFetch
  ]);

  if (userFetchError) {
    return (
      <Container>
        <AlertBox color="red" title="Algo sucedió al descargar la información del usuario." text={[userFetchError]} />
      </Container>
    );
  }

  if (userLoading) {
    return (
      <LoadingSpinner loading color="custom" />
    );
  }

  return (
    <Router />
  );
};

export default AppWithData;
