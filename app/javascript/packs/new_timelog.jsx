import React from 'react';
import Select from 'react-normalized-select';

class NewTimelog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      card: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const startTime = this.refs.start_time.value;
    const duration = this.refs.duration.value;
    const trelloCard = this.state.card || this.props.trelloCards[0];
    $.ajax({
      url: '/api/v1/timelogs',
      type: 'POST',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: { timelog: { start_time: startTime, duration, trello_card: trelloCard } },
      success: (timelog) => {
        this.props.handleSubmit();
      },
    });
  }
  render() {
    return (
      <div id="newtimelog">
        <h3>Create a new timelog!</h3>
        <input type="datetime-local" ref="start_time" /><br />
        <input type="number" ref="duration" placeholder="Enter the duration in minutes" /><br />
        <br />
        <button onClick={this.handleClick}>Create</button><br />
      </div>
    );
  }
}
export default NewTimelog;
