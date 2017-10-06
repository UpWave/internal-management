import React from 'react';
import PropTypes from 'prop-types';
import Vacation from './vacation';

class Vacations extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onUpdate = this.onUpdate.bind(this);
  }
  onUpdate(id, status) {
    this.props.onUpdate(id, status);
  }


  render() {
    const title = this.props.vacations.length > 0 ?
      'Pending vacations'
      :
      'There are no pending vacations';
    const tableHead = this.props.vacations.length > 0 ?
      (<thead>
        <tr>
          <th>Email</th>
          <th>Start date</th>
          <th>End date</th>
          <th>Type</th>
          <th>Action</th>
        </tr>
      </thead>)
      :
      null;
    const vacations = this.props.vacations.map(vacation => (
      <Vacation
        key={vacation.id}
        vacation={vacation}
        approved={this.props.approved}
        rejected={this.props.rejected}
        handleDelete={this.handleDelete}
        handleUpdate={this.onUpdate}
      />
    ));
    return (
      <div>
        <h2>{title}</h2>
        <table id="table">
          {tableHead}
          <tbody>
            {vacations}
          </tbody>
        </table>
      </div>
    );
  }
}

Vacations.propTypes = {
  vacations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    user_id: PropTypes.number,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    status: PropTypes.string,
    type: PropTypes.string,
    user: PropTypes.object,
  })).isRequired,
  approved: PropTypes.string.isRequired,
  rejected: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default Vacations;
