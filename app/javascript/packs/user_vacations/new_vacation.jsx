import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-normalized-select';

class NewVacation extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      startDate: 0,
      endDate: 0,
      vacationType: '',
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.checkSubmitVisibility = this.checkSubmitVisibility.bind(this);
  }

  handleClick() {
    const startDate = this.state.startDate;
    const endDate = this.state.endDate;
    const vacationType = this.state.vacationType;
    $.ajax({
      url: '/api/v1/vacations',
      type: 'POST',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: { vacation: { start_date: startDate, end_date: endDate, type: vacationType } },
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

  checkSubmitVisibility() {
    if (this.state.endDate > this.state.startDate) {
      $('#submit').css('visibility', 'visible');
    } else {
      $('#submit').css('visibility', 'hidden');
    }
  }

  render() {
    return (
      <div id="new_vacation">
        <h3>Request a new vacation!</h3>
        Select type of vacation:
        <Select className="mySelect" onChange={e => this.setState({ vacationType: e.target.value })}>
          {this.props.vacationTypes.map(option =>
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
  vacationTypes: PropTypes.arrayOf.isRequired,
};

export default NewVacation;
