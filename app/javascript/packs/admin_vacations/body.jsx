import React from 'react';
import AlertContainer from 'react-alert';
import Vacations from './vacations';

class AdminVacations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vacations: [],
      users: [],
      approved: '',
      rejected: '',
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.loadVacations = this.loadVacations.bind(this);
    this.loadUsers = this.loadUsers.bind(this);
    this.loadStatuses = this.loadStatuses.bind(this);
  }

  componentDidMount() {
    this.loadVacations();
    this.loadUsers();
    this.loadStatuses();
  }

  loadVacations() {
    $.ajax({
      url: '/api/v1/admin/vacations',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({
          vacations: data,
        });
      },
    });
  }

  loadUsers() {
    $.ajax({
      url: '/api/v1/admin/vacations/users',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({
          users: data,
        });
      },
    });
  }

  loadStatuses() {
    $.ajax({
      url: '/api/v1/admin/vacations/statuses',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({
          approved: data.approved_status,
          rejected: data.rejected_status,
        });
      },
    });
  }

  handleUpdate(id, status) {
    $.ajax({
      url: `/api/v1/admin/vacations/${id}`,
      type: 'PATCH',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: { vacation: { status: status } },
      success: () => {
        this.msg.success(`Vacation status setted to ${status}`);
        this.loadVacations();
        this.loadUsers();
      },
      error: (xhr) => {
        this.msg.error($.parseJSON(xhr.responseText).errors);
      },
    });
  }


  render() {
    return (
      <div className="well">
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <Vacations
          key={this.state.vacations.length.toString()}
          vacations={this.state.vacations}
          users={this.state.users}
          approved={this.state.approved}
          rejected={this.state.rejected}
          onUpdate={this.handleUpdate}
        />
      </div>
    );
  }
}


export default AdminVacations;
