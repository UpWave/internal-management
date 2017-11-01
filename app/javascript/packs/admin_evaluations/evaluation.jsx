import React from 'react';
import { Link } from 'react-router-dom';


class Evaluation extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editable: false,
      dueDate: this.props.evaluation.dueDate,
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleDueDateChange = this.handleDueDateChange.bind(this);
  }

  handleEdit() {
    if (this.state.editable) {
      const id = this.props.evaluation.id;
      const dueDate = this.state.dueDate;
      const evaluation = {
        due_date: dueDate,
      };
      this.props.handleUpdate(evaluation, id);
    }
    this.setState({ editable: !this.state.editable });
  }

  handleDueDateChange(event) {
    this.setState({ dueDate: event.target.value });
  }

  handleDelete() {
    this.props.handleDelete(this.props.evaluation.id);
  }

  handleBack() {
    this.setState({ editable: !this.state.editable });
  }

  render() {
    const dueDate = this.state.editable ?
      (<div>
        <input
          className="form-control"
          type="date"
          onChange={this.handleDueDateChange}
          defaultValue={this.props.evaluation.due_date}
        />
      </div>)
      :
      (<div>
        <text className="lead">{this.props.evaluation.due_date}</text><br />
      </div>);


    return (
      <tr>
        <td>{dueDate}</td>
        <td><Link to={`/admin/users/${this.props.evaluation.user_id}/evaluation/${this.props.evaluation.id}`} className="btn btn-success">{this.props.evaluation.goals_count}</Link></td>
        <td>
          <button className="btn btn-danger" onClick={this.handleDelete}>Delete</button>
          <button className="btn btn-info" onClick={this.handleEdit}> {this.state.editable ? 'Submit' : 'Edit' } </button>
          <button
            className="btn btn-default"
            id="back-button"
            style={this.state.editable ? { visibility: 'visible' } : { visibility: 'hidden' }}
            onClick={this.handleBack}
          >
              Back
          </button>
        </td>
      </tr>
    );
  }
}

export default Evaluation;
