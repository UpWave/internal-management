import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-normalized-select';
import moment from 'moment';

class Timelog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editable: false,
      taskDescription: this.props.timelog.task_description,
      board: this.props.timelog.trello_board,
      card: this.props.timelog.trello_card,
      startTime: this.props.timelog.start_time,
      duration: this.props.timelog.duration,
      boardCards: this.props.trelloData[this.props.timelog.trello_board],
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.boardChange = this.boardChange.bind(this);
    this.handleTaskDescriptionChange = this.handleTaskDescriptionChange.bind(this);
  }

  handleDelete() {
    this.props.handleDelete(this.props.timelog.id);
  }

  handleEdit() {
    if (this.state.editable) {
      const id = this.props.timelog.id;
      const startTime = this.state.startTime;
      const duration = this.state.duration;
      const taskDescription = this.state.taskDescription;
      const trelloCard = this.state.card;
      const trelloBoard = this.state.board;
      const timelog = {
        id,
        start_time: startTime,
        duration,
        task_description: taskDescription,
        trello_card: trelloCard,
        trello_board: trelloBoard,
      };
      this.props.handleUpdate(timelog);
    }
    this.setState({ editable: !this.state.editable });
  }

  handleBack() {
    this.setState({
      editable: false,
    });
  }

  handleStartDateChange(event) {
    this.setState({ startTime: event.target.value });
  }

  handleDurationChange(event) {
    this.setState({ duration: event.target.value });
  }

  boardChange(event) {
    this.setState({
      board: event.target.value,
      boardCards: this.props.trelloData[event.target.value],
      card: this.props.trelloData[event.target.value][0] || null,
    });
  }

  handleTaskDescriptionChange(event) {
    this.setState({ taskDescription: event.target.value });
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
    const trelloBoard = this.state.editable && this.state.card !== '' ?
      (<Select
        defaultValue={this.state.board}
        className="form-control"
        onChange={this.boardChange}
      >
        {Object.keys(this.props.trelloData).map(option =>
          <option key={option} value={option}>{option}</option>)}
      </Select>)
      :
      this.props.timelog.trello_board;

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
      cardOrTaskDescription = this.state.editable ?
        (<Select
          value={this.state.value}
          className="form-control"
          onChange={e => this.setState({ card: e.target.value })}
        >
          <option value="0" disabled hidden>Select trello card</option>
          {this.state.boardCards.map(option =>
            <option key={option} value={option}>{option}</option>)}
        </Select>)
        :
        this.props.timelog.trello_card;
    }

    const endTime =
      moment(this.props.timelog.end_time).format('YYYY/MM/DD, HH:mm');

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
    task_description: PropTypes.string,
  }).isRequired,
  trelloData: PropTypes.shape().isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Timelog;
