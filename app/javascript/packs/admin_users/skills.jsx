import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Select from 'react-normalized-select';
import Collapsible from 'react-collapsible';
import AlertContainer from 'react-alert';
import Fetch from '../Fetch';

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

class Skills extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      modalIsOpen: false,
      skills: [],
      types: [],
      rates: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      selectedRate: 0,
      missingSkills: [],
      allSkills: [],
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.loadSkills = this.loadSkills.bind(this);
    this.loadSkillTypes = this.loadSkillTypes.bind(this);
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
    this.skillTypeChange = this.skillTypeChange.bind(this);
  }

  componentDidMount() {
    this.loadSkills();
    this.loadUserSkills();
    this.loadMissingSkills();
    this.loadSkillTypes();
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

  loadSkillTypes() {
    Fetch.json('/api/v1/admin/skills/skill_types')
      .then((data) => {
        this.setState({
          types: Object.keys(data),
        });
        if (Object.keys(data).length !== 0) {
          this.setState({
            selectedType: Object.keys(data)[0],
          });
        }
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

  skillTypeChange(event) {
    this.setState({ selectedType: event.target.value });
  }

  addCustomSkill() {
    Fetch.postJSON('/api/v1/admin/skills', {
      skill: {
        name: this.state.customSkill,
        type: this.state.selectedType,
      },
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

  findSkillTitleById(id) {
    const skill = this.state.allSkills.find((element) => {
      return element.id === id;
    });
    return skill.name;
  }

  checkCustomSkillButton() {
    if (this.state.customSkill.length > 0) {
      $('#add-custom-skill').css('visibility', 'visible');
    } else {
      $('#add-custom-skill').css('visibility', 'hidden');
    }
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
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
        {skillRates}
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
        <button
          id="submit-skill-rate"
          className="btn btn-default"
          onClick={this.addNewSkillRate}
        >
          Submit
        </button>
      </Collapsible>);
    const addCustomSkill =
    (<div>
      <p className="lead">Add custom skill to list</p>
      <input
        className="form-control"
        type="text"
        placeholder="Skill name"
        onChange={this.customSkillChange}
      />
      <Select
        className="form-control"
        onChange={this.skillTypeChange}
      >
        {this.state.types.map(type =>
          <option key={type} value={type}>{type.replace('_', ' ')}</option>)}
      </Select>
      <button
        id="add-custom-skill"
        className="btn btn-default"
        style={{ visibility: 'hidden' }}
        onClick={this.addCustomSkill}
      >
        Submit
      </button>
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
        <button
          id="destroy-skill-rate"
          className="btn btn-default"
          onClick={this.destroySkillRate}
        >
        Delete
        </button>
      </Collapsible>);
    return (
      <div id="skills">
        <span
          role="button"
          tabIndex={0}
          onClick={this.openModal}
        >
          <i className="fa fa-diamond fa-3x" />
        </span>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Skills"
        >
          <h2 className="display-3">Skill rates</h2>
          <div className="well">
            {skills}
            {addSkillRateCollapse}
            {destroySkillRatesCollapse}
            {addCustomSkill}
          </div>
        </Modal>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

Skills.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    role: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};

export default Skills;
