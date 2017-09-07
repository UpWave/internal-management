import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-normalized-select';
import Collapsible from 'react-collapsible';

class User extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: '0',
      editable: false,
      role: this.props.user.role,
      status: this.props.user.status,
      newSalary: false,
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSalaryChange = this.handleSalaryChange.bind(this);
    this.setNewSalary = this.setNewSalary.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: '/api/v1/admin/users/salary',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: {
        id: this.props.user.id,
      },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({ salary: data });
      },
    });
  }

  setNewSalary() {
    this.props.setNewSalary(this.state.salary, this.props.user);
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
        amount: this.state.salary,
      };
      this.props.handleUpdate(user);
    }
    this.setState({ newSalary: !this.state.newSalary });
    this.setState({ editable: !this.state.editable });
  }

  handleSalaryChange(event) {
    this.setState({ salary: event.target.value });
  }

  render() {
    const email = <p>Email: {this.props.user.email}</p>;
    const role = this.state.editable ?
      (<Select
        className="mySelect"
        value={this.state.value}
        onChange={e => this.setState({ role: e.target.value })}
      >
        <option value="0" disabled hidden>Select role</option>
        {this.props.roles.map(option =>
          <option key={option} value={option}>{option}</option>)}
      </Select>)
      :
      <p>Role: {this.props.user.role}</p>;
    const status = this.state.editable ?
      (<Select
        className="mySelect"
        value={this.state.value}
        onChange={e => this.setState({ status: e.target.value })}
      >
        <option value="0" disabled hidden>Select status</option>
        {this.props.statuses.map(option =>
          <option key={option} value={option}>{option}</option>)}
      </Select>)
      :
      <p>Status: {this.props.user.status}</p>;
    const salary = this.state.editable ?
      <input type="number" onChange={this.handleSalaryChange} defaultValue={this.state.salary} />
      :
      <p>Salary: {this.state.salary} $</p>;
    const newSalary = this.state.editable ?
      null
      :
      (<Collapsible
        id="collapse"
        trigger="Set new salary"
        triggerClassName="btn btn-default"
      >
        <input type="number" onChange={this.handleSalaryChange} defaultValue={this.state.salary} />
        <button className="btn btn-default" onClick={this.setNewSalary}>Submit</button>
      </Collapsible>);
    return (
      <div key={this.props.user.id}>
        {email}
        {role}
        {status}
        {salary}
        {newSalary}<br />
        <button className="btn btn-default" onClick={this.handleDelete}>Delete</button>
        <button className="btn btn-default" onClick={this.handleEdit}>{this.state.editable ? 'Submit' : 'Edit'}</button>
        <a
          className="btn btn-default"
          href={'/admin/users/'.concat(this.props.user.id).concat('/timelogs')}
        >Timelogs</a>
      </div>
    );
  }
}

User.propTypes = {
  user: PropTypes.shape.isRequired,
  roles: PropTypes.arrayOf.isRequired,
  statuses: PropTypes.arrayOf.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  setNewSalary: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default User;
