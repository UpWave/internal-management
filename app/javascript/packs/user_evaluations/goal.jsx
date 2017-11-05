import React from 'react';
import PropTypes from 'prop-types';

class Goal extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.name}</td>
        <td>{this.props.mark}</td>
      </tr>
    );
  }
}

Goal.propTypes = {
  name: PropTypes.string.isRequired,
  mark: PropTypes.string.isRequired,
};

export default Goal;
