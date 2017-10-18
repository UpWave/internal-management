import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
import 'moment-business-days';


class Content extends React.Component {
  render() {
    const timelogs = this.props.invoices;
    const totalDuration =
    timelogs.map(timelog => (timelog.duration)).reduce((sum, value) => (sum + value), 0);
    const hoursMins = moment.duration(totalDuration, 'minutes').format('HH:mm');
    const decimalTotalDuration = moment.duration(totalDuration, 'minutes').format('h', 2);
    const income = this.props.salaryType === 'per hour' ?
      Math.round(decimalTotalDuration * this.props.salary)
      :
      this.props.salary;
    const dayOffs = this.props.dayOffs;
    const businessDays = (moment().monthBusinessDays()).length;
    const salaryPerDay = Math.round(this.props.salary / businessDays);
    const missedIncome = dayOffs * salaryPerDay;
    const tableHead =
    (<thead>
      <tr>
        <th>Issue</th>
        <th>Duration</th>
        <th>Start time</th>
        <th>End time</th>
      </tr>
    </thead>);
    const content = timelogs.map(timelog => (
      <tr key={timelog.id}>
        <td>{timelog.trello_card}</td>
        <td>{timelog.duration}</td>
        <td>
          {moment(timelog.start_time.slice(0, -5)).format('YYYY/MM/DD, HH:mm')}
        </td>
        <td>
          {moment(timelog.end_time.slice(0, -5)).format('YYYY/MM/DD, HH:mm')}
        </td>
      </tr>
    ));
    if (this.props.invoices.length !== 0) {
      if (this.props.salaryType === 'monthly') {
        return (
          <div>
            <table id="table">
              {tableHead}
              <tbody>
                {content}
              </tbody>
            </table>
            <h3>Total duration: {hoursMins}</h3>
            <h3>Day offs: {dayOffs}</h3>
            <h3>Income: {income - missedIncome} $</h3>
          </div>
        );
      }
      return (
        <div>
          <table id="table">
            {tableHead}
            <tbody>
              {content}
            </tbody>
          </table>
          <h3>Total duration: {hoursMins}</h3>
          <h3>Day offs: {dayOffs}</h3>
          <h3>Income: {income} $</h3>
        </div>
      );
    }
    return (
      <h1>No info</h1>
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
