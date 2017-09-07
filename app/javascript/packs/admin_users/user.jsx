import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-normalized-select';

class User extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: '0',
      editable: false,
      role: this.props.user.role,
      status: this.props.user.status,
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    this.props.handleDelete(this.props.user.id);
  }

  handleEdit() {
    if (this.state.editable) {
      const id = this.props.user.id;
      const email = this.props.user.email;
      const role = this.state.role;
      const status = this.state.status;
      const user = { id, email: email, role: role, status: status };
      this.props.handleUpdate(user);
    }
    this.setState({ editable: !this.state.editable });
  }

  render() {
    const email = <p>Email: {this.props.user.email}</p>;
    const role = this.state.editable ?
      (<Select className="mySelect" value={this.state.value} onChange={e => this.setState({ role: e.target.value })}>
        <option value="0" disabled hidden>Select role</option>
        {this.props.roles.map(option =>
          <option key={option} value={option}>{option}</option>)}
      </Select>)
      :
      <p>Role: {this.props.user.role}</p>;
    const status = this.state.editable ?
      (<Select className="mySelect" value={this.state.value} onChange={e => this.setState({ status: e.target.value })}>
        <option value="0" disabled hidden>Select status</option>
        {this.props.statuses.map(option =>
          <option key={option} value={option}>{option}</option>)}
      </Select>)
      :
      <p>Status: {this.props.user.status}</p>;
    return (
      <div key={this.props.user.id}>
        {email}
        {role}
        {status}
        <button onClick={this.handleDelete}>Delete</button>
        <button onClick={this.handleEdit}>{this.state.editable ? 'Submit' : 'Edit'}</button>
        <a
          className="btn"
          href={'/admin/users/'.concat(this.props.user.id).concat('/timelogs')}
        ><button>Timelogs</button></a>
      </div>
    );
  }
}

User.propTypes = {
  user: PropTypes.shape.isRequired,
  roles: PropTypes.arrayOf.isRequired,
  statuses: PropTypes.arrayOf.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default User;
