import React, { useContext, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import AppContext from '../../context/AppContext';
import UserContext from '../../context/UserContext';
import DevicesContext from '../../context/DevicesContext';
import AlertBox from '../../common/alertBox';
import LoadingSpinner from '../../common/loadingSpinner';
import { PAGES } from '../../../constants';
import { updatePageTitle } from '../../../utils/page';
import { getDevicesForUser } from '../../networking/api';

const Dashboard = () => {
  const { setActive } = useContext(AppContext);
  const { user } = useContext(UserContext);
  const {
    devices, setDevices,
    fetchError: devicesFetchError, setFetchError: setDevicesFetchError,
    loading: devicesLoading, setLoading: setDevicesLoading,
    shouldFetch: devicesShouldFetch, setShouldFetch: setDevicesShouldFetch
  } = useContext(DevicesContext);

  useEffect(() => {
    const fetchDevices = async() => {
      if (devicesShouldFetch && user) {
        setDevicesLoading(true);
        setDevicesShouldFetch(false);

        try {
          setDevices(await getDevicesForUser(user.id));
          setDevicesLoading(false);
        } catch (error) {
          setDevicesFetchError(error);
          setDevicesLoading(false);
        }
      }
    };

    setActive(PAGES.dashboard);
    updatePageTitle('Dashboard');
    fetchDevices();
  }, [
    devices,
    setDevices,
    devicesFetchError,
    setDevicesFetchError,
    devicesLoading,
    setDevicesLoading,
    devicesShouldFetch,
    setDevicesShouldFetch,
    setActive,
    user
  ]);

  if (devicesFetchError) {
    return (
      <Container>
        <AlertBox color="red" title="Algo sucedió al descargar la información de los devices." text={[devicesFetchError]} />
      </Container>
    );
  }

  if (devicesLoading) {
    return (
      <LoadingSpinner loading color="custom" />
    );
  }

  return (
    <Container>
      Dashboard
    </Container>
  );
};

export default Dashboard;
