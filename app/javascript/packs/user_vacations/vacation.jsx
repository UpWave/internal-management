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
    const startDate = <p className="lead">Start time: {this.props.vacation.start_date}</p>;
    const endDate = <p className="lead">End time: {this.props.vacation.end_date}</p>;
    const type = <p className="lead">Type: {this.props.vacation.type}</p>;
    const status = <p className="lead">Status: {this.props.vacation.status}</p>;
    return (
      <div key={this.props.vacation.id}>
        {startDate}
        {endDate}
        {type}
        {status}
        <button className="btn btn-danger" onClick={this.handleDelete}> Delete</button>
      </div>
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
