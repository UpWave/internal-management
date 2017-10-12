import React from 'react';
import Select from 'react-normalized-select';
import AlertContainer from 'react-alert';
import Fetch from '../Fetch';

class NewUser extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      roles: [],
      statuses: [],
      value: '0',
      role: 'member',
      status: 'active',
      email: '',
      password: '',
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPressed = this.handleKeyPressed.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.handleCreateNewUser = this.handleCreateNewUser.bind(this);
  }

  componentWillMount() {
    Fetch.json('/api/v1/admin/roles')
      .then((data) => {
        this.setState({ roles: data });
      });
    Fetch.json('/api/v1/admin/statuses')
      .then((data) => {
        this.setState({ statuses: data });
      });
  }

  handleClick() {
    const user = {
      email: this.state.email,
      password: this.state.password,
      role: this.state.role,
      status: this.state.status,
    };
    this.handleCreateNewUser(user);
  }


  handleCreateNewUser(newUser) {
    Fetch.postJSON('/api/v1/admin/users', {
      user: newUser,
    })
      .then(() => {
        this.msg.success('Successfully created new user');
        this.clearFields();
        this.props.loadUsers();
      }).catch((errorResponse) => {
        this.msg.error(errorResponse.errors);
      });
  }

  clearFields() {
    this.setState({
      password: '',
      email: '',
    });
  }

  handleKeyPressed(event) {
    if ((event.charCode === 13) && (document.getElementById('new-user-button').style.visibility === 'visible')) {
      this.handleClick();
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
          <Select
            className="form-control"
            onChange={e => this.setState({ role: e.target.value })}
            defaultValue={this.state.value}
          >
            <option value="0" disabled hidden>Select role</option>
            {this.state.roles.map(option =>
              <option key={option} value={option}>{option}</option>)}
          </Select>
          <br />
          <Select
            className="form-control"
            onChange={e => this.setState({ status: e.target.value })}
            defaultValue={this.state.value}
          >
            <option value="0" disabled hidden>Select status</option>
            {this.state.statuses.map(option =>
              <option key={option} value={option}>{option}</option>)}
          </Select>
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
            onClick={this.handleClick}
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
