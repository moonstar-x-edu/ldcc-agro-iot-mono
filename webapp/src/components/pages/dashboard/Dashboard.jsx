import React, { useContext, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import AppContext from '../../context/AppContext';
import UserContext from '../../context/UserContext';
import DevicesContext from '../../context/DevicesContext';
import AlertBox from '../../common/alertBox';
import LoadingSpinner from '../../common/loadingSpinner';
import DevicePicker from '../../common/devicePicker';
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
    shouldFetch: devicesShouldFetch, setShouldFetch: setDevicesShouldFetch,
    setCurrent: setCurrentDevice
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

  const handleDeviceSelect = (device) => {
    setCurrentDevice(device);
  };

  if (devicesFetchError) {
    return (
      <Container>
        <AlertBox color="red" title="Algo sucedió al descargar la información de los devices." text={[devicesFetchError]} />
      </Container>
    );
  }

  if (devicesLoading || !devices) {
    return (
      <LoadingSpinner loading color="custom" />
    );
  }

  return (
    <Container>
      <h1>
        Dashboard
      </h1>
      <hr />
      <DevicePicker devices={devices} onSelect={handleDeviceSelect} />
    </Container>
  );
};

export default Dashboard;
