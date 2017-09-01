import React from 'react';
import Select from 'react-normalized-select';

class NewTimelog extends React.Component {

  constructor(props) {
    super(props);
    this.state = { card: false };
  }

  handleClick() {
    const startTime  = this.refs.start_time.value;
    const duration = this.refs.duration.value;
    const trelloCard = this.state.card || this.props.trello_cards[0];
    $.ajax({
      url: '/api/v1/timelogs',
      type: 'POST',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      data: { timelog: { start_time: startTime, duration: duration, trello_card: trelloCard } },
      success: (timelog) => {
        this.props.handleSubmit();
      }
    });
  }
  render() {
    return (
      <div id="newtimelog">
        <h3>Create a new timelog!</h3>
        <input type="datetime-local" ref='start_time' /><br />
        <input type="number" ref='duration' placeholder="Enter the duration in minutes" /><br />
        <Select className="mySelect" onChange={e => this.setState({ card: e.target.value })}>
          {this.props.trello_cards.map(option => <option key={option} value={option}>{option}</option>)}
          }
        </Select>
        <br />
        <button onClick={this.handleClick.bind(this)}>Create</button><br />
      </div>
    );
  }
}
export default NewTimelog;
