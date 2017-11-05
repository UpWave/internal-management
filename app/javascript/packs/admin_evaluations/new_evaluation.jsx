import React from 'react';
import AlertContainer from 'react-alert';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import Fetch from '../Fetch';
import GoalsTable from './goals_table'
import Form from './form'


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
    this.state.evaluation.goals_attributes.shift();
  }

  componentDidMount() {
    $('#submit').hide();
  }

  handleSubmit() {
    const dueDate = this.state.evaluation.dueDate;
    const evaluationGoals = this.state.evaluation.goals_attributes;
    Fetch.postJSON(`/api/v1/admin/user/users/${this.userId}/evaluations`, {
      evaluation: {
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

    return (
      <div>
        <div>
          <GoalsTable
            goals={this.state.evaluation.goals_attributes}
            handleRemoveGoal={this.handleRemoveGoal}
          />
        </div>

        <div>
          <Form
            goalName={this.state.goalName}
            handleGoalNameChange={this.handleGoalNameChange}
            goalMark={this.state.goalMark}
            handleMarkChange={this.handleMarkChange}
            handleAddGoal={this.handleAddGoal}
            handleDueDateChange={this.handleDueDateChange}
            handleSubmit={this.handleSubmit}
            evaluation={this.state.evaluation}
            goalName={this.state.goalName}
          />
        </div>
        <Link to={`/admin/users/${this.userId}/evaluations`} className="btn btn-success" style={{ marginTop: 20 }}>Back</Link>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

export default NewAdminEvaluation;
