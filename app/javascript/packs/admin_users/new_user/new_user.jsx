import React from 'react';
import AlertContainer from 'react-alert';
import Fetch from '../../Fetch';
import Roles from './roles';
import Statuses from './statuses';

class NewUser extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      role: 'member',
      status: 'active',
      email: '',
      password: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPressed = this.handleKeyPressed.bind(this);
    this.handleCreateNewUser = this.handleCreateNewUser.bind(this);
    this.roleChanged = this.roleChanged.bind(this);
    this.statusChanged = this.statusChanged.bind(this);
  }

  roleChanged(role) {
    this.setState({ role });
  }

  statusChanged(status) {
    this.setState({ status });
  }

  handleCreateNewUser() {
    Fetch.postJSON('/api/v1/admin/users', {
      user: {
        email: this.state.email,
        password: this.state.password,
        role: this.state.role,
        status: this.state.status,
      },
    })
      .then(() => {
        this.msg.success('Successfully created new user');
        this.setState({
          password: '',
          email: '',
        });
      }).catch((errorResponse) => {
        this.msg.error(errorResponse.errors);
      });
  }

  handleKeyPressed(event) {
    if ((event.charCode === 13) && (document.getElementById('new-user-button').style.visibility === 'visible')) {
      this.handleCreateNewUser();
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <div className="form-group well col-md-4 col-md-offset-4" id="new_user">
        <h2>Create new user!</h2>
        <Roles
          roleChanged={this.roleChanged}
        />
        <br />
        <Statuses
          statusChanged={this.statusChanged}
        />
        <br />
        <label htmlFor="input-mail">Email:</label><br />
        <input
          name="email"
          value={this.state.email}
          className="form-control"
          id="input-mail"
          type="email"
          onKeyPress={this.handleKeyPressed}
          onChange={this.handleInputChange}
        />
        <br />
        <label htmlFor="input-pass">Password:</label><br />
        <input
          name="password"
          value={this.state.password}
          className="form-control"
          id="input-pass"
          type="password"
          minLength="6"
          onKeyPress={this.handleKeyPressed}
          onChange={this.handleInputChange}
        />
        <br />
        <button
          id="new-user-button"
          className="btn btn-success"
          style={
            (this.state.password.length > 6) && (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(this.state.email))
              ?
              { visibility: 'visible' }
              :
              { visibility: 'hidden' }
          }
          onClick={this.handleCreateNewUser}
        >
          Create
        </button>
        <br />
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

export default NewUser;
