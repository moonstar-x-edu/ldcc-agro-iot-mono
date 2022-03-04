import React, { useContext } from 'react';
import { Navbar as BSNavbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import { ROUTES } from '../../../constants';

const Navbar = () => {
  const { active } = useContext(AppContext);

  return (
    <BSNavbar collapseOnSelect expand="lg" variant="dark">
      <BSNavbar.Brand as={Link} to={ROUTES.dashboard}>
        <span>LOGO</span>
      </BSNavbar.Brand>
      <BSNavbar.Toggle aria-controls="responsive-sidebar" />
      <BSNavbar.Collapse expand="lg" id="responsive-sidebar">
        <Nav fill className="mr-auto">
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.dashboard} active={active === ROUTES.dashboard} eventKey={ROUTES.dashboard}>
              Dashboard
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </BSNavbar.Collapse>
    </BSNavbar>
  );
};

export default Navbar;
