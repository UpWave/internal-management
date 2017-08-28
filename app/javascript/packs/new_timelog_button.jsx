import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export class NewTimelog extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { timelogs: [] };
  }

  handleClick() {
    var start_time  = this.refs.start_time.value;
    var duration = this.refs.duration.value;
    var trello_card = this.refs.duration.value;
      $.ajax({
        url: '/api/v1/timelogs',
        type: 'POST',
        data: { timelog: { start_time: start_time, duration: duration, trello_card: trello_card } },
        success: (timelog) => {
            this.props.handleSubmit(timelog);
            }
        });
    }
    render() {
      return (
        <div>
          <input type="date" ref='start_time' /><br />
          <input type="number" ref='duration' placeholder='Enter the duration in minutes' /><br />
          <input type="text" ref='trello_card' /><br />
          <button onClick={this.handleClick.bind(this)}>Submit</button><br />
        </div>
      )
    }
}
  


ReactDOM.render(
  <NewTimelog />,
  document.body.appendChild(document.getElementById('timelogs'))
);