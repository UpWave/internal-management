import React from 'react';
import PropTypes from 'prop-types';

class Skill extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editable: false,
      name: this.props.skillName,
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleDelete() {
    this.props.handleDelete(this.props.id);
  }

  handleEdit() {
    if (this.state.editable) {
      const skillId = this.props.id;
      const skillName = this.state.name;
      const skill = { id: skillId, name: skillName };
      this.props.handleUpdate(skill);
    }
    this.setState({ editable: !this.state.editable });
  }

  handleBack() {
    this.setState({ editable: !this.state.editable });
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  render() {
    const name = this.state.editable ?
      (<div>
<<<<<<< HEAD
        <input type="text" onChange={this.handleNameChange} defaultValue={this.props.skillName} /><br />
      </div>)
      :
      <h4>{this.props.skillName}</h4>;
=======
        <input type="text" onChange={this.handleNameChange} defaultValue={this.props.skill.name} /><br />
      </div>)
      :
      <h4>{this.props.skill.name}</h4>;
>>>>>>> modal for creating user
    return (
      <div key={this.props.id}>
        {name}
        <button onClick={this.handleDelete}> Delete</button>
        <button onClick={this.handleEdit}> {this.state.editable ? 'Submit' : 'Edit' } </button>
        <button
          id="back-button"
          style={this.state.editable ? { visibility: 'visible' } : { visibility: 'hidden' }}
          onClick={this.handleBack}
        >
          Back
        </button>
        <br />
        <br />
      </div>
    );
  }
}

Skill.propTypes = {
  skill: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Skill;
