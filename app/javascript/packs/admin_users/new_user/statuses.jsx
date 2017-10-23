import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-normalized-select';
import Fetch from '../../Fetch';

class Statuses extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: '0',
      statuses: [],
    };
    this.statusChanged = this.statusChanged.bind(this);
  }

  componentWillMount() {
    Fetch.json('/api/v1/admin/statuses')
      .then((data) => {
        this.setState({ statuses: data });
      });
  }

  statusChanged(event) {
    this.props.statusChanged(event.target.value);
  }

  render() {
    return (
      <Select
        className="form-control"
        onChange={this.statusChanged}
        defaultValue={this.state.value}
      >
        <option value="0" disabled hidden>Select status</option>
        {this.state.statuses.map(option =>
          <option key={option} value={option}>{option}</option>)}
      </Select>
    );
  }
}

Statuses.propTypes = {
  statusChanged: PropTypes.func.isRequired,
};

export default Statuses;
