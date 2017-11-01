import React from 'react';
import { Link } from 'react-router-dom';
import Fetch from '../Fetch';


class UserEvaluations extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      evaluations: [],
    };
    this.loadEvaluations = this.loadEvaluations.bind(this);
  }

  componentWillMount() {
    this.loadEvaluations();
  }

  loadEvaluations() {
    Fetch.json('/api/v1/evaluations')
      .then((data) => {
        this.setState({ evaluations: data });
      }).catch(() => {
        this.setState({ evaluations: false });
      });
  }


  render() {
    const evaluations = this.state.evaluations.length > 0 ?
      (<div>
        <h3>Your evaluations</h3>
        <table id="table">
          <thead>
            <tr>
              <th>Due Date</th>
              <th>Goals</th>
            </tr>
          </thead>
          <tbody>
            {this.state.evaluations.map(evaluation =>
              (<tr key={evaluation.id}>
                <td>{evaluation.due_date}</td>
                <td>
                  <Link
                    to={`/user/evaluations/${evaluation.id}/goals/`}
                    className="btn btn-success"
                  >
                    {evaluation.goals_count}
                  </Link>
                </td>
              </tr>)
            )}
          </tbody>
        </table>
      </div>)
      :
      (<div>
        <h3>No evaluations yet</h3>
      </div>);

    return (
      <div>{evaluations}</div>
    );
  }
}

export default UserEvaluations;
