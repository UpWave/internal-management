import React from 'react';
import AlertContainer from 'react-alert';
import ReactPaginate from 'react-paginate';
import Fetch from '../Fetch';
import Users from './users';
import NewUser from './new_user';


class AdminUsers extends React.Component {
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
    Fetch.json('/api/v1/admin/roles')
      .then((data) => {
        this.setState({ roles: data });
      });
    Fetch.json('/api/v1/admin/statuses')
      .then((data) => {
        this.setState({ statuses: data });
      });
    this.loadUsers();
  }

  setNewSalary(salary, id) {
    Fetch.postJSON('/api/v1/admin/salaries', {
      salary: salary,
      id: id,
    })
      .then(() => {
        this.msg.success('Successfully setted new salary');
        this.loadUsers();
      }).catch((errorResponse) => {
        this.msg.error(errorResponse.errors);
      });
  }

  loadUsers() {
    // Get number of users for pageCount
    Fetch.json('/api/v1/admin/users/count_users')
      .then((data) => {
        this.setState({ pageCount: Math.ceil(data / this.state.perPage) });
      });
    Fetch.json('/api/v1/admin/users', {
      page: this.state.currentPage,
      per_page: this.state.perPage,
    })
      .then((data) => {
        this.setState({ users: data });
      });
  }

  handleDelete(id) {
    Fetch.deleteJSON(`/api/v1/admin/users/${id}`)
      .then(() => {
        if (this.state.currentPage === this.state.pageCount - 1) {
          this.setState({ currentPage: this.state.currentPage - 1 });
        }
        this.loadUsers();
        this.msg.success('User deleted');
      });
  }

  handleUpdateSalary(salary, id) {
    Fetch.putJSON(`/api/v1/admin/salaries/${id}`, {
      salary: salary,
      id: id,
    })
      .then(() => {
        this.msg.success('Salary updated');
      }).catch((errorResponse) => {
        this.msg.error(errorResponse.errors);
      });
  }
  handleUpdate(user) {
    Fetch.putJSON(`/api/v1/admin/users/${user.id}`, {
      user: user,
    })
      .then(() => {
        this.msg.success('User updated');
        this.loadUsers();
      }).catch((errorResponse) => {
        this.msg.error(errorResponse.errors);
      });
  }

  handlePageClick(page) {
    this.setState({ currentPage: page.selected }, () => {
      this.loadUsers();
    });
  }

  render() {
    return (
      <div className="well">
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
        <NewUser
          key="new_user"
          roles={this.state.roles}
          statuses={this.state.statuses}
          loadUsers={this.loadUsers}
        />
      </div>
    );
  }
}


export default AdminUsers;
