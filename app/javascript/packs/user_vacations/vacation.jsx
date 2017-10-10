import React from 'react';
import PropTypes from 'prop-types';

class Vacation extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    this.props.handleDelete(this.props.vacation.id);
  }

  render() {
    const startDate = this.props.vacation.start_date;
    const endDate = this.props.vacation.end_date;
    const type = this.props.vacation.type;
    const status = this.props.vacation.status;
    return (
      <tr>
        <td>{startDate}</td>
        <td>{endDate}</td>
        <td>{type}</td>
        <td>{status}</td>
        <td><button className="btn btn-danger" onClick={this.handleDelete}> Delete</button></td>
      </tr>
    );
  }
}

Vacation.propTypes = {
  vacation: PropTypes.shape({
    id: PropTypes.number,
    user_id: PropTypes.number,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    status: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Vacation;
