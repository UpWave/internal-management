import React from 'react';
import PropTypes from 'prop-types';
import Goal from './goal';

class Goals extends React.Component {
  render() {
    const goals = this.props.goals.map(goal => (
      <Goal
        id={goal.id}
        name={goal.name}
        mark={goal.mark}
      />
    ));

    return (
      <div className="agile-grids">
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
                {goals}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

Goals.propTypes = {
  goals: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    mark: PropTypes.string,
  })).isRequired,
};

export default Goals;
