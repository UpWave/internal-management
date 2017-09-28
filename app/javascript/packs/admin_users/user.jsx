import React from 'react';
import {
  Link,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import Select from 'react-normalized-select';
import Collapsible from 'react-collapsible';
import AlertContainer from 'react-alert';
import Fetch from '../Fetch';
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
      skills: [],
      rates: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      selectedRate: 0,
      missingSkills: [],
      allSkills: [],
    };
    this.handleBack = this.handleBack.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSalaryChange = this.handleSalaryChange.bind(this);
    this.setNewSalary = this.setNewSalary.bind(this);
    this.handleEditSalary = this.handleEditSalary.bind(this);
    this.handleBackSalary = this.handleBackSalary.bind(this);
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
    this.findSkillTitleById = this.findSkillTitleById.bind(this);
  }

  componentDidMount() {
    Fetch.json('/api/v1/admin/salaries', {
      id: this.props.user.id,
    })
      .then((data) => {
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
      });
    this.loadSkills();
    this.loadUserSkills();
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
    Fetch.json('/api/v1/admin/skills')
      .then((data) => {
        this.setState({ allSkills: data });
      });
  }

  loadUserSkills() {
    Fetch.json(`/api/v1/admin/user/users/${this.props.user.id}/skills`)
      .then((data) => {
        this.setState({
          skills: data,
        });
        if (data.length !== 0) {
          this.setState({
            selectedDestroySkillRate: data[0].skill_id,
          });
        }
      });
  }

  loadMissingSkills() {
    Fetch.json(`/api/v1/admin/user/users/${this.props.user.id}/skills/missing`)
      .then((data) => {
        this.setState({
          missingSkills: data,
        });
        if (data.length !== 0) {
          this.setState({
            selectedSkill: data[0].id,
          });
        }
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

  handleBack() {
    this.setState({ editable: !this.state.editable });
  }

  handleBackSalary() {
    this.setState({ editableSalary: !this.state.editableSalary });
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
    this.setState({ selectedSkill: event.target.value });
  }

  handleRateChange(event) {
    this.setState({ selectedRate: event.target.value });
  }

  addNewSkillRate() {
    const userSkill = {
      skill_id: this.state.selectedSkill,
      rate: this.state.selectedRate,
      user_id: this.props.user.id,
    };
    Fetch.postJSON(`/api/v1/admin/user/users/${this.props.user.id}/skills`, {
      user_skill: userSkill,
    })
      .then(() => {
        this.msg.success('Successfully setted new skill');
        this.loadUserSkills();
        this.loadMissingSkills();
      }).catch((errorResponse) => {
        this.msg.error(errorResponse.errors);
      });
  }

  destroySkillRate() {
    Fetch.deleteJSON(`/api/v1/admin/user/users/${this.props.user.id}/skills/${this.state.selectedDestroySkillRate}`)
      .then(() => {
        this.msg.success('Successfully deleted');
        this.loadSkills();
        this.loadUserSkills();
        this.loadMissingSkills();
      }).catch((errorResponse) => {
        this.msg.error(errorResponse.errors);
      });
  }

  customSkillChange(event) {
    this.setState({ customSkill: event.target.value }, () => {
      this.checkCustomSkillButton();
    });
  }

  addCustomSkill() {
    Fetch.postJSON('/api/v1/admin/skills', {
      skill: { name: this.state.customSkill },
    })
      .then(() => {
        this.msg.success(`Successfully added ${this.state.customSkill} to a list`);
        this.loadSkills();
        this.loadUserSkills();
        this.loadMissingSkills();
      }).catch((errorResponse) => {
        this.msg.error(errorResponse.errors);
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

  findSkillTitleById(id) {
    const skill = this.state.allSkills.find((element) => {
      return element.id === id;
    });
    return skill.name;
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
    const email = <p className="lead">Email: {this.props.user.email}</p>;
    const role = this.state.editable ?
      (<Select
        className="form-control"
        defaultValue={this.state.value}
        onChange={e => this.setState({ role: e.target.value })}
      >
        <option value="0" disabled hidden>Select role</option>
        {this.props.roles.map(option =>
          <option key={option} value={option}>{option}</option>)}
      </Select>)
      :
      <p className="lead">Role: {this.props.user.role}</p>;
    const status = this.state.editable ?
      (<Select
        className="form-control"
        defaultValue={this.state.value}
        onChange={e => this.setState({ status: e.target.value })}
      >
        <option value="0" disabled hidden>Select status</option>
        {this.props.statuses.map(option =>
          <option key={option} value={option}>{option}</option>)}
      </Select>)
      :
      <p className="lead">Status: {this.props.user.status}</p>;
    const salary = this.state.editableSalary ?
      <input className="form-control" type="number" min="0" onChange={this.handleSalaryChange} defaultValue={this.state.amount} />
      :
      <p className="lead">Amount: {this.state.amount} $</p>;
    const warningImg = this.warningIcon();
    const reviewDate = this.state.editableSalary ?
      <input className="form-control" type="date" defaultValue={this.state.reviewDate} onChange={this.handleReviewDateChange} />
      :
      <p className="lead">Review date: {this.state.reviewDate}</p>;
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
        <text className="lead">Salary:</text>
        <input
          className="form-control"
          type="number"
          min="0"
          onChange={this.handleSalaryChange}
          defaultValue={this.state.amount}
        />
        <text className="lead">Review date:</text>
        <input className="form-control" type="date" onChange={this.handleReviewDateChange} />
        <button id="edit_submit" className="btn btn-default" style={{ visibility: 'hidden' }} onClick={this.setNewSalary}>Submit</button>
      </Collapsible>);
    const skillRates = this.state.skills.length === 0 ?
      <text className="lead">No skill rates yet</text>
      :
      (<text className="lead">{this.state.skills.map(item =>
        (<p key={item.skill_id}>
          {this.findSkillTitleById(item.skill_id)}: {item.rate}</p>),
      )}</text>);
    const skills = this.state.allSkills.length === 0 ?
      <div><b className="lead">There no skills yet. Please add few below</b></div>
      :
      (<div>
        <b className="lead">Skill rates</b>
        <div className="well">
          {skillRates}
        </div>
      </div>);
    const addSkillRateCollapse = this.state.missingSkills.length === 0 ?
      null
      :
      (<Collapsible
        id="collapse"
        trigger="Add skill rate"
        triggerClassName="btn btn-default"
      >
        <Select
          className="form-control"
          onChange={this.handleSkillChange}
        >
          {this.state.missingSkills.map(option =>
            (<option
              key={option.id}
              value={option.id}
            >
              {this.findSkillTitleById(option.id)}
            </option>))}
        </Select>
        <Select
          className="form-control"
          onChange={this.handleRateChange}
        >
          {this.state.rates.map(option =>
            <option key={option} value={option}>{option}</option>)}
        </Select>
        <button id="submit-skill-rate" className="btn btn-default" onClick={this.addNewSkillRate}>Submit</button>
      </Collapsible>);
    const addCustomSkill =
    (<div><p className="lead">Add custom skill to list</p>
      <input className="form-control" type="text" placeholder="Skill name" onChange={this.customSkillChange} />
      <button id="submit-custom-skill" className="btn btn-default" style={{ visibility: 'hidden' }} onClick={this.addCustomSkill}>Submit</button>
    </div>);
    const destroySkillRatesCollapse = this.state.skills.length === 0 ?
      null
      :
      (<Collapsible
        id="delete-collapse"
        trigger="Delete skill rate"
        triggerClassName="btn btn-default"
      >
        <Select
          className="form-control"
          onChange={e => this.setState({ selectedDestroySkillRate: e.target.value })}
        >
          {this.state.skills.map(option =>
            (<option
              key={option.id}
              value={option.skill_id}
            >{this.findSkillTitleById(option.skill_id)}</option>))}
        </Select>
        <button id="destroy-skill-rate" className="btn btn-default" onClick={this.destroySkillRate}>Delete</button>
      </Collapsible>);
    return (
      <div key={this.props.user.id}>
        <div className="row">
          <div className="col-sm-4">
            <h2 className="display-3 center-text">Info</h2>
            <div className="well">
              {email}
              {role}
              {status}
              <button className="btn btn-default" onClick={this.handleDelete}>Delete</button>
              <button className="btn btn-default" onClick={this.handleEdit}>{this.state.editable ? 'Submit' : 'Edit'}</button>
              <button
                id="back-button"
                className="btn btn-default"
                style={this.state.editable ? { visibility: 'visible' } : { visibility: 'hidden' }}
                onClick={this.handleBack}
              >
                Back
              </button>
              <br />
              <Link
                className="btn btn-default"
                to={'/admin/users/'.concat(this.props.user.id).concat('/timelogs')}
              >
                Timelogs
              </Link>
            </div>
          </div>
          <div className="col-sm-4">
            <h2 className="display-3">Salary</h2>
            <div className="well">
              {warningImg}
              {salary}
              {reviewDate}
              {editSubmitButton}
              <button
                id="back-button"
                className="btn btn-default"
                style={this.state.editableSalary ? { visibility: 'visible' } : { visibility: 'hidden' }}
                onClick={this.handleBackSalary}
              >
                Back
              </button>
              {newSalary}
            </div>
          </div>
          <div className="col-sm-4">
            <h2 className="display-3">Skills</h2>
            <div className="well">
              {skills}
              {addSkillRateCollapse}
              {destroySkillRatesCollapse}
              {addCustomSkill}
            </div>
          </div>
        </div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
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
};

export default User;
