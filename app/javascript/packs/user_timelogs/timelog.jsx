import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-normalized-select';

class Timelog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editable: false,
      card: this.props.timelog.trelloCard,
      startTime: this.props.timelog.start_time,
      duration: this.props.timelog.duration,
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
  }

  handleDelete() {
    this.props.handleDelete(this.props.timelog.id);
  }

  handleEdit() {
    if (this.state.editable) {
      const id = this.props.timelog.id;
      const startTime = this.state.startTime;
      const duration = this.state.duration;
      const trelloCard = this.state.card;
      const timelog = { id, start_time: startTime, duration, trello_card: trelloCard };
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

  render() {
    const startTime = this.state.editable ?
      <input type="datetime-local" onChange={this.handleStartDateChange} defaultValue={this.props.timelog.start_time.substring(0, this.props.timelog.start_time.length - 5)} />
      :
      <p>Start time: {this.props.timelog.start_time.substring(0, this.props.timelog.start_time.length - 5)}</p>;
    const duration = this.state.editable ?
      <input type="number" onChange={this.handleDurationChange} defaultValue={this.props.timelog.duration} />
      :
      <p>Duration: {this.props.timelog.duration}</p>;
    const trelloCard = this.state.editable ?
      (<Select className="mySelect" onChange={e => this.setState({ card: e.target.value })}>
        {this.props.trelloCards.map(option =>
          <option key={option} value={option}>{option}</option>)}
      </Select>)
      :
      <p>Trello card: {this.props.timelog.trello_card}</p>;
    const endTime = this.state.editable ?
      null
      :
      <p>End time: {this.props.timelog.end_time.substring(0, this.props.timelog.start_time.length - 5)}</p>;

    return (
      <div key={this.props.timelog.id}>
        {startTime}
        {duration}
        {trelloCard}
        {endTime}
        <button onClick={this.handleDelete}> Delete</button>
        <button onClick={this.handleEdit}> {this.state.editable ? 'Submit' : 'Edit' } </button>
      </div>
    );
  }
}

Timelog.propTypes = {
  timelog: PropTypes.shape.isRequired,
  trelloCards: PropTypes.arrayOf.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Timelog;
