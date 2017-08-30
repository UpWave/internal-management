import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Timelogs from './timelogs.jsx'
import NewTimelog from './new_timelog.jsx'

class Body extends React.Component {

  constructor(props) {
    super(props);
    this.state = { timelogs: [], trello_cards: [] };
    this.handleSubmit = this.handleSubmit.bind(this, this.state);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.removeTimelog = this.removeTimelog.bind(this, this.state);
    this.updateTimelogs = this.updateTimelogs.bind(this, this.state);
    this.loadTimelogs = this.loadTimelogs.bind(this);
    this.filterByDuration = this.filterByDuration.bind(this, this.state);
    this.filterByStartTime = this.filterByStartTime.bind(this, this.state);
    this.filterByEndTime = this.filterByEndTime.bind(this, this.state);
  }

  loadTimelogs() {
    $.getJSON('/api/v1/timelogs.json', (response) => { this.setState({ timelogs: response }) });
  }

  componentDidMount() {
    this.loadTimelogs();
    $.getJSON('/api/v1/timelogs/trello_cards.json', (response) => { this.setState({ trello_cards: response }) });
  }

  handleSubmit(timelog) {
    this.loadTimelogs();
  }

  handleDelete(id) {
    $.ajax({
      url: `/api/v1/timelogs/${id}`,
      type: 'DELETE',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      success:() => {
        this.removeTimelog(id);
      }
    });
  }

  filterByDuration(){
    var timelogs = this.state.timelogs.sort(function(a,b) { return a.duration > b.duration; });
    this.setState({timelogs: timelogs })
  }

  filterByStartTime(){
    var timelogs = this.state.timelogs.sort(function(a,b) { return a.start_time > b.start_time; });
    this.setState({timelogs: timelogs })
  }

  filterByEndTime(){
    var timelogs = this.state.timelogs.sort(function(a,b) { return a.end_time > b.end_time; });
    this.setState({timelogs: timelogs })
  }

  removeTimelog(timelog_id) {
    this.loadTimelogs();
    //var newTimelogs = this.state.timelogs.filter(function(timelog) {
    //  return timelog.id != timelog_id;
    //});
    //this.setState({ timelogs: newTimelogs });
  }

  handleUpdate(timelog) {
    $.ajax({
      url: `/api/v1/timelogs/${timelog.id}`,
      type: 'PATCH',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      data: { timelog: timelog },
      success: () => {
        this.updateTimelogs(timelog);
      }
    });
  }

  updateTimelogs(timelog) {
    this.loadTimelogs();
    //var timelogs = this.state.timelogs.filter((i) => { return i.id != timelog.id });
    //timelogs.push(timelog);
    //this.setState({timelogs: timelogs })
  }

  render() {
    return (
      <div>
        Filter by:
        <button onClick={this.filterByDuration}>Duration</button>
        <button onClick={this.filterByStartTime}>Start time</button>
        <button onClick={this.filterByEndTime}>End time</button>
        <Timelogs key={this.state.timelogs.length.toString()} trello_cards={this.state.trello_cards} timelogs={this.state.timelogs}  handleDelete={this.handleDelete} onUpdate={this.handleUpdate}/>
        <NewTimelog key='new_timelog' trello_cards={this.state.trello_cards} handleSubmit={this.handleSubmit} />
      </div>
    )
  }
}

ReactDOM.render(
  <Body />,
  document.getElementById('root')
);