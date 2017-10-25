import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class Timelog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editable: false,
      board: this.props.timelog.trello_board,
      card: this.props.timelog.trello_card,
      taskDescription: this.props.timelog.task_description,
      startTime: this.props.timelog.start_time,
      duration: this.props.timelog.duration,
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleTaskDescriptionChange = this.handleTaskDescriptionChange.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleDelete() {
    this.props.handleDelete(this.props.timelog.id);
  }

  handleEdit() {
    if (this.state.editable) {
      const id = this.props.timelog.id;
      const taskDescription = this.state.taskDescription;
      const startTime = this.state.startTime;
      const duration = this.state.duration;
      const timelog = {
        id,
        start_time: startTime,
        duration,
        task_description: taskDescription,
      };
      this.props.handleUpdate(timelog);
    }
    this.setState({ editable: !this.state.editable });
  }

  handleStartDateChange(event) {
    this.setState({ startTime: event.target.value });
  }

  handleDurationChange(event) {
    this.setState({ duration: event.target.value });
  }

  handleTaskDescriptionChange(event) {
    this.setState({ taskDescription: event.target.value });
  }

  handleBack() {
    this.setState({ editable: false });
  }

  render() {
    const startTime = this.state.editable ?
      (<input
        type="datetime-local"
        className="form-control"
        onChange={this.handleStartDateChange}
        defaultValue={moment(this.props.timelog.start_time).format('YYYY-MM-DDTHH:mm')}
      />)
      :
      moment(this.props.timelog.start_time).format('YYYY/MM/DD, HH:mm');
    const duration = this.state.editable ?
      (<input
        type="number"
        className="form-control"
        onChange={this.handleDurationChange}
        defaultValue={this.props.timelog.duration}
      />)
      :
      this.props.timelog.duration;
    const trelloBoard = this.props.timelog.trello_board;
    const endTime =
      moment(this.props.timelog.end_time).format('YYYY/MM/DD, HH:mm');
    let cardOrTaskDescription = null;
    if (this.state.taskDescription != null) {
      cardOrTaskDescription = this.state.editable ?
        (<input
          type="text"
          className="form-control"
          onChange={this.handleTaskDescriptionChange}
          defaultValue={this.state.taskDescription}
        />)
        :
        this.state.taskDescription;
    } else {
      cardOrTaskDescription = this.props.timelog.trello_card;
    }

    return (
      <tr>
        <td>{startTime}</td>
        <td>{duration}</td>
        <td>{trelloBoard}</td>
        <td>{cardOrTaskDescription}</td>
        <td>{endTime}</td>
        <td>
          <button
            className="btn btn-danger"
            onClick={this.handleDelete}
            style={this.state.editable ? { display: 'none' } : { display: 'block' }}
          >
          Delete
          </button>
          <button
            className="btn btn-primary"
            onClick={this.handleEdit}
          >
            {this.state.editable ? 'Submit' : 'Edit' }
          </button>
          <button
            id="back-button"
            className="btn btn-info"
            style={this.state.editable ? { display: 'block' } : { display: 'none' }}
            onClick={this.handleBack}
          >
            Back
          </button>
        </td>
      </tr>
    );
  }
}

Timelog.propTypes = {
  timelog: PropTypes.shape({
    id: PropTypes.number,
    trello_card: PropTypes.string,
    trello_board: PropTypes.string,
    duration: PropTypes.number,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
  }).isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Timelog;
