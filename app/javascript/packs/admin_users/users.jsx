import React from 'react';
import PropTypes from 'prop-types';
import User from './user';

class Users extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleDelete = this.handleDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }
  onUpdate(user) {
    this.props.onUpdate(user);
  }

  handleDelete(id) {
    this.props.handleDelete(id);
  }

  render() {
    const users = this.props.users.map(user => (
      <User
        id={user.id}
        key={user.id.toString()}
        user={user}
        roles={this.props.roles}
        statuses={this.props.statuses}
        handleDelete={this.handleDelete}
        handleUpdate={this.onUpdate}
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
};

export default Users;
