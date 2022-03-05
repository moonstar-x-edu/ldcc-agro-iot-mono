import React from 'react';
import PropTypes from 'prop-types';

const UserWelcome = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <div className="user-welcome">
      Bienvenido, {user.name} {user.lastName}
    </div>
  );
};

UserWelcome.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    lastName: PropTypes.string
  }).isRequired
};

export default UserWelcome;
