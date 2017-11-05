import React from 'react';
import PropTypes from 'prop-types';


class GoalsTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleRemoveGoal = this.handleRemoveGoal.bind(this);
  }

  handleRemoveGoal(goal) {
    this.props.handleRemoveGoal(goal);
  }

  render() {
    const goals = this.props.goals.map((goal, index) => {
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

    const table = this.props.goals.length > 0 ?
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

    return (
      <div>
        {table}
      </div>
    );
  }
}

export default GoalsTable;

GoalsTable.propTypes = {
  handleRemoveGoal: PropTypes.func.isRequired,
};
