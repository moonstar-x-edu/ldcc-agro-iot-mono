import React, { useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { PAGES } from '../../../constants';
import { updatePageTitle } from '../../../utils/page';

const Dashboard = () => {
  const { setActive } = useContext(AppContext);

  useEffect(() => {
    setActive(PAGES.dashboard);
    updatePageTitle('Dashboard');
  }, [setActive]);

  return (
    <div>
      Dashboard
    </div>
  );
};

export default Dashboard;
