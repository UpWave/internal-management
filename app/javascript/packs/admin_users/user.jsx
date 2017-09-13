import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-normalized-select';
import Collapsible from 'react-collapsible';
import AlertContainer from 'react-alert';
import GreyWarnIcon from '../images/grey-warn-icon.png';
import RedWarnIcon from '../images/red-warn-icon.png';

class User extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: '0',
      editable: false,
      editableSalary: false,
      editableSkills: false,
      role: this.props.user.role,
      status: this.props.user.status,
      newSalary: false,
      amount: 0,
      reviewDate: '',
      skills: {},
      rates: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      missingSkills: [],
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSalaryChange = this.handleSalaryChange.bind(this);
    this.setNewSalary = this.setNewSalary.bind(this);
    this.handleEditSalary = this.handleEditSalary.bind(this);
    this.checkValues = this.checkValues.bind(this);
    this.handleReviewDateChange = this.handleReviewDateChange.bind(this);
    this.checkSetSalaryButton = this.checkSetSalaryButton.bind(this);
    this.warningIcon = this.warningIcon.bind(this);
    this.mouseOverRed = this.mouseOverRed.bind(this);
    this.mouseOverGrey = this.mouseOverGrey.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.loadSkills = this.loadSkills.bind(this);
    this.loadMissingSkills = this.loadMissingSkills.bind(this);
    this.handleRateChange = this.handleRateChange.bind(this);
    this.handleSkillChange = this.handleSkillChange.bind(this);
    this.checkAddNewSkillButton = this.checkAddNewSkillButton.bind(this);
    this.addNewSkill = this.addNewSkill.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: '/api/v1/admin/salaries',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: {
        id: this.props.user.id,
      },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        // data will be null when user is created,
        // but salary not assigned yet
        if (data !== null) {
          this.setState({
            amount: data.amount,
            reviewDate: data.review_date,
          });
          this.checkValues();
        } else {
          this.setState({
            amount: 0,
            reviewDate: 'Not set yet',
          });
        }
      },
    });
    this.loadSkills();
    this.loadMissingSkills();
  }

  setNewSalary() {
    const salary = {
      amount: this.state.amount,
      review_date: this.state.reviewDate,
    };
    this.props.setNewSalary(salary, this.props.user.id);
  }

  loadSkills() {
    $.ajax({
      url: '/api/v1/admin/users/skills',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: {
        id: this.props.user.id,
      },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({ skills: data });
      },
    });
  }

  loadMissingSkills() {
    $.ajax({
      url: '/api/v1/admin/users/missing_skills',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: {
        id: this.props.user.id,
      },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({ missingSkills: data });
        this.setState({ selectedSkill: data[0] });
      },
    });
  }

  checkValues() {
    if (this.state.reviewDate === null) {
      this.setState({ reviewDate: 'Not set yet' });
    }
    if (this.state.amount === null) {
      this.setState({ amount: 0 });
    }
  }

  handleDelete() {
    this.props.handleDelete(this.props.user.id);
  }

  handleEditSalary() {
    if (this.state.editableSalary) {
      const salary = {
        amount: this.state.amount,
        review_date: this.state.reviewDate,
      };
      this.props.handleUpdateSalary(salary, this.props.user.id);
    }
    this.setState({ editableSalary: !this.state.editableSalary });
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

  handleSalaryChange(event) {
    this.setState({ amount: event.target.value }, () => {
      this.checkSetSalaryButton();
    });
  }

  handleReviewDateChange(event) {
    this.setState({ reviewDate: event.target.value }, () => {
      this.checkSetSalaryButton();
    });
  }

  handleSkillChange(event) {
    this.setState({ selectedSkill: event.target.value }, () => {
      this.checkAddNewSkillButton();
    });
  }

  handleRateChange(event) {
    this.setState({ selectedRate: event.target.value }, () => {
      this.checkAddNewSkillButton();
    });
  }

  checkAddNewSkillButton() {
    if ((this.state.selectedRate >= 0) && (this.state.selectedSkill !== '')) {
      $('#submit-skill').css('visibility', 'visible');
    } else {
      $('#submit-skill').css('visibility', 'hidden');
    }
  }

  addNewSkill() {
    const userSkill = {
      name: this.state.selectedSkill,
      rate: this.state.selectedRate,
      user_id: this.props.user.id,
    };
    $.ajax({
      url: '/api/v1/admin/user_skills',
      type: 'POST',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: { user_skill: userSkill },
      success: () => {
        this.msg.success('Successfully setted new skill');
        this.loadSkills();
        this.loadMissingSkills();
        this.setState({ selectedRate: -1 });
        this.checkAddNewSkillButton();
      },
      error: (xhr) => {
        this.msg.error($.parseJSON(xhr.responseText).errors);
      },
    });
  }

  checkSetSalaryButton() {
    if ((this.state.amount > 0) && (/^\d+-\d+-\d+/.test(this.state.reviewDate))) {
      $('#edit_submit').css('visibility', 'visible');
    } else {
      $('#edit_submit').css('visibility', 'hidden');
    }
  }

  mouseOverRed() {
    this.msg.error('You have missed review date!');
  }

  mouseOverGrey() {
    this.msg.info('Review salary in few days!');
  }

  mouseLeave() {
    this.msg.removeAll();
  }

  warningIcon() {
    if ((new Date(this.state.reviewDate) - new Date()) < 0) {
      return (<div>
        <img
          onMouseOver={() => this.mouseOverRed()}
          onMouseLeave={() => this.mouseLeave()}
          src={RedWarnIcon}
          alt="red-warn-icon"
        />
        <br />
      </div>);
    } else if ((new Date(this.state.reviewDate) - new Date()) < 1.21e+9) {
      return (<div>
        <img
          onMouseOver={() => this.mouseOverGrey()}
          onMouseLeave={() => this.mouseLeave()}
          src={GreyWarnIcon}
          alt="grey-warn-icon"
        />
        <br />
      </div>);
    }
    return null;
  }

  render() {
    const email = <b>Email: {this.props.user.email}</b>;
    const role = this.state.editable ?
      (<Select
        className="mySelect"
        defaultValue={this.state.value}
        onChange={e => this.setState({ role: e.target.value })}
      >
        <option value="0" disabled hidden>Select role</option>
        {this.props.roles.map(option =>
          <option key={option} value={option}>{option}</option>)}
      </Select>)
      :
      <text>{this.props.user.role}</text>;
    const status = this.state.editable ?
      (<Select
        className="mySelect"
        defaultValue={this.state.value}
        onChange={e => this.setState({ status: e.target.value })}
      >
        <option value="0" disabled hidden>Select status</option>
        {this.props.statuses.map(option =>
          <option key={option} value={option}>{option}</option>)}
      </Select>)
      :
      <text>{this.props.user.status}</text>;
    const salary = this.state.editableSalary ?
      <input type="number" min="0" onChange={this.handleSalaryChange} defaultValue={this.state.amount} />
      :
      <text>{this.state.amount} $</text>;
    const warningImg = this.warningIcon();
    const reviewDate = this.state.editableSalary ?
      <input type="date" defaultValue={this.state.reviewDate} onChange={this.handleReviewDateChange} />
      :
      <text>{this.state.reviewDate}</text>;
    const editSubmitButton = this.state.amount === 0 ?
      null
      :
      <button className="btn btn-default" onClick={this.handleEditSalary}>{this.state.editableSalary ? 'Submit' : 'Edit'}</button>;
    const newSalary = this.state.editableSalary ?
      null
      :
      (<Collapsible
        id="collapse"
        trigger="Set new salary"
        triggerClassName="btn btn-default"
      >
        <text>Salary:</text>
        <input
          type="number"
          min="0"
          onChange={this.handleSalaryChange}
          defaultValue={this.state.amount}
        />
        <br />
        <text>Review date:</text>
        <input type="date" onChange={this.handleReviewDateChange} />
        <br />
        <button id="edit_submit" className="btn btn-default" style={{ visibility: 'hidden' }} onClick={this.setNewSalary}>Submit</button>
      </Collapsible>);
    const skills =
      (<text>{Object.keys(this.state.skills).map(item =>
        <p key={item}>{item}: {this.state.skills[item]}</p>,
      )}</text>);
    const addSkillsCollapse = this.state.missingSkills.length === 0 ?
      null
      :
      (<Collapsible
        id="collapse"
        trigger="Add new skill"
        triggerClassName="btn btn-default"
      >
        <Select
          className="mySelect"
          defaultValue={this.state.value}
          onChange={this.handleSkillChange}
        >
          <option value="0" disabled hidden>Skill</option>
          {this.state.missingSkills.map(option =>
            <option key={option} value={option}>{option}</option>)}
        </Select>
        <Select
          className="mySelect"
          defaultValue={this.state.value}
          onChange={this.handleRateChange}
        >
          <option value="0" disabled hidden>Rate</option>
          {this.state.rates.map(option =>
            <option key={option} value={option}>{option}</option>)}
        </Select>
        <button id="submit-skill" className="btn btn-default" style={{ visibility: 'hidden' }} onClick={this.addNewSkill}>Submit</button>
      </Collapsible>);
    return (
      <div className="well" key={this.props.user.id}>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        {email}<br />
        Role:{role}<br />
        Status:{status}<br />
        <button className="btn btn-default" onClick={this.handleDelete}>Delete</button>
        <button className="btn btn-default" onClick={this.handleEdit}>{this.state.editable ? 'Submit' : 'Edit'}</button>
        <a
          className="btn btn-default"
          href={'/admin/users/'.concat(this.props.user.id).concat('/timelogs')}
        >Timelogs
        </a><br />
        Salary:{salary}<br />
        {warningImg}
        Review date:{reviewDate}<br />
        {editSubmitButton}
        {newSalary}<br />
        <b>Skills</b>{skills}
        {addSkillsCollapse}
      </div>
    );
  }
}

User.propTypes = {
  user: PropTypes.shape.isRequired,
  roles: PropTypes.arrayOf.isRequired,
  statuses: PropTypes.arrayOf.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleUpdateSalary: PropTypes.func.isRequired,
  setNewSalary: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default User;
