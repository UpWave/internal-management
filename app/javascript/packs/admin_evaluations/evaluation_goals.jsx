import React from 'react';
import AlertContainer from 'react-alert';
import Select from 'react-normalized-select';
import { Link } from 'react-router-dom';
import Fetch from '../Fetch';


class EvaluationGoals extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.userId = this.props.match.params.user_id;
    this.id = this.props.match.params.id;
    this.state = {
      editableDate: false,
      evaluation: "",
      goals:[],
    };
    this.loadEvaluation = this.loadEvaluation.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDueDateEdit = this.handleDueDateEdit.bind(this);
    this.handleDueDateChange = this.handleDueDateChange.bind(this);
    this.handleDueDateBack = this.handleDueDateBack.bind(this);
    this.handleUpdateDueDate = this.handleUpdateDueDate.bind(this);
    this.handleMarkChange = this.handleMarkChange.bind(this);
    this.handleGoalEdit = this.handleGoalEdit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  componentWillMount() {
    this.loadEvaluation();
  }

  loadEvaluation() {
    Fetch.json(`/api/v1/admin/user/users/${this.userId}/evaluations/${this.id}`)
      .then(function(data) {
        this.setState({
          evaluation: data.evaluation,
          goals: data.goals,
        });
      }.bind(this));
  }

  handleDelete(goalId) {
    Fetch.deleteJSON(`/api/v1/admin/user/users/${this.userId}/goals/`.concat(goalId))
      .then(() => {
        this.loadEvaluation();
      });
  }

  handleDueDateChange(e) {
    this.setState({ dueDate: e.target.value });
  }

  handleDueDateEdit() {
    if (this.state.editableDate) {
      const evaluation = {
        due_date: this.state.dueDate
      };
      this.handleUpdateDueDate(evaluation);
    }
    this.setState({ editableDate: !this.state.editableDate });
  }

  handleDueDateBack() {
    this.setState({ editableDate: !this.state.editableDate });
  }

  handleUpdateDueDate(evaluation) {
    Fetch.putJSON(`/api/v1/admin/user/users/${this.userId}/evaluations/${this.id}`, {
      evaluation
    })
      .then(() => {
        this.msg.success(`Successfully updated due date`);
        this.loadEvaluation();
      }).catch((errorResponse) => {
      this.msg.error(errorResponse.errors);
    });
  }

  handleMarkChange(e) {
    this.setState({ mark: e.target.value });
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handleGoalEdit(id) {
      const goal = {
        name: this.state.name,
        mark: this.state.mark
    };
    this.handleGoalUpdate(goal, id);
  }

  handleGoalUpdate(goal, id) {
    Fetch.putJSON(`/api/v1/admin/user/users/${this.userId}/goals/${id}`, {
      goal
    })
      .then(() => {
        this.msg.success(`Successfully updated goal`);
        this.loadEvaluation();
      }).catch((errorResponse) => {
      this.msg.error(errorResponse.errors);
    });
  }


  render() {
    const dueDate = this.state.editableDate ?
      (<div>
        <input className="form-control" type="date" onChange={this.handleDueDateChange} defaultValue={this.state.evaluation.due_date} />
      </div>)
      :
      (<div>
        <text className="lead">{this.state.evaluation.due_date}</text><br />
      </div>);

    const marks = Array(10).fill(0).map((e,i)=>i+1);

    const goalsTable = this.state.goals.length > 0 ?
      (<div className="agile-grids">
          <div className="agile-tables">
            <div className="w3l-table-info">
              <table>
                <thead>
                <tr>
                  <th>Name</th>
                  <th>Mark</th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                { this.state.goals.map((goal) =>
                  <tr key={goal.id}>
                    <td>
                      <input className="form-control" type="text" onChange={this.handleNameChange} defaultValue={goal.name} />
                    </td>
                    <td>
                      <Select
                        className="form-control"
                        defaultValue={goal.mark}
                        onChange={this.handleMarkChange}
                      >
                        <option key='0' value='0'>Choose mark</option>
                        {marks.map(option =>
                          <option key={option} value={option}>{option}</option>)}
                      </Select>
                    </td>
                    <td>
                      <button className="btn btn-danger" onClick={() => {this.handleDelete(goal.id)}}>Delete</button>
                      <button
                        className="btn btn-info"
                        onClick={() => {this.handleGoalEdit(goal.id)}}
                      >
                        Submit
                      </button>
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
      :
      null;

    return (
      <div>
        <h3>Evaluation - {dueDate}</h3>
        <button className="btn btn-info" onClick={this.handleDueDateEdit}> {this.state.editableDate ? 'Submit' : 'Edit' } </button>
        <button
          className="btn btn-default"
          style={this.state.editableDate ? { visibility: 'visible' } : { visibility: 'hidden' }}
          onClick={this.handleDueDateBack}
        >
          Back
        </button>
        {goalsTable}

        <Link
          to={`/admin/users/${this.userId}/evaluations`}
          className="btn btn-success"
        >
          Back
        </Link>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

export default EvaluationGoals;
