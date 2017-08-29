import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class Timelogs extends React.Component {

  render() {
    var timelogs = this.props.timelogs.map((timelog) => {
    return (
      <div key={timelog.id}>
        <h4>Start time: {timelog.start_time}</h4>
        <h4>Duration: {timelog.duration} min</h4>
        <h4>Trello card: {timelog.trello_card}</h4>
        <h4>End time: {timelog.end_time}</h4>
        <br />
      </div>
    )
    })
    return(
      <div id="timelogs">
        {timelogs}
      </div>
    )
  }
}

ReactDOM.render(
  <Timelogs />,
  document.body.appendChild(document.createElement('div'))
);

export default Timelogs;