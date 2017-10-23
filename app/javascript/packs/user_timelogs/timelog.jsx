import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-normalized-select';
import moment from 'moment';
import 'moment-timezone';

class Timelog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editable: false,
      value: '0',
      task: this.props.timelog.task,
      card: this.props.timelog.trello_card,
      startTime: this.props.timelog.start_time,
      duration: this.props.timelog.duration,
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleTaskChange = this.handleTaskChange.bind(this);
  }

  handleDelete() {
    this.props.handleDelete(this.props.timelog.id);
  }

  handleEdit() {
    if (this.state.editable) {
      const id = this.props.timelog.id;
      const startTime = this.state.startTime;
      const duration = this.state.duration;
      const task = this.state.task;
      const trelloCard = this.state.card;
      const timelog = { id, start_time: startTime, duration, task: task, trello_card: trelloCard };
      this.props.handleUpdate(timelog);
    }
    this.setState({ editable: !this.state.editable });
  }

  handleBack() {
    this.setState({ editable: !this.state.editable });
  }

  handleStartDateChange(event) {
    this.setState({ startTime: event.target.value });
  }

  handleDurationChange(event) {
    this.setState({ duration: event.target.value });
  }

  handleTaskChange(event) {
    this.setState({ task: event.target.value });
  }

  render() {
    const startTime = this.state.editable ?
      (<input
        type="datetime-local"
        className="form-control"
        onChange={this.handleStartDateChange}
        defaultValue={moment(this.props.timelog.start_time).tz('Atlantic/Reykjavik').format('YYYY-MM-DDTHH:mm')}
      />)
      :
      moment(this.props.timelog.start_time).tz('Atlantic/Reykjavik').format('YYYY/MM/DD, HH:mm');

    const duration = this.state.editable ?
      (<input
        type="number"
        className="form-control"
        onChange={this.handleDurationChange}
        defaultValue={this.props.timelog.duration}
      />)
      :
      this.props.timelog.duration;

    const endTime =
      moment(this.props.timelog.end_time).tz('Atlantic/Reykjavik').format('YYYY/MM/DD, HH:mm');

    let cardOrTask = null;
    if (this.state.task != null) {
      cardOrTask = this.state.editable ?
        (<input
          type="text"
          className="form-control"
          onChange={this.handleTaskChange}
          defaultValue={this.props.timelog.task}
        />)
        :
        this.props.timelog.task;
    } else {
      cardOrTask = this.state.editable ?
        (<Select
          value={this.state.value}
          className="form-control"
          onChange={e => this.setState({ card: e.target.value })}
        >
          <option value="0" disabled hidden>Select trello card</option>
          {this.props.trelloCards.map(option =>
            <option key={option} value={option}>{option}</option>)}
        </Select>)
        :
        this.props.timelog.trello_card;
    }

    return (
      <tr>
        <td>{startTime}</td>
        <td>{duration}</td>
        <td>{cardOrTask}</td>
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
    duration: PropTypes.number,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
  }).isRequired,
  trelloCards: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Timelog;
