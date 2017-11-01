import React from 'react';
import Select from 'react-normalized-select';
import AlertContainer from 'react-alert';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import Fetch from '../Fetch';

class NewAdminEvaluation extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.userId = this.props.match.params.user_id;

    this.emptyGoal = {
      name: '',
      mark: '',
      id: null,
      _destroy: false,
    };

    this.state = {
      redirect: false,
      goalName: '',
      goalMark: '0',
      evaluation: {
        dueDate: '',
        goals_attributes: [Object.assign({}, this.emptyGoal)]
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDueDateChange = this.handleDueDateChange.bind(this);
    this.handleGoalNameChange = this.handleGoalNameChange.bind(this);
    this.handleMarkChange = this.handleMarkChange.bind(this);
    this.handleAddGoal = this.handleAddGoal.bind(this);
    this.handleRemoveGoal = this.handleRemoveGoal.bind(this);
  }

  componentWillMount() {
    this.state.evaluation.goals_attributes[0]._destroy = true;
  }

  componentDidMount() {
    $('#add-goal').hide();
    $('#submit').hide();
  }

  handleSubmit() {
    const dueDate = this.state.evaluation.dueDate;
    const evaluationGoals = this.state.evaluation.goals_attributes;
    Fetch.postJSON(`/api/v1/admin/user/users/${this.userId}/evaluations`, {
      evaluation: {
        user_id: this.userId,
        due_date: dueDate,
        goals_attributes: evaluationGoals,
      },
    })
      .then(() => {
        this.msg.success('Successfully created evaluation!');
        this.setState({ redirect: true });
      }).catch((errorResponse) => {
        this.msg.error(errorResponse.errors);
      });
  }

  handleDueDateChange(e) {
    const evaluation = this.state.evaluation;
    evaluation.dueDate = e.target.value;
    this.setState({ evaluation: this.state.evaluation });
  }

  handleGoalNameChange(e) {
    const goal = this.emptyGoal;
    goal.name = e.target.value;
    this.setState({ goalName: e.target.value });
    if (goal.name.length > 0) {
      $('#add-goal').show();
    } else {
      $('#add-goal').hide();
    }
  }

  handleMarkChange(e) {
    const goal = this.emptyGoal;
    goal.mark = parseInt(e.target.value, 10);
    this.setState({ goalMark: e.target.value });
  }

  handleAddGoal() {
    this
      .state
      .evaluation
      .goals_attributes
      .push(Object.assign({}, this.emptyGoal));
    this.setState({ evaluation: this.state.evaluation });
    this.setState({ goalName: '' });
    this.setState({ goalMark: '' });
  }

  handleRemoveGoal(goal) {
    goal._destroy = true;
    this.setState({ evaluation: this.state.evaluation });
  }

  render() {
    if (this.state.redirect) {
      return (
        <Redirect to={`/admin/users/${this.userId}/evaluations`} />
      );
    }

    const submitButton = this.state.evaluation.goals_attributes.length > 1 && this.state.evaluation.dueDate !== '' ?
      (
        <button
          id="submit"
          className="btn btn-success"
          onClick={this.handleSubmit}
        >
          Create Evaluation
        </button>
      )
      :
      null;

    const goals = this.state.evaluation.goals_attributes.map((goal, index) => {
      if (goal._destroy === false) {
        return (
          <tr>
            <td>{goal.name}</td>
            <td>{goal.mark}</td>
            <td>
              <button
                className="btn btn-danger"
                onClick={e => this.handleRemoveGoal(goal)}
              >
                Delete
              </button>
            </td>
          </tr>
        );
      }
    });

    const table = this.state.evaluation.goals_attributes.length > 1 ?
      (<div>
        <h3>Evaluation goals:</h3>
        <table id="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mark</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {goals}
          </tbody>
        </table>
      </div>)
      :
      null;

    const marks = Array(10).fill(0).map((e, i) => i + 1);
    return (
      <div>
        <div>
          {table}
        </div>

        <div className="row">
          <div className="col-md-4">
            <h3>Add new Goal:</h3>
            <div className="goals-fieldset">
              <input
                className="form-control"
                type="text"
                placeholder="Goal Name"
                value={this.state.goalName}
                onChange={this.handleGoalNameChange}
              />
              <br />
              <Select
                className="form-control"
                value={this.state.goalMark}
                onChange={this.handleMarkChange}
              >
                <option key='0' value='0'>Choose mark</option>)
                {marks.map(option =>
                  <option key={option} value={option}>{option}</option>)}
              </Select>
            </div>
            <br />
            <button
              id="add-goal"
              className="btn btn-success"
              onClick={this.handleAddGoal}>
              + Add Goal
            </button>

            <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
          </div>

          <div className="col-md-4">
            <h3>Evaluation due date:</h3>
            <input
              className="form-control"
              type="date"
              min={new Date().toJSON().slice(0,10)}
              onChange={e => this.handleDueDateChange(e)}
            />
            <br />
            {submitButton}
          </div>
        </div>
        <Link to={`/admin/users/${this.userId}/evaluations`} className="btn btn-success" style={{ marginTop: 20 }}>Back</Link>
      </div>
    );
  }
}

export default NewAdminEvaluation;
