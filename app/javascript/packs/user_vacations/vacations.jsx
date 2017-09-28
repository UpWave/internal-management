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
        <div key={vacation.id} className="col-sm-4">
          <div className="well">
            <Vacation
              id={vacation.id}
              key={vacation.id.toString()}
              vacation={vacation}
              handleDelete={this.handleDelete}
            />
          </div>
        </div>
      ));
    return (
      <div>
        <div>
          <h2 className="display-3">{title}</h2>
        </div>
        <div className="row">
          {vacations}
        </div>
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
