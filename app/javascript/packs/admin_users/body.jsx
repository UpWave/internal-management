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
    this.handleUpdateSalary = this.handleUpdateSalary.bind(this);
    this.setNewSalary = this.setNewSalary.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: '/api/v1/admin/roles',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({ roles: data });
      },
    });
    $.ajax({
      url: '/api/v1/admin/statuses',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({ statuses: data });
      },
    });
    this.loadUsers();
  }

  setNewSalary(salary, id) {
    $.ajax({
      url: '/api/v1/admin/salaries',
      type: 'POST',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: { salary: salary, id: id },
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
        this.msg.success('User deleted');
        this.loadUsers();
      },
    });
  }

  handleUpdateSalary(salary, id) {
    $.ajax({
      url: `/api/v1/admin/salaries/${id}`,
      type: 'PATCH',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: { salary: salary, id: id },
      success: () => {
        this.msg.success('Salary updated');
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
        this.msg.success('User updated');
        this.loadUsers();
      },
    });
  }

  render() {
    return (
      <div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <Users
          key={this.state.users.length.toString()}
          users={this.state.users}
          roles={this.state.roles}
          statuses={this.state.statuses}
          handleDelete={this.handleDelete}
          onUpdate={this.handleUpdate}
          handleUpdateSalary={this.handleUpdateSalary}
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
