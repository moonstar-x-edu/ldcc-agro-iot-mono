import React, { useContext, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import AppContext from '../../context/AppContext';
import { updatePageTitle } from '../../../utils/page';

const NotFound = () => {
  const { setActive } = useContext(AppContext);

  useEffect(() => {
    setActive(null);
    updatePageTitle('¡Página no encontrada!');
  }, [setActive]);

  return (
    <Container className="not-found-content">
      <span role="img" aria-label="Person shrugging" className="error-emoji">
        🤷🏻
      </span>
      <div className="error-title">
        404
      </div>
      <div className="error-message">
        La página que intentaste acceder no existe.
      </div>
    </Container>
  );
};

export default NotFound;
