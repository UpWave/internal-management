import React from 'react';
import PropTypes from 'prop-types';

function timeToDecimal(time) {
  const arr = time.split(':');
  return parseFloat(parseInt(arr[0], 10) + '.' + parseInt((arr[1]/6)*10, 10));
}

function getBusinessDatesCount(startDate, endDate) {
  let count = 0;
  const curDate = startDate;
  while (curDate <= endDate) {
    const dayOfWeek = curDate.getDay();
    if (!((dayOfWeek === 6) || (dayOfWeek === 0))) {
      count += 1;
    }
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
}

class Content extends React.Component {
  render() {
    const timelogs = this.props.invoices.sort((a, b) => (
      a.start_time > b.start_time
    ));
    const totalDuration =
    timelogs.map(timelog => (timelog.duration)).reduce((sum, value) => (sum + value), 0);
    const minutes = totalDuration % 60;
    const hours = (totalDuration - minutes) / 60;
    const hoursMins = hours.toString().concat(':').concat((minutes < 10 ? '0' : '')).concat(minutes.toString());
    const income = this.props.salaryType === 'per hour' ?
      Math.round((timeToDecimal(hoursMins) * this.props.salary))
      :
      this.props.salary;
    const dayOffs = this.props.dayOffs;
    const date = new Date();
    const workingDays = getBusinessDatesCount(new Date(date.getFullYear(), date.getMonth(), 1), new Date(date.getFullYear(), date.getMonth() + 1, 0));
    const salaryPerDay = Math.round(this.props.salary / workingDays);
    const missedIncome = dayOffs * salaryPerDay;
    const content = timelogs.map(timelog => (
      <div className="col-sm-4" key={timelog.id}>
        <div className="well">
          <p>Issue: {timelog.trello_card}</p>
          <p>Duration: {timelog.duration}</p>
          <p>Start time: {timelog.start_time.substring(0, timelog.start_time.length - 5).replace('T', ' ')}</p>
          <p>End time: {timelog.end_time.substring(0, timelog.end_time.length - 5).replace('T', ' ')}</p>
        </div>
      </div>
    ));
    if (this.props.invoices.length !== 0) {
      if (this.props.salaryType === 'monthly') {
        return (
          <div className="well">
            <div className="row">
              {content}
            </div>
            <h3>Total duration: {hoursMins}</h3>
            <h3>Day offs: {dayOffs}</h3>
            <h3>Income: {income - missedIncome} $</h3>
          </div>
        );
      }
      return (
        <div className="well">
          <div className="row">
            {content}
          </div>
          <h3>Total duration: {hoursMins}</h3>
          <h3>Day offs: {dayOffs}</h3>
          <h3>Income: {income} $</h3>
        </div>
      );
    }
    return (
      <div className="well">
        <h1>No info</h1>
      </div>
    );
  }
}

Content.propTypes = {
  invoices: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    trello_card: PropTypes.string,
    duration: PropTypes.number,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
  })).isRequired,
  salary: PropTypes.number.isRequired,
  salaryType: PropTypes.string.isRequired,
  dayOffs: PropTypes.number.isRequired,
};

export default Content;
