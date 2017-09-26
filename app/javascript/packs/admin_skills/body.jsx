import React from 'react';
import AlertContainer from 'react-alert';
import Fetch from 'fetch-rails';
import Skills from './skills';

class AdminSkills extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skills: [],
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.loadSkills = this.loadSkills.bind(this);
  }

  componentDidMount() {
    this.loadSkills();
  }

  loadSkills() {
    Fetch.json('/api/v1/admin/skills')
      .then((data) => {
        this.setState({ skills: data });
      });
  }

  handleUpdate(skill) {
    Fetch.putJSON(`/api/v1/admin/skills/${skill.id}`, {
      skill: skill,
    })
      .then(() => {
        this.msg.success('Successfully updated skill');
        this.loadSkills();
      }).catch((errorResponse) => {
        this.msg.error(errorResponse.errors);
      });
  }

  handleDelete(id) {
    Fetch.deleteJSON(`/api/v1/admin/skills/${id}`)
      .then(() => {
        this.msg.success('Successfully deleted skill');
        this.loadSkills();
      }).catch((errorResponse) => {
        this.msg.error(errorResponse.errors);
      });
  }


  render() {
    return (
      <div className="well">
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <Skills
          key={this.state.skills.length.toString()}
          skills={this.state.skills}
          handleDelete={this.handleDelete}
          onUpdate={this.handleUpdate}
        />
      </div>
    );
  }
}


export default AdminSkills;
