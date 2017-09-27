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
    const vacations = this.props.vacations.map(vacation => (
      <div key={vacation.id} className="col-sm-4">
        <div className="well">
          <Vacation
            key={vacation.id}
            vacation={vacation}
            approved={this.props.approved}
            rejected={this.props.rejected}
            handleDelete={this.handleDelete}
            handleUpdate={this.onUpdate}
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
    user: PropTypes.object,
  })).isRequired,
  approved: PropTypes.string.isRequired,
  rejected: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default Vacations;
