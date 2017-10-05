import React from 'react';
import PropTypes from 'prop-types';
import Vacation from './vacation';

class Vacations extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(id) {
    this.props.handleDelete(id);
  }

  render() {
    const title = this.props.vacations.length > 0 ?
      'Vacations'
      :
      'There are no vacations yet';
    const vacations =
  this.props.vacations.map(vacation => (
    <Vacation
      id={vacation.id}
      key={vacation.id.toString()}
      vacation={vacation}
      handleDelete={this.handleDelete}
    />
  ));
    return (
      <div>
        <h2>{title}</h2>
        <table id="table">
          <thead>
            <tr>
              <th>Start date</th>
              <th>End date</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
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
  })).isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Vacations;
