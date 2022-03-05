import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../common/navbar';
import Footer from '../common/footer';
import Dashboard from '../pages/dashboard';
import NotFound from '../pages/notFound';
import { ROUTES } from '../../constants';

const Router = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="site-content my-4">
        <Routes>
          <Route exact path={ROUTES.home} element={<Navigate replace to={ROUTES.dashboard} />} />
          <Route exact path={ROUTES.dashboard} element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
