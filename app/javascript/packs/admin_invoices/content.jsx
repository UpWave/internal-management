import React from 'react';
import PropTypes from 'prop-types';

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
      return (
        <div className="well">
          <div className="row">
            {content}
          </div>
          <h3>Total duration: {hoursMins}</h3>
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
};

export default Content;
