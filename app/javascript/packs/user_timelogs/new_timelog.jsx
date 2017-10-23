import React from 'react';
import Select from 'react-normalized-select';
import AlertContainer from 'react-alert';
import { Redirect } from 'react-router';
import Fetch from '../Fetch';

class NewUserTimelog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      redirect: false,
      startTime: 0,
      trelloData: [],
      boardCards: [],
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleHoursChange = this.handleHoursChange.bind(this);
    this.handleMinutesChange = this.handleMinutesChange.bind(this);
    this.boardChange = this.boardChange.bind(this);
  }

  componentDidMount() {
    Fetch.json('/api/v1/profile/trello_boards')
      .then((data) => {
        this.setState({
          trelloData: data,
          board: Object.keys(data)[0],
          boardCards: data[Object.keys(data)[0]],
          card: data[Object.keys(data)[0]][0],
        });
      }).catch(() => {
        this.setState({ trelloData: false });
      });
  }

  handleClick() {
    const startTime = new Date(this.state.startTime);
    const duration = (parseInt(this.state.hours || 0, 10) * 60) + parseInt(this.state.minutes || 0, 10);
    const trelloCard = this.state.card;
    const trelloBoard = this.state.board;
    Fetch.postJSON('/api/v1/timelogs', {
      timelog: {
        start_time: startTime.toISOString(),
        duration,
        trello_card: trelloCard,
        trello_board: trelloBoard,
      },
    })
      .then(() => {
        this.msg.success('Successfully created timelog!');
        this.setState({ redirect: true });
      }).catch((errorResponse) => {
        this.msg.error(errorResponse.errors);
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

  boardChange(event) {
    this.setState({
      board: event.target.value,
      boardCards: this.state.trelloData[event.target.value],
      card: this.state.trelloData[event.target.value][0] || null,
    });
  }

  render() {
    if (this.state.redirect) {
      return (
        <Redirect to="/user/timelogs" />
      );
    }

    return (
      <div id="new_timelog" className="form-group well col-md-4 col-md-offset-4">
        <div>
          <h2>Create a new timelog!</h2>
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
            onChange={this.boardChange}
          >
            {Object.keys(this.state.trelloData).map(option =>
              <option key={option} value={option}>{option}</option>)}
          </Select>
          <br />
          <Select
            className="form-control"
            onChange={e => this.setState({ card: e.target.value })}
          >
            {this.state.boardCards.map(option =>
              <option key={option} value={option}>{option}</option>)}
          </Select>
          <br />
          <button
            className="btn btn-success"
            onClick={this.handleClick}
          >
            Create
          </button>
        </div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

export default NewUserTimelog;
