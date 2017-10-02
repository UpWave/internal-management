import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-normalized-select';
import Fetch from '../Fetch';

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
    Fetch.postJSON('/api/v1/vacations', {
      vacation: {
        start_date: startDate,
        end_date: endDate,
        type: type,
      },
    })
      .then(() => {
        this.props.handleSubmit();
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
    const start = Date.parse(this.state.startDate);
    const end = Date.parse(this.state.endDate);
    const days = parseInt((end - start) / (1000 * 60 * 60 * 24));

    const plannedVacation = this.state.type == 'planned vacation' && Math.abs(days) > 0 && Math.abs(days) <= 20;
    const sickLeave = this.state.type == 'sick leave' && Math.abs(days) > 0 && Math.abs(days) <= 5;
    const dayOffs = this.state.type == 'unpaid day offs' && Math.abs(days) > 0;

    if ((this.state.type !== '') && (this.state.startDate.length !== 0)) {
      if (sickLeave || plannedVacation || dayOffs ) {
        $('#submit').css('visibility', 'visible');
        $('#message').css('visibility', 'hidden');
      } else {
        $('#submit').css('visibility', 'hidden');
        $('#message').css('visibility', 'visible');
      }
    } else {
      $('#submit').css('visibility', 'hidden');
    }
  }


  render() {
    const message = this.state.type == 'planned vacation' ?
      (<p id="message" style={{visibility: 'hidden'}}>Planned vacation can not be longer than 20 days </p>)
      :
      (<p id="message" style={{visibility: 'hidden'}}>Sick leave can not be longer than 5 days</p>);
    return (
      <div className="row" id="new_vacation">
        <div className="col-sm-5">
          <div className="well">
            <h3 className="display-3">Request a new vacation!</h3>
            <div className="form-group">
              <Select
                className="form-control"
                defaultValue={this.state.value}
                onChange={this.handleTypeChange}
              >
                <option value="0" disabled hidden>Select type of vacation</option>
                {this.props.types.map(option =>
                  <option key={option} value={option}>{option}</option>)}
              </Select>
            </div>
            <div className="row">
              <div className="col-sm-5">
                <h4>Start Date</h4>
                <input type="date" className="form-control" onChange={this.handleStartDateChange} />
              </div>
              <div className="col-sm-5">
                <h4>End Date</h4>
                <input type="date" className="form-control" onChange={this.handleEndDateChange} />
              </div>
            </div>
            <br />
            {message}
            <button className="btn btn-success center-block" id="submit" style={{ visibility: 'hidden' }} onClick={this.handleClick}>Submit</button><br />
          </div>
        </div>
      </div>
    );
  }
}

NewVacation.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  types: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default NewVacation;
