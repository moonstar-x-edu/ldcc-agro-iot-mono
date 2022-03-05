import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../common/navbar';
import Dashboard from '../pages/dashboard';
import NotFound from '../pages/notFound';
import { ROUTES } from '../../constants';

const Router = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path={ROUTES.home} element={<Navigate replace to={ROUTES.dashboard} />} />
        <Route exact path={ROUTES.dashboard} element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
