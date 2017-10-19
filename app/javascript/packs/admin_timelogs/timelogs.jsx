import React from 'react';
import PropTypes from 'prop-types';
import Timelog from './timelog';

class Timelogs extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleDelete = this.handleDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }
  onUpdate(timelog) {
    this.props.onUpdate(timelog);
  }

  handleDelete(id) {
    this.props.handleDelete(id);
  }

  render() {
    const timelogs = this.props.timelogs.map(timelog => (
      <Timelog
        id={timelog.id}
        key={timelog.id.toString()}
        timelog={timelog}
        handleDelete={this.handleDelete}
        handleUpdate={this.onUpdate}
      />
    ));
    return (
      <table id="table">
        <thead>
          <tr>
            <th>Start time</th>
            <th>Duration</th>
            <th>Board</th>
            <th>Card</th>
            <th>End time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {timelogs}
        </tbody>
      </table>
    );
  }
}

Timelogs.propTypes = {
  timelogs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    trello_card: PropTypes.string,
    trello_board: PropTypes.string,
    duration: PropTypes.number,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
  })).isRequired,
  onUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Timelogs;
