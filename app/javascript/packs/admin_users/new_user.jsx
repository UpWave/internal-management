import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Select from 'react-normalized-select';


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(235, 235, 235, 0.5)',
  },
};

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
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.checkNewUserButton = this.checkNewUserButton.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
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

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    return (
      <div className="form-group" id="new_user">
        <button onClick={this.openModal}>Create new user</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="New user"
        >
          <h2>Create new user!</h2>
          <form>
            <Select
              className="selectpicker"
              onChange={e => this.setState({ role: e.target.value })}
              defaultValue={this.state.value}
            >
              <option value="0" disabled hidden>Select role</option>
              {this.props.roles.map(option =>
                <option key={option} value={option}>{option}</option>)}
            </Select>
            <br />
            <Select
              className="selectpicker"
              onChange={e => this.setState({ status: e.target.value })}
              defaultValue={this.state.value}
            >
              <option value="0" disabled hidden>Select status</option>
              {this.props.statuses.map(option =>
                <option key={option} value={option}>{option}</option>)}
            </Select>
            <br />
            <label htmlFor="input-mail">Email:</label><br />
            <input id="input-mail" type="email" onChange={this.handleEmailChange} />
            <br />
            <label htmlFor="input-pass">Password:</label><br />
            <input id="input-pass" type="password" minLength="6" onChange={this.handlePasswordChange} />
            <br />
            <button id="new-user-button" className="btn-primary" style={{ visibility: 'hidden' }} onClick={this.handleClick}>Create</button><br />
          </form>
        </Modal>
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
