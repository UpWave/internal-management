import React from 'react';
import PropTypes from 'prop-types';
import User from './user';

class Users extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleDelete = this.handleDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.handleUpdateSalary = this.handleUpdateSalary.bind(this);
    this.setNewSalary = this.setNewSalary.bind(this);
  }
  onUpdate(user) {
    this.props.onUpdate(user);
  }


  setNewSalary(salary, id) {
    this.props.setNewSalary(salary, id);
  }

  handleUpdateSalary(salary, id) {
    this.props.handleUpdateSalary(salary, id);
  }

  handleDelete(id) {
    this.props.handleDelete(id);
  }

  render() {
    const users = this.props.users.map(user => (
      <User
        key={user.id.toString()}
        user={user}
        roles={this.props.roles}
        statuses={this.props.statuses}
        handleDelete={this.handleDelete}
        handleUpdate={this.onUpdate}
        handleUpdateSalary={this.handleUpdateSalary}
        setNewSalary={this.setNewSalary}
      />
    ));
    return (
      <div>
        {users}
      </div>
    );
  }
}

Users.propTypes = {
  users: PropTypes.arrayOf.isRequired,
  roles: PropTypes.arrayOf.isRequired,
  statuses: PropTypes.arrayOf.isRequired,
  onUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleUpdateSalary: PropTypes.func.isRequired,
  setNewSalary: PropTypes.func.isRequired,
};

export default Users;
