import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-normalized-select';
import AlertContainer from 'react-alert';
import Fetch from '../Fetch';

class NewTimelog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      card: false,
      startTime: 0,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleHoursChange = this.handleHoursChange.bind(this);
    this.handleMinutesChange = this.handleMinutesChange.bind(this);
  }

  handleClick() {
    const startTime = this.state.startTime;
    const duration = (this.state.hours * 60) + parseInt(this.state.minutes, 10);
    const trelloCard = this.state.card || this.props.trelloCards[0];
    Fetch.postJSON('/api/v1/timelogs', {
      timelog: {
        start_time: startTime,
        duration,
        trello_card: trelloCard,
      },
    })
      .then(() => {
        this.msg.success('Successfully created timelog!');
        this.props.handleSubmit();
      }).catch((e) => {
        this.msg.error(e.errors);
      });
  }

  handleStartDateChange(event) {
    this.setState({ startTime: event.target.value });
  }

  handleHoursChange(event) {
    this.setState({ hours: event.target.value });
  }

  handleMinutesChange(event) {
    this.setState({ minutes: event.target.value });
  }

  render() {
    return (
      <div id="new_timelog" className="row">
        <div className="col-md-4">
          <h3>Create a new timelog!</h3>
          <input
            className="form-control"
            type="datetime-local"
            onChange={this.handleStartDateChange}
          />
          <br />
          <input
            className="form-control"
            type="number"
            onChange={this.handleHoursChange}
            placeholder="Enter duration in hours"
          />
          <br />
          <input
            className="form-control"
            type="number"
            onChange={this.handleMinutesChange}
            placeholder="Enter duration in minutes"
          />
          <br />
          <Select
            className="form-control"
            onChange={e => this.setState({ card: e.target.value })}
          >
            {this.props.trelloCards.map(option =>
              <option key={option} value={option}>{option}</option>)}
          </Select>
          <br />
          <button
            className="btn btn-success"
            onClick={this.handleClick}
          >
          Create
          </button>
          <br />
        </div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

NewTimelog.propTypes = {
  trelloCards: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default NewTimelog;
