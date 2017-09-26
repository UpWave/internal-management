import React from 'react';
import PropTypes from 'prop-types';
import Fetch from 'fetch-rails';
import Select from 'react-normalized-select';
import AlertContainer from 'react-alert';

class NewTimelog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      card: false,
      duration: 0,
      startTime: 0,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
  }

  handleClick() {
    const startTime = this.state.startTime;
    const duration = this.state.duration;
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
      });
  }

  handleStartDateChange(event) {
    this.setState({ startTime: event.target.value });
  }

  handleDurationChange(event) {
    this.setState({ duration: event.target.value });
  }

  render() {
    return (
      <div id="new_timelog">
        <h3>Create a new timelog!</h3>
        <input type="datetime-local" onChange={this.handleStartDateChange} /><br />
        <input type="number" onChange={this.handleDurationChange} placeholder="Enter duration in minutes" /><br />
        <Select className="mySelect" onChange={e => this.setState({ card: e.target.value })}>
          {this.props.trelloCards.map(option =>
            <option key={option} value={option}>{option}</option>)}
        </Select>
        <br />
        <button onClick={this.handleClick}>Create</button><br />
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
