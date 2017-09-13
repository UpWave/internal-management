import React from 'react';
import ReactDOM from 'react-dom';
import AlertContainer from 'react-alert';
import ReactPaginate from 'react-paginate';
import Users from './users';

class Body extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      users: [],
      roles: [],
      statuses: [],
      currentPage: 0,
      perPage: 1,
      pageCount: 1,
    };
    this.loadUsers = this.loadUsers.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleUpdateSalary = this.handleUpdateSalary.bind(this);
    this.setNewSalary = this.setNewSalary.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
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
    // Get number of users for pageCount
    $.ajax({
      url: '/api/v1/admin/users/count_users',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({ pageCount: Math.ceil(data / this.state.perPage) });
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
      error: (xhr) => {
        this.msg.error($.parseJSON(xhr.responseText).errors);
      },
    });
  }

  loadUsers() {
    $.ajax({
      url: '/api/v1/admin/users',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      dataType: 'json',
      type: 'GET',
      data: { page: this.state.currentPage, per_page: this.state.perPage },
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
      error: (xhr) => {
        this.msg.error($.parseJSON(xhr.responseText).errors);
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
      error: (xhr) => {
        this.msg.error($.parseJSON(xhr.responseText).errors);
      },
    });
  }

  handlePageClick(page) {
    this.setState({ currentPage: page.selected }, () => {
      this.loadUsers();
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
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={<a href="">...</a>}
          breakClassName={'break-me'}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <Body />,
  document.getElementById('root'),
);
