import React from 'react';
import AlertContainer from 'react-alert';
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
    $.ajax({
      url: '/api/v1/admin/skills',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({ skills: data });
      },
    });
  }

  handleUpdate(skill) {
    $.ajax({
      url: `/api/v1/admin/skills/${skill.id}`,
      type: 'PATCH',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: { skill },
      success: () => {
        this.msg.success('Successfully updated skill');
        this.loadSkills();
      },
      error: (xhr) => {
        this.msg.error($.parseJSON(xhr.responseText).errors);
      },
    });
  }

  handleDelete(id) {
    $.ajax({
      url: `/api/v1/admin/skills/${id}`,
      type: 'DELETE',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      success: () => {
        this.msg.success('Successfully deleted skill');
        this.loadSkills();
      },
      error: (xhr) => {
        this.msg.error($.parseJSON(xhr.responseText).errors);
      },
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
