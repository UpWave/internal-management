import React from 'react';
import ReactDOM from 'react-dom';
import AlertContainer from 'react-alert';
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
    this.setNewSalary = this.setNewSalary.bind(this);
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

  setNewSalary(salary, user) {
    const date = new Date();
    $.ajax({
      url: '/api/v1/admin/users/set_salary/',
      type: 'PATCH',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: { id: user.id, amount: salary, archived_at: date.toISOString().slice(0, 10) },
      success: () => {
        this.msg.success('Successfully setted new salary');
        this.loadUsers();
      },
    });
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
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />,
        <Users
          key={this.state.users.length.toString()}
          users={this.state.users}
          roles={this.state.roles}
          statuses={this.state.statuses}
          handleDelete={this.handleDelete}
          onUpdate={this.handleUpdate}
          setNewSalary={this.setNewSalary}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <Body />,
  document.getElementById('root'),
);
