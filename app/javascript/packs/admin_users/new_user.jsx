import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-normalized-select';

class NewUser extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: '0',
      role: '',
      status: '',
      email: '',
      password: '',
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.checkNewUserButton = this.checkNewUserButton.bind(this);
  }

  handleClick() {
    const user = {
      email: this.state.email,
      password: this.state.password,
      role: this.state.role,
      status: this.state.status,
    };
    this.props.handleCreateNewUser(user);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value }, () => {
      this.checkNewUserButton();
    });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value }, () => {
      this.checkNewUserButton();
    });
  }

  checkNewUserButton() {
    if ((this.state.password.length > 6) && (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(this.state.email))) {
      $('#new-user-button').css('visibility', 'visible');
    } else {
      $('#new-user-button').css('visibility', 'hidden');
    }
  }

  render() {
    return (
      <div id="new_user">
        <h3>Register a new user!</h3>
        <text>Role:</text>
        <Select
          className="mySelect"
          onChange={e => this.setState({ role: e.target.value })}
          defaultValue={this.state.value}
        >
          <option value="0" disabled hidden>Select role</option>
          {this.props.roles.map(option =>
            <option key={option} value={option}>{option}</option>)}
        </Select>
        <br />
        <text>Status:</text>
        <Select
          className="mySelect"
          onChange={e => this.setState({ status: e.target.value })}
          defaultValue={this.state.value}
        >
          <option value="0" disabled hidden>Select status</option>
          {this.props.statuses.map(option =>
            <option key={option} value={option}>{option}</option>)}
        </Select>
        <br />
        <text>Email:</text>
        <input type="email" onChange={this.handleEmailChange} />
        <br />
        <text>Password:</text>
        <input type="password" minLength="6" onChange={this.handlePasswordChange} />
        <br />
        <button id="new-user-button" className="btn btn-default" style={{ visibility: 'hidden' }} onClick={this.handleClick}>Create</button><br />
      </div>
    );
  }
}

NewUser.propTypes = {
  roles: PropTypes.arrayOf.isRequired,
  statuses: PropTypes.arrayOf.isRequired,
  handleCreateNewUser: PropTypes.func.isRequired,
};

export default NewUser;
