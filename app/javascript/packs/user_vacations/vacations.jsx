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
    const vacations = this.props.vacations.map(vacation => (
      <Vacation
        id={vacation.id}
        key={vacation.id.toString()}
        vacation={vacation}
        handleDelete={this.handleDelete}
      />
    ));
    return (
      <div>
        {vacations}
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
