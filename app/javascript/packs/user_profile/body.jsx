import React from 'react';
import AlertContainer from 'react-alert';
import Fetch from '../Fetch';

class Body extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      user: [],
      editable: false
    };
    this.loadUser = this.loadUser.bind(this);
    this.changeFile = this.changeFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  componentDidMount() {
    this.loadUser();
  }

  loadUser() {
    Fetch.json('/api/v1/profile')
      .then((data) => {
        this.setState({ user: data });
      });
  }

  changeFile(e) {
    this.setState({ file: e.target.files[0] });
  }

  handleSubmit(e) {
    e.preventDefault();
    const file = new FormData();
    file.append('avatar', this.state.file);
    Fetch.putForm('/api/v1/profile', file)
      .then(() => {
        this.msg.success('Avatar updated');
        this.setState({ file: null });
        document.getElementById('fileInput').value = '';
        this.loadUser();
      });
  }


  handleUpdate(e) {
    e.preventDefault();
    this.setState({ editable: !this.state.editable });
    const first_name = this.state.firstName;
    const last_name = this.state.lastName;
    $.ajax({
      url: `/api/v1/profile`,
      type: 'PATCH',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: { first_name, last_name },
      success: () => {
        this.msg.success('Successfully updated');
        this.loadUser();
      },
      error: (xhr) => {
        this.msg.error($.parseJSON(xhr.responseText).errors);
      },
    });
  }

  handleEdit() {
    if (this.state.editable) {
      const user = { firstName: this.state.user.first_name, lastName: this.state.user.last_name };
      this.props.handleUpdate(user);
    }
    this.setState({ editable: !this.state.editable });
  }

  handleBack() {
    this.setState({ editable: !this.state.editable });
  }

  handleNameChange(event) {
    this.setState({ firstName: event.target.value });
  }

  handleLastNameChange(event) {
    this.setState({ lastName: event.target.value });
  }


  render() {
    const avatar = <img src={this.state.user.photo} alt="avatar" className="img-responsive" />;
    const firstName = this.state.user.first_name;
    const lastName = this.state.user.last_name;
    const email = this.state.user.email;
    const role = this.state.user.role;
    const salary = this.state.user.salary;
    const sickLeaveApproved = this.state.user.sick_leave_approved;
    const sickLeavePending = this.state.user.sick_leave_pending;
    const dayOffsApproved = this.state.user.day_offs_approved;
    const dayOffsPending = this.state.user.day_offs_pending;
    const plannedVacApproved = this.state.user.planned_vac_approved;
    const plannedVacPending = this.state.user.planned_vac_pending;

    const fName = this.state.editable ?
      (<div>
        <p className="lead">First name: </p>
        <input type="text" onChange={this.handleNameChange} defaultValue={firstName} /><br />
      </div>)
      :
      <p className="lead">Name: {firstName}</p>;

    const lName = this.state.editable ?
      (<div>
        <p className="lead">Last name: </p>
        <input type="text" onChange={this.handleLastNameChange} defaultValue={lastName} /><br />
      </div>)
      :
      <p className="lead">Last name: {lastName}</p>;


    return (
      <div>
        <div className="well" key={this.state.user.id}>
          {avatar}

          {fName}

          {lName}
          <button className="btn btn-default edit-btn" onClick={this.handleEdit} style={this.state.editable ? { display: 'none' } : { display: 'block' }}>Edit</button>
          <button className="btn btn-default edit-btn" onClick={this.handleUpdate} style={this.state.editable ? { visibility: 'visible' } : { visibility: 'hidden' }}> Submit</button>
          <button
            id="back-button"
            style={this.state.editable ? { visibility: 'visible' } : { visibility: 'hidden' }}
            onClick={this.handleBack}
          >
            Back
          </button>

            <p className="lead">Email: {email}</p>
            <p className="lead">Role: {role}</p>
            <p className="lead">Salary: {salary}</p>

          <div className="row">
            <div className="col-md-4">
              <div className="well">
                <p className="lead"><strong>Sick leave</strong></p>
                <p className="lead">pending: {sickLeavePending}</p>
                <p className="lead">approved: {sickLeaveApproved}</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="well">
                <p className="lead"><strong>Planned vacation</strong></p>
                <p className="lead">pending: {plannedVacPending}</p>
                <p className="lead">approved: {plannedVacApproved}</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="well">
                <p className="lead"><strong>Unpaid day offs</strong></p>
                <p className="lead">pending: {dayOffsPending}</p>
                <p className="lead">approved: {dayOffsApproved}</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="well">
                <form onSubmit={this.handleSubmit}>
                  <p className="lead">Select image to upload</p>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={this.changeFile}
                  />
                  <button
                    className="btn btn-info"
                    type="submit"
                    style={this.state.file ? { visibility: 'visible' } : { visibility: 'hidden' }}
                    onClick={this.handleSubmit}
                  >
                  Upload avatar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

export default Body;
