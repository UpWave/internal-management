import React from 'react';
import Select from 'react-normalized-select';
import AlertContainer from 'react-alert';
import Fetch from '../Fetch';
import { Redirect } from 'react-router';

class NewAdminTimelog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      redirect: false,
      duration: 0,
      startTime: 0,
      trelloCards: [],
      card: null,
      userId: this.props.match.params.user_id,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleHoursChange = this.handleHoursChange.bind(this);
    this.handleMinutesChange = this.handleMinutesChange.bind(this);
    this.loadTrello = this.loadTrello.bind(this);
    this.handleTaskChange = this.handleTaskChange.bind(this);
    this.handleCardChange = this.handleCardChange.bind(this);
  }

  componentDidMount() {
    this.loadTrello();
  }

  loadTrello() {
    Fetch.json(`/api/v1/admin/user/users/${this.state.userId}/timelogs/trello_cards`)
      .then((data) => {
        this.setState({ trelloCards: data });
        $("#cards_dropdown").prepend("<option value='' selected='selected'></option>");
      }).catch(() => {
        this.setState({ trelloCards: false });
    });
  }

  handleClick() {
    const startTime = this.state.startTime;
    const duration = (parseInt(this.state.hours || 0, 10) * 60) + parseInt(this.state.minutes || 0, 10);
    const task = this.state.task;
    const trelloCard = this.state.card;
    Fetch.postJSON(`/api/v1/admin/user/users/${this.state.userId}/timelogs`, {
      timelog: {
        start_time: startTime,
        task,
        duration,
        trello_card: trelloCard,
      },
    })
      .then(() => {
        this.msg.success('Successfully created timelog!');
        this.setState({ redirect: true });
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

  handleTaskChange(event) {
    this.setState({ task: event.target.value });
    if (event.target.value.length > 0){
      $("#cards_dropdown").css("display", "none");
    } else {
      $("#cards_dropdown").css("display", "block");
    }
  }

  handleCardChange(event){
    this.setState({ card: event.target.value })
    if (event.target.value != null) {
      $("#task").css("display", "none");
    } else {
      $("#task").css("display", "none");
    }
  }
  render() {
    if (this.state.redirect){
      return (
        <Redirect to={"/admin/users/" + this.state.userId + "/timelogs"} />
      )
    }

    const trelloCards = this.state.trelloCards.length > 0 ?
      (
        <Select
          className="form-control"
          id="cards_dropdown"
          onChange={this.handleCardChange}
        >
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
            height="20"
            onChange={this.handleTaskChange}
            placeholder="Describe the task you've been working on"
          />
          <br />
          {trelloCards}
          <br />
          <button
            className="btn btn-success"
            id="submit"
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

export default NewAdminTimelog;
