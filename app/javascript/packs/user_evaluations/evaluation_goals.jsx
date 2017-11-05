import React from 'react';
import PropTypes from 'prop-types';
import AlertContainer from 'react-alert';
import { Link } from 'react-router-dom';
import Fetch from '../Fetch';
import Goals from './goals'

class UserEvaluationGoals extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.userId = this.props.match.params.user_id;
    this.id = this.props.match.params.id;
    this.state = {
      evaluation: '',
      goals: [],
    };
    this.loadEvaluation = this.loadEvaluation.bind(this);
  }

  componentWillMount() {
    this.loadEvaluation();
  }

  loadEvaluation() {
    Fetch.json(`/api/v1/admin/user/users/${this.userId}/evaluations/${this.id}`)
      .then(data => (
        this.setState({
          evaluation: data.evaluation,
          goals: data.goals,
        })
      ));
  }

  render() {
    const dueDate =
      (<div>
        <text className="lead">{this.state.evaluation.due_date}</text><br />
      </div>);

    return (
      <div>
        <h3>Evaluation - {dueDate}</h3>
        <Goals
          goals={this.state.goals}
        />

        <Link
          to={'/user/evaluations/'}
          className="btn btn-success"
        >
          Back
        </Link>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

UserEvaluationGoals.propTypes = {
  loadEvaluation: PropTypes.func.isRequired,
};

export default UserEvaluationGoals;
