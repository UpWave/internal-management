import React from 'react';
import Select from 'react-normalized-select';
import AlertContainer from 'react-alert';
import Fetch from '../Fetch';
import { Redirect } from 'react-router';

class NewUserTimelog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      redirect: false,
      startTime: 0,
      trelloCards: [],
      card: "",
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleHoursChange = this.handleHoursChange.bind(this);
    this.handleMinutesChange = this.handleMinutesChange.bind(this);
    this.loadTrello = this.loadTrello.bind(this);
    this.handleTaskChange = this.handleTaskChange.bind(this);
    this.handleCardChange = this.handleCardChange.bind(this);
  }

  componentWillMount() {
    this.loadTrello();
  }

  loadTrello() {
    Fetch.json('/api/v1/timelogs/trello_cards')
      .then((data) => {
        this.setState({ trelloCards: data });
      }).catch(() => {
        this.setState({ trelloCards: false });
    });
  }

  handleClick() {
    const startTime = this.state.startTime;
    const task = this.state.task;
    const duration = (parseInt(this.state.hours || 0, 10) * 60) + parseInt(this.state.minutes || 0, 10);
    const trelloCard = this.state.card;
    Fetch.postJSON('/api/v1/timelogs', {
      timelog: {
        start_time: startTime,
        duration,
        task,
        trello_card: trelloCard,
      },
    })
      .then(() => {
        this.msg.success('Successfully created timelog!');
        this.setState({ redirect: true })
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

  handleTaskChange(event) {
    this.setState({ task: event.target.value });
    if (event.target.value.length > 0){
      $("#cards_dropdown").hide();
    } else {
      $("#cards_dropdown").show();
    }
  }

  handleCardChange(event){
    this.setState({ card: event.target.value })
    if (event.target.value != "") {
      $("#task").hide();
    } else {
      $("#task").show();
    }
  }

  render() {
    if (this.state.redirect){
      return (
        <Redirect to="/user/timelogs" />
      )
    }

    const trelloCards = this.state.trelloCards.length > 0 ?
       (
        <Select
          className="form-control"
          id="cards_dropdown"
          defaultValue={this.state.card}
          onChange={this.handleCardChange}
        >
          <option value="">Select Trello card</option>
          {this.state.trelloCards.map(option =>
          <option key={option} value={option}>{option}</option>)}
        </Select>
      )
      :
      null;

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
          <textarea
            className="form-control"
            id="task"
            height="20"
            onChange={this.handleTaskChange}
            placeholder="Describe the task you've been working on"
          />
          <br />
          {trelloCards}
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

export default NewUserTimelog;
