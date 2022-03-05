/* eslint-disable no-extra-parens */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownButton, ButtonGroup, FormControl } from 'react-bootstrap';

const DevicePicker = ({ devices, currentDevice, onSelect, className }) => {
  const [filtered, setFiltered] = useState('');

  const handleFilter = ({ target: { value } }) => {
    setFiltered(value);
  };

  const handleSelect = (selected) => {
    onSelect(devices.find((d) => d.id === selected));
  };

  return (
    <DropdownButton
      className={`device-picker ${className}`.trim()}
      as={ButtonGroup}
      id="device-picker-dropdown-group"
      title="Selecciona un device"
      menuRole="device-picker"
      variant="primary"
      onSelect={handleSelect}
    >
      <FormControl className="mx-3 my-2 w-auto" placeholder="Buscar" onChange={handleFilter} value={filtered} />
      {
        devices
          .filter(({ name }) => name.toLowerCase().includes(filtered.toLowerCase()))
          .map(({ id, name }) => (
            <Dropdown.Item key={id} eventKey={id} disabled={currentDevice?.id === id}>
              {name}
            </Dropdown.Item>
          ))
      }
    </DropdownButton>
  );
};

DevicePicker.propTypes = {
  devices: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })),
  currentDevice: PropTypes.shape({
    id: PropTypes.string
  }),
  onSelect: PropTypes.func,
  className: PropTypes.string
};

DevicePicker.defaultProps = {
  devices: [],
  currentDevice: null,
  onSelect: () => null,
  className: ''
};

export default DevicePicker;
