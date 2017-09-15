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
      selectedRate: 0,
      missingSkills: [],
      allSkills: [],
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
    this.loadUserSkills = this.loadUserSkills.bind(this);
    this.loadMissingSkills = this.loadMissingSkills.bind(this);
    this.handleRateChange = this.handleRateChange.bind(this);
    this.handleSkillChange = this.handleSkillChange.bind(this);
    this.addNewSkillRate = this.addNewSkillRate.bind(this);
    this.destroySkillRate = this.destroySkillRate.bind(this);
    this.customSkillChange = this.customSkillChange.bind(this);
    this.checkCustomSkillButton = this.checkCustomSkillButton.bind(this);
    this.addCustomSkill = this.addCustomSkill.bind(this);
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
    this.loadUserSkills();
    this.loadMissingSkills();
    this.loadSkills();
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
      url: '/api/v1/admin/skills',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({ allSkills: data });
      },
    });
  }
  loadUserSkills() {
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
        this.setState({ selectedDestroySkillRate: this.state.allSkills[Object.keys(data)[0]] });
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
        this.setState({ selectedSkill: data[Object.keys(data)[0]] });
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
    });
  }

  handleRateChange(event) {
    this.setState({ selectedRate: event.target.value }, () => {
    });
  }

  addNewSkillRate() {
    const userSkill = {
      skill_id: this.state.selectedSkill,
      rate: this.state.selectedRate,
      user_id: this.props.user.id,
    };
    $.ajax({
      url: '/api/v1/admin/user/skills',
      type: 'POST',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: { user_skill: userSkill },
      success: () => {
        this.msg.success('Successfully setted new skill');
        this.loadUserSkills();
        this.loadMissingSkills();
      },
      error: (xhr) => {
        this.msg.error($.parseJSON(xhr.responseText).errors);
      },
    });
  }

  destroySkillRate() {
    const userSkill = {
      skill_id: this.state.selectedDestroySkillRate,
      user_id: this.props.user.id,
    };
    $.ajax({
      url: `/api/v1/admin/user/skills/${this.props.user.id}`,
      type: 'DELETE',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: { user_skill: userSkill },
      success: () => {
        this.msg.success('Successfully deleted');
        this.loadSkills();
        this.loadUserSkills();
        this.loadMissingSkills();
      },
      error: (xhr) => {
        this.msg.error($.parseJSON(xhr.responseText).errors);
      },
    });
  }

  customSkillChange(event) {
    this.setState({ customSkill: event.target.value }, () => {
      this.checkCustomSkillButton();
    });
  }

  addCustomSkill() {
    $.ajax({
      url: '/api/v1/admin/skills',
      type: 'POST',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: { skill: { name: this.state.customSkill } },
      success: () => {
        this.msg.success(`Successfully added ${this.state.customSkill} to a list`);
        this.loadSkills();
        this.loadUserSkills();
        this.loadMissingSkills();
      },
      error: (xhr) => {
        this.msg.error($.parseJSON(xhr.responseText).errors);
      },
    });
  }

  checkCustomSkillButton() {
    if (this.state.customSkill.length > 0) {
      $('#submit-custom-skill').css('visibility', 'visible');
    } else {
      $('#submit-custom-skill').css('visibility', 'hidden');
    }
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
    const skills = Object.keys(this.state.allSkills).length === 0 ?
      <div><b>There no skills yet. Please add few below</b></div>
      :
      (<div>
        <b>Skill rates:</b>
        <text>{Object.keys(this.state.skills).map(item =>
          <p key={item}>{item}: {this.state.skills[item]}</p>,
        )}</text>
      </div>);
    const addSkillRateCollapse = Object.keys(this.state.missingSkills).length === 0 ?
      null
      :
      (<Collapsible
        id="collapse"
        trigger="Add skill rate"
        triggerClassName="btn btn-default"
      >
        <Select
          className="mySelect"
          onChange={this.handleSkillChange}
        >
          {Object.keys(this.state.missingSkills).map(option =>
            <option key={option} value={this.state.missingSkills[option]}>{option}</option>)}
        </Select>
        <Select
          className="mySelect"
          onChange={this.handleRateChange}
        >
          {this.state.rates.map(option =>
            <option key={option} value={option}>{option}</option>)}
        </Select>
        <button id="submit-skill-rate" className="btn btn-default" onClick={this.addNewSkillRate}>Submit</button>
      </Collapsible>);
    const addCustomSkill =
    (<div><p>Add custom skill to list</p>
      <input type="text" placeholder="Skill name" onChange={this.customSkillChange} />
      <button id="submit-custom-skill" className="btn btn-default" style={{ visibility: 'hidden' }} onClick={this.addCustomSkill}>Submit</button>
    </div>);
    const destroySkillRatesCollapse = Object.keys(this.state.skills).length === 0 ?
      null
      :
      (<Collapsible
        id="delete-collapse"
        trigger="Delete skill rate"
        triggerClassName="btn btn-default"
      >
        <Select
          className="mySelect"
          onChange={e => this.setState({ selectedDestroySkillRate: e.target.value })}
        >
          {Object.keys(this.state.skills).map(option =>
            <option key={option} value={this.state.allSkills[option]}>{option}</option>)}
        </Select>
        <button id="destroy-skill-rate" className="btn btn-default" onClick={this.destroySkillRate}>Delete</button>
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
        {skills}
        {addSkillRateCollapse}
        {destroySkillRatesCollapse}<br />
        {addCustomSkill}<br />
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
