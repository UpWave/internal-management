import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Select from 'react-normalized-select';
import AlertContainer from 'react-alert';
import Fetch from '../Fetch';

class NewUser extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: '0',
      role: 'member',
      status: 'active',
      email: '',
      password: '',
      modalIsOpen: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleKeyPressed = this.handleKeyPressed.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.handleCreateNewUser = this.handleCreateNewUser.bind(this);
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

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    return (
      <div className="form-group" id="new_user">
        <button className="btn btn-info" onClick={this.openModal}>Create new user</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          className="modal-style"
          contentLabel="New user"
        >
          <h2>Create new user!</h2>
          <Select
            className="form-control"
            onChange={e => this.setState({ role: e.target.value })}
            defaultValue={this.state.value}
          >
            <option value="0" disabled hidden>Select role</option>
            {this.props.roles.map(option =>
              <option key={option} value={option}>{option}</option>)}
          </Select>
          <br />
          <Select
            className="form-control"
            onChange={e => this.setState({ status: e.target.value })}
            defaultValue={this.state.value}
          >
            <option value="0" disabled hidden>Select status</option>
            {this.props.statuses.map(option =>
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
        </Modal>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

NewUser.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  loadUsers: PropTypes.func.isRequired,
};

export default NewUser;
