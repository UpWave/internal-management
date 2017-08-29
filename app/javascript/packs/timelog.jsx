import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class Timelog extends React.Component {

  constructor(props) {
    super(props);
    this.state = { editable: false };
    this.handleEdit = this.handleEdit.bind(this, this.state);
  }

  handleEdit() {
    if(this.state.editable) {
      var id = this.props.timelog.id;
      var start_time = this.refs.start_time.value;
      var duration = this.refs.duration.value;
      var trello_card = this.refs.trello_card.value;
      var timelog = {id: id , start_time: start_time , duration: duration, trello_card: trello_card};
      this.props.handleUpdate(timelog);
    }
    this.setState({ editable: !this.state.editable })
  }

  render() {
    var start_time = this.state.editable ? <input type='date' ref='start_time' defaultValue={this.props.timelog.start_time}/>: <p>{this.props.timelog.start_time}</p>;
    var duration = this.state.editable ? <input type='number' ref='duration' defaultValue={this.props.timelog.duration}/>: <p>{this.props.timelog.duration}</p>;
    var trello_card = this.state.editable ? <input type='text' ref='trello_card' defaultValue={this.props.timelog.trello_card}/>: <p>{this.props.timelog.trello_card}</p>;
    return (
      <div>
        Duration: {duration}
        Trello card: {trello_card}
        Start time: {start_time}        
        <button onClick={this.props.handleDelete}> Delete</button>
        <button onClick={this.handleEdit}> {this.state.editable ? 'Submit' : 'Edit' } </button>
      </div>
    )
  }
}

export default Timelog;