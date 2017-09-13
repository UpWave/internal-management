import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-normalized-select';

class NewVacation extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: '0',
      startDate: 0,
      endDate: 0,
      type: '',
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.checkSubmitVisibility = this.checkSubmitVisibility.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }

  handleClick() {
    const startDate = this.state.startDate;
    const endDate = this.state.endDate;
    const type = this.state.type;
    $.ajax({
      url: '/api/v1/vacations',
      type: 'POST',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: { vacation: { start_date: startDate, end_date: endDate, type: type } },
      success: () => {
        this.props.handleSubmit();
      },
    });
  }

  handleStartDateChange(event) {
    this.setState({ startDate: event.target.value }, () => {
      this.checkSubmitVisibility();
    });
  }

  handleEndDateChange(event) {
    this.setState({ endDate: event.target.value }, () => {
      this.checkSubmitVisibility();
    });
  }

  handleTypeChange(event) {
    this.setState({ type: event.target.value }, () => {
      this.checkSubmitVisibility();
    });
  }

  checkSubmitVisibility() {
    if ((this.state.type !== '') && (this.state.startDate.length !== 0)) {
      if (this.state.endDate > this.state.startDate) {
        $('#submit').css('visibility', 'visible');
      } else {
        $('#submit').css('visibility', 'hidden');
      }
    } else {
      $('#submit').css('visibility', 'hidden');
    }
  }

  render() {
    return (
      <div id="new_vacation">
        <h3>Request a new vacation!</h3>
        Select type of vacation:
        <Select
          defaultValue={this.state.value}
          className="mySelect"
          onChange={this.handleTypeChange}
        >
          <option value="0" disabled hidden>Type</option>
          {this.props.types.map(option =>
            <option key={option} value={option}>{option}</option>)}
        </Select><br />
        Start Date:
        <input type="date" onChange={this.handleStartDateChange} /><br />
        End Date:
        <input type="date" onChange={this.handleEndDateChange} /><br />
        <br />
        <button id="submit" style={{ visibility: 'hidden' }} onClick={this.handleClick}>Submit</button><br />
      </div>
    );
  }
}

NewVacation.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  types: PropTypes.arrayOf.isRequired,
};

export default NewVacation;
