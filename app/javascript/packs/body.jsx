import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Timelogs from './timelogs.jsx'

class Body extends React.Component {

  constructor(props) {
    super(props);
    this.state = { timelogs: [] };
  }

  componentDidMount() {
    $.getJSON('/api/v1/timelogs.json', (response) => { this.setState({ timelogs: response }) });
  }

  handleSubmit(timelog) {
    var newState = this.state.timelogs.concat(timelog);
    this.setState({ timelogs: newState })
  }

  handleDelete(id) {
    $.ajax({
      url: '/api/v1/timelogs/${id}',
      type: 'DELETE',
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
      url: '/api/v1/timelogs/${timelog.id}',
      type: 'PUT',
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
      <div>
        <Timelogs timelogs={this.state.timelogs}  handleDelete={this.handleDelete} onUpdate={this.handleUpdate}/>
      </div>
    )
  }
}

ReactDOM.render(
  <Body />,
  document.body.appendChild(document.createElement('div'))
);