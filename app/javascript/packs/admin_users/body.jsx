import React from 'react';
import ReactDOM from 'react-dom';
import Users from './users';

class Body extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      users: [],
      roles: [],
      statuses: [],
    };
    this.loadUsers = this.loadUsers.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: '/api/v1/admin/users/roles',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({ roles: data });
      },
    });
    $.ajax({
      url: '/api/v1/admin/users/statuses',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({ statuses: data });
      },
    });
    this.loadUsers();
  }

  loadUsers() {
    $.ajax({
      url: '/api/v1/admin/users',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({ users: data });
      },
    });
  }

  handleDelete(id) {
    $.ajax({
      url: `/api/v1/admin/users/${id}`,
      type: 'DELETE',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      success: () => {
        this.loadUsers();
      },
    });
  }

  handleUpdate(user) {
    $.ajax({
      url: `/api/v1/admin/users/${user.id}`,
      type: 'PATCH',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: { user: user },
      success: () => {
        this.loadUsers();
      },
    });
  }

  render() {
    return (
      <div>
        <Users
          key={this.state.users.length.toString()}
          users={this.state.users}
          roles={this.state.roles}
          statuses={this.state.statuses}
          handleDelete={this.handleDelete}
          onUpdate={this.handleUpdate}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <Body />,
  document.getElementById('root'),
);
