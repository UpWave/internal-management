import React from 'react';
import {
  Link,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import Select from 'react-normalized-select';
import AlertContainer from 'react-alert';
import Skills from './skills';
import Salary from './salary';

class User extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: '0',
      editable: false,
      role: this.props.user.role,
      status: this.props.user.status,
    };
    this.handleBack = this.handleBack.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    this.props.handleDelete(this.props.user.id);
  }

  handleEdit() {
    if (this.state.editable) {
      const user = {
        id: this.props.user.id,
        email: this.props.user.email,
        role: this.state.role,
        status: this.state.status,
      };
      this.props.handleUpdate(user);
    }
    this.setState({ editable: !this.state.editable });
  }

  handleBack() {
    this.setState({ editable: !this.state.editable });
  }
  render() {
    const email = this.props.user.email;
    const role = this.state.editable ?
      (<Select
        className="form-control"
        defaultValue={this.state.value}
        onChange={e => this.setState({ role: e.target.value })}
      >
        <option value="0" disabled hidden>Role</option>
        {this.props.roles.map(option =>
          <option key={option} value={option}>{option}</option>)}
      </Select>)
      :
      this.props.user.role;
    const status = this.state.editable ?
      (<Select
        className="form-control"
        defaultValue={this.state.value}
        onChange={e => this.setState({ status: e.target.value })}
      >
        <option value="0" disabled hidden>Status</option>
        {this.props.statuses.map(option =>
          <option key={option} value={option}>{option}</option>)}
      </Select>)
      :
      this.props.user.status;
    return (
      <tr>
        <td>{email}</td>
        <td>{role}</td>
        <td>{status}</td>
        <td>
          <button
            className="btn btn-default btn-sm"
            onClick={this.handleDelete}
            style={this.state.editable ? { display: 'none' } : { display: 'block' }}
          >
            Delete
          </button>
          <button
            className="btn btn-default btn-sm"
            onClick={this.handleEdit}
          >
            {this.state.editable ? 'Submit' : 'Edit'}
          </button>
          <button
            id="back-button"
            className="btn btn-default btn-sm"
            style={this.state.editable ? { display: 'block' } : { display: 'none' }}
            onClick={this.handleBack}
          >
            Back
          </button>
        </td>
        <td>
          <Link
            to={'/admin/users/'.concat(this.props.user.id).concat('/timelogs')}
          >
            <i className="fa fa-calendar-check-o fa-3x" />
          </Link>
        </td>
        <td>
          <Link
            to={'/admin/users/'.concat(this.props.user.id).concat('/invoices')}
            style={this.state.amount === 0 ? { visibility: 'hidden' } : { visibility: 'visible' }}
          >
            <i className="fa fa-file-text-o fa-3x" />
          </Link>
        </td>
        <td>
          <Skills
            key="skills"
            user={this.props.user}
          />
        </td>
        <td>
          <Salary
            key="salary"
            user={this.props.user}
            handleUpdateSalary={this.props.handleUpdateSalary}
            setNewSalary={this.props.setNewSalary}
            salaryTypes={this.props.salaryTypes}
          />
          <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        </td>
      </tr>
    );
  }
}

User.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    role: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleUpdateSalary: PropTypes.func.isRequired,
  setNewSalary: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  salaryTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default User;
