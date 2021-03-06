import React, { useContext, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import AppContext from '../../context/AppContext';
import UserContext from '../../context/UserContext';
import DevicesContext from '../../context/DevicesContext';
import MeasuresContext from '../../context/MeasuresContext';
import AlertBox from '../../common/alertBox';
import LoadingSpinner from '../../common/loadingSpinner';
import UserWelcome from '../../common/userWelcome';
import DevicePicker from '../../common/devicePicker';
import TemperatureChart from '../../common/charts/TemperatureChart';
import HumidityChart from '../../common/charts/HumidityChart';
import { PAGES } from '../../../constants';
import { updatePageTitle } from '../../../utils/page';
import { getDevicesForUser, getMeasuresForDevice } from '../../../networking/api';

const Dashboard = () => {
  const { setActive, socket } = useContext(AppContext);
  const { user } = useContext(UserContext);
  const {
    devices, setDevices,
    fetchError: devicesFetchError, setFetchError: setDevicesFetchError,
    loading: devicesLoading, setLoading: setDevicesLoading,
    shouldFetch: devicesShouldFetch, setShouldFetch: setDevicesShouldFetch,
    current: currentDevice, setCurrent: setCurrentDevice
  } = useContext(DevicesContext);
  const {
    measures, setMeasures, addMeasure,
    fetchError: measuresFetchError, setFetchError: setMeasuresFetchError,
    loading: measuresLoading, setLoading: setMeasuresLoading,
    shouldFetch: measuresShouldFetch, setShouldFetch: setMeasuresShouldFetch
  } = useContext(MeasuresContext);

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

    const fetchMeasures = async() => {
      if (measuresShouldFetch && currentDevice) {
        setMeasuresLoading(true);
        setMeasuresShouldFetch(false);

        try {
          setMeasures(await getMeasuresForDevice(currentDevice.id));
          setMeasuresLoading(false);
        } catch (error) {
          setMeasuresFetchError(error);
          setMeasuresLoading(false);
        }
      }
    };

    setActive(PAGES.dashboard);
    updatePageTitle('Dashboard');
    fetchDevices();
    fetchMeasures();
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
    user,
    measuresShouldFetch,
    setMeasuresShouldFetch,
    currentDevice,
    setMeasuresLoading,
    setMeasures,
    setMeasuresFetchError
  ]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.off('measure');
    socket.on('measure', (measure) => {
      if (measures && measure.deviceId === currentDevice?.id) {
        addMeasure(measure);
      }
    });
  }, [socket, currentDevice, addMeasure, measures]);

  const handleDeviceSelect = (device) => {
    setCurrentDevice(device);
    setMeasuresShouldFetch(true);
    setMeasures([]);
  };

  if (devicesFetchError) {
    return (
      <Container>
        <AlertBox color="red" title="Algo sucedi?? al descargar la informaci??n de los devices." text={[devicesFetchError]} />
      </Container>
    );
  }

  if (measuresFetchError) {
    return (
      <Container>
        <AlertBox color="red" title="Algo sucedi?? al descargar las medidas del device seleccionado." text={[measuresFetchError]} />
      </Container>
    );
  }

  if (devicesLoading || measuresLoading || !devices || !socket) {
    return (
      <LoadingSpinner loading color="custom" />
    );
  }

  return (
    <Container>
      <UserWelcome user={user} />
      <h1>
        Dashboard
      </h1>
      <hr />
      <DevicePicker devices={devices} currentDevice={currentDevice} onSelect={handleDeviceSelect} />
      <TemperatureChart measures={measures} device={currentDevice} />
      <HumidityChart measures={measures} device={currentDevice} />
    </Container>
  );
};

export default Dashboard;
