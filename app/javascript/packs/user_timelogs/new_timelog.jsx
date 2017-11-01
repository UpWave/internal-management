import React from 'react';
import PropTypes from 'prop-types';
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
      board: '',
      card: '',
      boardCards: [],
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleHoursChange = this.handleHoursChange.bind(this);
    this.handleMinutesChange = this.handleMinutesChange.bind(this);
    this.handleTaskDescriptionChange = this.handleTaskDescriptionChange.bind(this);
    this.boardChange = this.boardChange.bind(this);
    this.loadTrello = this.loadTrello.bind(this);
  }

  componentWillMount() {
    this.loadTrello();
  }

  loadTrello() {
    Fetch.json('/api/v1/profile/trello_boards')
      .then(function(data) {
        this.setState({
          trelloData: data,
          boardCards: data[Object.keys(data)[0]],
        });
        this.setState({ loadingFinished: true });
      }.bind(this)).catch(() => {
        this.setState({ trelloData: false });
        this.setState({ loadingFinished: true });
    });
  }

  handleClick() {
    const startTime = this.state.startTime;
    const duration = (this.state.hours * 60) + parseInt(this.state.minutes, 10);
    const taskDescription = this.state.taskDescription;
    const trelloCard = this.state.card;
    const trelloBoard = this.state.board;
    Fetch.postJSON('/api/v1/timelogs', {
      timelog: {
        start_time: startTime,
        task_description: taskDescription,
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
    if (event.target.value !== '') {
      $('#task').hide();
    } else {
      $('#task').show();
      this.setState({ card: null });
    }
    this.setState({ board: event.target.value });
    this.setState({ boardCards: this.state.trelloData[event.target.value] });
    this.setState({ card: this.state.trelloData[event.target.value][0] || null });
  }

  handleTaskDescriptionChange(event) {
    this.setState({ taskDescription: event.target.value });
    if (event.target.value.length > 0){
      $('#cards_dropdown').hide();
    } else {
      $('#cards_dropdown').show();
    }
  }

  render() {
    if (this.state.redirect) {
      return (
        <Redirect to="/user/timelogs" />
      );
    }

    const cards = this.state.board !== '' ?
      (
        <Select
          className="form-control"
          onChange={e => this.setState({ card: e.target.value })}
        >
          {this.state.boardCards.map(option =>
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
          <br/>
          <input
            className="form-control"
            type="number"
            onChange={this.handleHoursChange}
            placeholder="Enter duration in hours"
          />
          <br/>
          <input
            className="form-control"
            type="number"
            onChange={this.handleMinutesChange}
            placeholder="Enter duration in minutes"
          />
          <br/>
          <textarea
            className="form-control"
            id="task"
            height="20"
            onChange={this.handleTaskDescriptionChange}
            placeholder="Describe the task you've been working on"
          />
          <br/>
          <div id="cards_dropdown">
            <Select
              className="form-control"
              defaultValue="Select Trello board"
              onChange={this.boardChange}
            >
              <option value=''>Select Trello board</option>
              {Object.keys(this.state.trelloData).map(option =>
                <option key={option} value={option}>{option}</option>)}
            </Select>
            <br/>
            {cards}
          </div>
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

NewUserTimelog.propTypes = {
  trelloData: PropTypes.shape().isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default NewUserTimelog;
