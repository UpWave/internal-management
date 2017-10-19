import React from 'react';
import PropTypes from 'prop-types';
import Timelog from './timelog';

function makeSpanVisible(event) {
  $('#'.concat(event.target.id.concat('-span'))).css('visibility', 'visible')
}

function makeSpanHidden(event) {
  $('#'.concat(event.target.id.concat('-span'))).css('visibility', 'hidden')
}

class Timelogs extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleDelete = this.handleDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }
  onUpdate(timelog) {
    this.props.onUpdate(timelog);
  }

  handleDelete(id) {
    this.props.handleDelete(id);
  }

  render() {
    const timelogs = this.props.timelogs.map(timelog => (
      <Timelog
        id={timelog.id}
        key={timelog.id.toString()}
        trelloCards={this.props.trelloCards}
        timelog={timelog}
        handleDelete={this.handleDelete}
        handleUpdate={this.onUpdate}
      />
    ));
    return (
      <table id="table">
        <thead>
          <tr>
            <th>
              <span
                role="button"
                tabIndex={0}
                id="start-time"
                onMouseOver={makeSpanVisible}
                onMouseLeave={makeSpanHidden}
                onClick={this.props.filterByStartTime}
              >
              Start time
              </span>
              <i
                id="start-time-span"
                style={{ visibility: 'hidden' }}
                className={this.props.startTimeOrderBool ? 'fa fa-caret-down' : 'fa fa-caret-up'}
              />
            </th>
            <th>
              <span
                role="button"
                tabIndex={0}
                id="duration"
                onMouseOver={makeSpanVisible}
                onMouseLeave={makeSpanHidden}
                onClick={this.props.filterByDuration}
              >
              Duration
              </span>
              <i
                id="duration-span"
                style={{ visibility: 'hidden' }}
                className={this.props.durationOrderBool ? 'fa fa-caret-down' : 'fa fa-caret-up'}
              />
            </th>
            <th>
              <span
                role="button"
                tabIndex={0}
                id="trello-card"
                onMouseOver={makeSpanVisible}
                onMouseLeave={makeSpanHidden}
                onClick={this.props.filterByTrelloCard}
              >
              Trello Card
              </span>
              <i
                id="trello-card-span"
                style={{ visibility: 'hidden' }}
                className={this.props.trelloCardOrderBool ? 'fa fa-caret-down' : 'fa fa-caret-up'}
              />
            </th>
            <th>
              <span
                role="button"
                tabIndex={0}
                id="end-time"
                onMouseOver={makeSpanVisible}
                onMouseLeave={makeSpanHidden}
                onClick={this.props.filterByEndTime}
              >
              End Time
              </span>
              <i
                id="end-time-span"
                style={{ visibility: 'hidden' }}
                className={this.props.endTimeOrderBool ? 'fa fa-caret-down' : 'fa fa-caret-up'}
              />
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {timelogs}
        </tbody>
      </table>
    );
  }
}

Timelogs.propTypes = {
  timelogs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    trello_card: PropTypes.string,
    duration: PropTypes.number,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
  })).isRequired,
  trelloCards: PropTypes.arrayOf(PropTypes.string).isRequired,
  onUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  filterByDuration: PropTypes.func.isRequired,
  filterByStartTime: PropTypes.func.isRequired,
  filterByEndTime: PropTypes.func.isRequired,
  filterByTrelloCard: PropTypes.func.isRequired,
  durationOrderBool: PropTypes.bool.isRequired,
  startTimeOrderBool: PropTypes.bool.isRequired,
  endTimeOrderBool: PropTypes.bool.isRequired,
  trelloCardOrderBool: PropTypes.bool.isRequired,
};

export default Timelogs;
