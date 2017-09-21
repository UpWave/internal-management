import React from 'react';
import PropTypes from 'prop-types';
import Skill from './skill';

class Skills extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleDelete = this.handleDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }
  onUpdate(skill) {
    this.props.onUpdate(skill);
  }

  handleDelete(id) {
    this.props.handleDelete(id);
  }

  render() {
    const skills = this.props.skills.map(skill => (
      <Skill
        id={skill.id}
        key={skill.id}
        skill={skill.name}
        handleDelete={this.handleDelete}
        handleUpdate={this.onUpdate}
      />
    ));
    return (
      <div>
        <h3>Skills</h3>
        {skills}
        <br />
      </div>
    );
  }
}

Skills.propTypes = {
  skills: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })).isRequired,
  onUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Skills;
