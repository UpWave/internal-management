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
      userId: this.props.match.params.user_id,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleHoursChange = this.handleHoursChange.bind(this);
    this.handleMinutesChange = this.handleMinutesChange.bind(this);
    this.loadTrello = this.loadTrello.bind(this);
  }

  componentDidMount() {
    this.loadTrello();
  }

  loadTrello() {
    Fetch.json(`/api/v1/admin/user/users/${this.state.userId}/timelogs/trello_cards`)
      .then((data) => {
        this.setState({ trelloCards: data });
      }).catch(() => {
      this.setState({ trelloCards: false });
    });
  }

  handleClick() {
    const startTime = this.state.startTime;
    const duration = (parseInt(this.state.hours || 0, 10) * 60) + parseInt(this.state.minutes || 0, 10);
    const trelloCard = this.state.card || this.state.trelloCards[0];
    Fetch.postJSON(`/api/v1/admin/user/users/${this.state.userId}/timelogs`, {
      timelog: {
        start_time: startTime,
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

  render() {
    if (this.state.redirect){
      return (
        <Redirect to={"/admin/users/" + this.state.userId + "/timelogs"} />
      )
    }

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
            {this.state.trelloCards.map(option =>
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

export default NewAdminTimelog;
