import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-normalized-select';
import Fetch from '../../Fetch';

class Roles extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: '0',
      roles: [],
    };
    this.roleChanged = this.roleChanged.bind(this);
  }

  componentWillMount() {
    Fetch.json('/api/v1/admin/roles')
      .then((data) => {
        this.setState({ roles: data });
      });
  }

  roleChanged(event) {
    this.props.roleChanged(event.target.value);
  }

  render() {
    return (
      <Select
        className="form-control"
        onChange={this.roleChanged}
        defaultValue={this.state.value}
      >
        <option value="0" disabled hidden>Select role</option>
        {this.state.roles.map(option =>
          <option key={option} value={option}>{option}</option>)}
      </Select>
    );
  }
}

Roles.propTypes = {
  roleChanged: PropTypes.func.isRequired,
};

export default Roles;
