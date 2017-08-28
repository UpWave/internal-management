import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export class Timelogs extends React.Component {

  constructor(props) {
    super(props);
    this.state = { timelogs: [] };
  }

  componentDidMount() {
    $.getJSON('/api/v1/timelogs.json', (response) => { this.setState({ timelogs: response }) });
  }

  render() {
    var timelogs = this.state.timelogs.map((timelog) => {
    return (
      <div key={timelog.id}>
        <h3>{timelog.start_time}</h3>
        <h3>{timelog.duration}</h3>
        <h3>{timelog.trello_card}</h3>
        <h3>{timelog.end_time}</h3>
      </div>
    )
    })
    return(
      <div>
        {timelogs}
      </div>
    )
  }
}

ReactDOM.render(
  <Timelogs />,
  document.body.appendChild(document.createElement('div'))
);