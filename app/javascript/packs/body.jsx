import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Timelogs from './timelogs.jsx'
import NewTimelog from './new_timelog.jsx'

//TODO:
//Each child in an array or iterator should have a unique "key" prop.
//Rerender after Deleting
//Datetime default value
//Dropdown select for trello cards

class Body extends React.Component {

  constructor(props) {
    super(props);
    this.state = { timelogs: [] };
    this.handleSubmit = this.handleSubmit.bind(this, this.state);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.removeTimelog = this.removeTimelog.bind(this, this.state);
    this.updateTimelogs = this.updateTimelogs.bind(this, this.state);
  }

  componentDidMount() {
    $.getJSON('/api/v1/timelogs.json', (response) => { this.setState({ timelogs: response }) });
    $.getJSON('/api/v1/timelogs/trello_cards.json', (response) => { this.setState({ trello_cards: response }) });
  }

  handleSubmit(timelog) {
    var newState = this.state.timelogs.concat(timelog);
    this.setState({ timelogs: newState })
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

  removeTimelog(id) {
    var newTimelogs = this.state.timelogs.filter((timelog) => {
      return timelog.id != id;
    });
    this.setState({ timelogs: newTimelogs });
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
    var timelogs = this.state.timelogs.filter((i) => { return i.id != timelog.id });
    timelogs.push(timelog);
    this.setState({timelogs: timelogs })
  }

  render() {
    return (
      <div key='body'>
        <Timelogs key={this.state.timelogs.length} trello_cards={this.state.trello_cards} timelogs={this.state.timelogs}  handleDelete={this.handleDelete} onUpdate={this.handleUpdate}/>
        <NewTimelog trello_cards={this.state.trello_cards} handleSubmit={this.handleSubmit} />
      </div>
    )
  }
}

ReactDOM.render(
  <Body key='main'/>,
  document.getElementById('root')
);