import React from 'react';
import AlertContainer from 'react-alert';
import { Link } from 'react-router-dom';
import Fetch from '../Fetch';


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
      .then(function(data) {
        this.setState({
          evaluation: data.evaluation,
          goals: data.goals,
        });
      }.bind(this));
  }

  render() {
    const dueDate =
      (<div>
        <text className="lead">{this.state.evaluation.due_date}</text><br />
      </div>);

    const goalsTable = this.state.goals.length > 0 ?
      (<div className="agile-grids">
        <div className="agile-tables">
          <div className="w3l-table-info">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mark</th>
                </tr>
              </thead>
              <tbody>
                { this.state.goals.map(goal =>
                  (<tr key={goal.id}>
                    <td>
                      <p className="lead">{goal.name}</p>
                    </td>
                    <td>
                      <p className="lead">{goal.mark}</p>
                    </td>
                  </tr>)
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
        {goalsTable}

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

export default UserEvaluationGoals;
