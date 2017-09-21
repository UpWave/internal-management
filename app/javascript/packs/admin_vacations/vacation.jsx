import React from 'react';
import PropTypes from 'prop-types';

class Vacation extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleApprove = this.handleApprove.bind(this);
    this.handleReject = this.handleReject.bind(this);
    this.userIdToEmail = this.userIdToEmail.bind(this);
  }


  handleApprove() {
    this.props.handleUpdate(this.props.vacation.id, this.props.approved);
  }

  handleReject() {
    this.props.handleUpdate(this.props.vacation.id, this.props.rejected);
  }

  userIdToEmail(id) {
    const user = this.props.users.find((elem) => {
      return elem.id === id;
    });
    return user.email;
  }


  render() {
    const email = this.userIdToEmail(this.props.vacation.user_id);
    const startDate = this.props.vacation.start_date;
    const endDate = this.props.vacation.end_date;
    const type = this.props.vacation.type;
    return (
      <div className="well" key={this.props.vacation.id}>
        <p className="lead">Email: {email}</p>
        <p className="lead">Start date: {startDate}</p>
        <p className="lead">End date: {endDate}</p>
        <p className="lead">Type: {type}</p>
        <button className="btn btn-success" onClick={this.handleApprove}> Approve</button>
        <button className="btn btn-danger" onClick={this.handleReject}> Reject</button>
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
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    role: PropTypes.string,
    status: PropTypes.string,
  })).isRequired,
  approved: PropTypes.string.isRequired,
  rejected: PropTypes.string.isRequired,
  handleUpdate: PropTypes.func.isRequired,
};

export default Vacation;
