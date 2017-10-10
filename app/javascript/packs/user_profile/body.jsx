import React from 'react';
import AlertContainer from 'react-alert';
import Fetch from '../Fetch';

class Body extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      user: [],
      editable: false,
    };
    this.loadUser = this.loadUser.bind(this);
    this.changeFile = this.changeFile.bind(this);
    this.handleSubmitAvatar = this.handleSubmitAvatar.bind(this);
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

  handleSubmitAvatar(e) {
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


  handleUpdate() {
    Fetch.putJSON('/api/v1/profile', {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
    })
      .then(() => {
        this.msg.success('User updated');
        this.setState({ editable: !this.state.editable });
        this.loadUser();
      })
      .catch((errorResponse) => {
        this.msg.error(errorResponse.errors);
      });
  }

  handleEdit() {
    if (this.state.editable) {
      const user = { firstName: this.state.user.first_name, lastName: this.state.user.last_name };
      this.handleUpdate(user);
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
    const firstName = this.state.editable ?
      (<input
        className="form-control"
        type="text"
        onChange={this.handleNameChange}
        defaultValue={this.state.user.first_name}
      />)
      :
      this.state.user.first_name;
    const lastName = this.state.editable ?
      (<input
        className="form-control"
        type="text"
        onChange={this.handleLastNameChange}
        defaultValue={this.state.user.last_name}
      />)
      : this.state.user.last_name;
    const email = this.state.user.email;
    const role = this.state.user.role;
    const salary = this.state.user.salary;
    const sickLeaveApproved = this.state.user.sick_leave_approved;
    const sickLeavePending = this.state.user.sick_leave_pending;
    const dayOffsApproved = this.state.user.day_offs_approved;
    const dayOffsPending = this.state.user.day_offs_pending;
    const plannedVacApproved = this.state.user.planned_vac_approved;
    const plannedVacPending = this.state.user.planned_vac_pending;

    return (
      <div>
        <div className="well" key={this.state.user.id}>
          <div className="row">
            <div className="col-md-4">
              {avatar}
            </div>
            <div className="col-md-5">
              <h2>Info</h2>
              <h3>
                {firstName}
                <span style={{ paddingLeft: '10px' }} />
                {lastName}
              </h3>
              <button
                className="btn btn-default"
                onClick={this.handleEdit}
                style={this.state.editable ? { display: 'none' } : { display: 'block' }}
              >
              Edit
              </button>
              <button
                className="btn btn-default"
                onClick={this.handleUpdate}
                style={this.state.editable ? { display: 'block' } : { display: 'none' }}
              >
                Submit
              </button>
              <button
                className="btn btn-default"
                id="back-button"
                style={this.state.editable ? { display: 'block' } : { display: 'none' }}
                onClick={this.handleBack}
              >
                Back
              </button>
              <h3>{email}</h3>
            </div>
            <div className="col-md-3">
              <h2>Position</h2>
              <h3>{role}</h3>
              <h3>{salary} $</h3>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <form onSubmit={this.handleSubmitAvatar}>
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
                  onClick={this.handleSubmitAvatar}
                >
                Upload avatar
                </button>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <p className="lead"><strong>Sick leave</strong></p>
              <p className="lead">pending: {sickLeavePending}</p>
              <p className="lead">approved: {sickLeaveApproved}</p>
            </div>
            <div className="col-md-4">
              <p className="lead"><strong>Planned vacation</strong></p>
              <p className="lead">pending: {plannedVacPending}</p>
              <p className="lead">approved: {plannedVacApproved}</p>
            </div>
            <div className="col-md-4">
              <p className="lead"><strong>Unpaid day offs</strong></p>
              <p className="lead">pending: {dayOffsPending}</p>
              <p className="lead">approved: {dayOffsApproved}</p>
            </div>
          </div>
        </div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

export default Body;
