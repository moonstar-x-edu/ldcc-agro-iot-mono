/* eslint-disable no-extra-parens */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import { BS_COLOR_VARIANTS } from '../../../constants';

const AlertBox = ({ color, title, footer, text, ...props }) => {
  return (
    <Alert variant={BS_COLOR_VARIANTS[color]} {...props}>
      {
        title &&
        <Alert.Heading>
          {title}
        </Alert.Heading>
      }
      {
        text.map((t, index) => (
          <p key={index}>
            {t}
          </p>
        ))
      }
      {
        footer &&
        <Fragment>
          <hr />
          <p className="mb-0">
            {footer}
          </p>
        </Fragment>
      }
    </Alert>
  );
};

AlertBox.propTypes = {
  color: PropTypes.oneOf(Object.keys(BS_COLOR_VARIANTS)),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  footer: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  text: PropTypes.arrayOf(PropTypes.string).isRequired
};

AlertBox.defaultProps = {
  color: 'blue',
  title: [],
  footer: null
};

export default AlertBox;
