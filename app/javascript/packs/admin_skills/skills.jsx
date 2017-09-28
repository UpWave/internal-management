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
      <div key={skill.id} className="col-sm-4">
        <div className="well">
          <Skill
            id={skill.id}
            key={skill.id}
            skillName={skill.name}
            skillType={skill.type}
            handleDelete={this.handleDelete}
            handleUpdate={this.onUpdate}
          />
        </div>
      </div>
    ));
    return (
      <div>
        <h3>Skills</h3>
        <div className="row">
          {skills}
        </div>
      </div>
    );
  }
}

Skills.propTypes = {
  skills: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    type: PropTypes.string,
  })).isRequired,
  onUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Skills;
