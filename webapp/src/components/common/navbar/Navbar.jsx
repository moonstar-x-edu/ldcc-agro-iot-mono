import React, { useContext, useState } from 'react';
import { Navbar as BSNavbar, Nav, Image, Container, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import UserContext from '../../context/UserContext';
import { ROUTES, PAGES } from '../../../constants';

const Navbar = () => {
  const { active } = useContext(AppContext);
  const { user } = useContext(UserContext);

  const [expand, setExpand] = useState(false);

  const handleOpen = () => {
    setExpand(true);
  };

  const handleClose = () => {
    setExpand(false);
  };

  return (
    <BSNavbar expand={false} variant="dark" className="mb-4">
      <Container className="mw-100 mx-2">
        <BSNavbar.Toggle onClick={handleOpen} />
        <Nav className="mx-4">
          <Nav.Item>
            {
              user && user.profileURL ?
                <Image className="user-icon" roundedCircle src={user.profileURL} /> :
                <i className="fa-solid fa-user icon-white user-icon fa-xl" />
            }
          </Nav.Item>
        </Nav>

        <Offcanvas placement="start" show={expand} onHide={handleClose} scroll backdrop>
          <button className="back-button" onClick={handleClose}>
            <i className="fa-solid fa-arrow-right fa-xl" />
          </button>
          <Offcanvas.Header>
            <Offcanvas.Title id="offcanvasNavbarLabel">
              Sistema de Agricultura Inteligente
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to={ROUTES.dashboard}
                  active={active === PAGES.dashboard}
                  eventKey={PAGES.dashboard}
                  className="link"
                  onClick={handleClose}
                >
                  <i className="fa-solid fa-gauge " /> Dashboard
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
