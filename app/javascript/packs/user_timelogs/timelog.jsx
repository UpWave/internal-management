import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-normalized-select';

class Timelog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editable: false,
      card: this.props.timelog.trello_card,
      startTime: this.props.timelog.start_time,
      duration: this.props.timelog.duration,
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleBack = this.handleBack.bind(this);
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

  handleBack() {
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
      <input type="datetime-local" className="form-control" onChange={this.handleStartDateChange} defaultValue={this.props.timelog.start_time.substring(0, this.props.timelog.start_time.length - 5)} />
      :
      <p className="lead">Start time: {(this.props.timelog.start_time.substring(0, this.props.timelog.start_time.length - 5)).replace('T', ' ')}</p>;
    const duration = this.state.editable ?
      <input type="number" className="form-control" onChange={this.handleDurationChange} defaultValue={this.props.timelog.duration} />
      :
      <p className="lead">Duration: {this.props.timelog.duration}</p>;
    const trelloCard = this.state.editable ?
      (<Select className="form-control" onChange={e => this.setState({ card: e.target.value })}>
        {this.props.trelloCards.map(option =>
          <option key={option} value={option}>{option}</option>)}
      </Select>)
      :
      <p className="lead">Trello card: {this.props.timelog.trello_card}</p>;
    const endTime = this.state.editable ?
      null
      :
      <p className="lead">End time: {(this.props.timelog.end_time.substring(0, this.props.timelog.start_time.length - 5)).replace('T', ' ')}</p>;

    return (
      <div key={this.props.timelog.id}>
        {startTime}
        {duration}
        {trelloCard}
        {endTime}
        <button className="btn btn-danger" onClick={this.handleDelete}> Delete</button>
        <button className="btn btn-primary" onClick={this.handleEdit}> {this.state.editable ? 'Submit' : 'Edit' } </button>
        <button
          id="back-button"
          className="btn btn-info"
          style={this.state.editable ? { visibility: 'visible' } : { visibility: 'hidden' }}
          onClick={this.handleBack}
        >
          Back
        </button>
      </div>
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
