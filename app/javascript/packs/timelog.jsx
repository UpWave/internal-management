import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-normalized-select';

class Timelog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      card: this.props.timelog.trelloCard,
    };
    this.handleEdit = this.handleEdit.bind(this, this.state);
  }

  handleEdit() {
    if (this.state.editable) {
      const id = this.props.timelog.id;
      const startTime = this.refs.startTime.value;
      const duration = this.refs.duration.value;
      const trelloCard = this.state.card;
      const timelog = { id, start_time: startTime, duration, trello_card: trelloCard };
      this.props.handleUpdate(timelog);
    }
    this.setState({ editable: !this.state.editable });
  }

  render() {
    const startTime = this.state.editable ?
      <input type="datetime-local" ref="startTime" defaultValue={this.props.timelog.start_time.substring(0, this.props.timelog.start_time.length - 5)} />
      :
      <p>Start time: {this.props.timelog.start_time.substring(0, this.props.timelog.start_time.length - 5)}</p>;
    const duration = this.state.editable ?
      <input type="number" ref="duration" defaultValue={this.props.timelog.duration} />
      :
      <p>Duration: {this.props.timelog.duration}</p>;
    const trelloCard = this.state.editable ?
      (<Select className="mySelect" onChange={e => this.setState({ card: e.target.value })}>
        {this.props.trelloCards.map(option => <option key={option} value={option}>{option}</option>)}
      </Select>)
      :
      <p>Trello card: {this.props.timelog.trello_card}</p>;
    const endTime = this.state.editable ?
      null
      :
      <p>End time: {this.props.timelog.end_time.substring(0, this.props.timelog.start_time.length - 5)}</p>;

    return (
      <div key={this.props.timelog.id}>
        {startTime}
        {duration}
        {trelloCard}
        {endTime}
        <button onClick={this.props.handleDelete}> Delete</button>
        <button onClick={this.handleEdit}> {this.state.editable ? 'Submit' : 'Edit' } </button>
      </div>
    );
  }
}

Timelog.propTypes = {
  timelog: PropTypes.arrayOf.isRequired,
  trelloCards: PropTypes.arrayOf.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
export default Timelog;
