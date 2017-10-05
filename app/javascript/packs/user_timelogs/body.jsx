import React from 'react';
import ReactPaginate from 'react-paginate';
import AlertContainer from 'react-alert';
import Timelogs from './timelogs';
import NewTimelog from './new_timelog';
import Fetch from '../Fetch';

class UserTimelogs extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      timelogs: [],
      trelloCards: [],
      page: 0,
      pageCount: 1,
      perPage: 2,
      startTime: 0,
      endTime: 0,
      filter: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.removeTimelog = this.removeTimelog.bind(this);
    this.loadTimelogs = this.loadTimelogs.bind(this);
    this.filterByDuration = this.filterByDuration.bind(this);
    this.filterByStartTime = this.filterByStartTime.bind(this);
    this.filterByEndTime = this.filterByEndTime.bind(this);
    this.filterByTimeRange = this.filterByTimeRange.bind(this);
    this.discardFilter = this.discardFilter.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.checkDateSubmitVisibility = this.checkDateSubmitVisibility.bind(this);
  }

  componentDidMount() {
    Fetch.json('/api/v1/timelogs/trello_cards')
      .then((data) => {
        this.setState({ trelloCards: data });
      });
    this.loadTimelogs();
  }

  loadTimelogs() {
    // Get number of timelogs for pageCount
    Fetch.json('/api/v1/timelogs/count_timelogs', {
      limit: 0,
      page: 0,
      start_time: this.state.startTime,
      end_time: this.state.endTime,
      filter: this.state.filter,
    })
      .then((data) => {
        this.setState({ pageCount: Math.ceil(data / this.state.perPage) });
      });
    // Get only few timelogs for current page
    Fetch.json('/api/v1/timelogs', {
      limit: this.state.perPage,
      page: this.state.page,
      start_time: this.state.startTime,
      end_time: this.state.endTime,
      filter: this.state.filter,
    })
      .then((data) => {
        this.setState({ timelogs: data });
      });
  }

  handleSubmit() {
    this.loadTimelogs();
  }

  handleDelete(id) {
    Fetch.deleteJSON(`/api/v1/timelogs/${id}`)
      .then(() => {
        this.msg.success('Successfully removed timelog');
        this.removeTimelog(id);
      });
  }

  filterByDuration() {
    this.setState({ filter: 'duration' }, () => {
      this.loadTimelogs();
    });
  }

  filterByStartTime() {
    this.setState({ filter: 'start_time' }, () => {
      this.loadTimelogs();
    });
  }

  filterByEndTime() {
    this.setState({ filter: 'end_time' }, () => {
      this.loadTimelogs();
    });
  }

  filterByTimeRange() {
    this.setState({ filter: '' }, () => {
      this.loadTimelogs();
    });
  }

  removeTimelog() {
    if (this.state.timelogs.length === 1) {
      if (this.state.page !== 0) {
        this.setState({ page: this.state.page - 1 });
      }
    }
    this.loadTimelogs();
  }

  handleUpdate(timelog) {
    Fetch.putJSON(`/api/v1/timelogs/${timelog.id}`, {
      timelog: timelog,
    })
      .then(() => {
        this.msg.success('Successfully updated timelog');
        this.loadTimelogs();
      });
  }

  handlePageClick(page) {
    this.setState({ page: page.selected }, () => {
      this.loadTimelogs();
    });
  }

  handleStartDateChange(event) {
    this.setState({ startTime: event.target.value }, () => {
      this.checkDateSubmitVisibility();
    });
  }

  handleEndDateChange(event) {
    this.setState({ endTime: event.target.value }, () => {
      this.checkDateSubmitVisibility();
    });
  }

  checkDateSubmitVisibility() {
    if (this.state.endTime > this.state.startTime) {
      $('#date_submit').css('visibility', 'visible');
    } else {
      $('#date_submit').css('visibility', 'hidden');
    }
  }

  discardFilter() {
    document.getElementById('start_date').value = '';
    document.getElementById('end_date').value = '';
    this.setState({
      startTime: 0,
      endTime: 0,
    }, () => {
      this.loadTimelogs();
      this.checkDateSubmitVisibility();
    });
  }

  render() {
    if (this.state.timelogs.length > 0) {
      return (
        <div className="well">
          <div className="row">
            <div className="col-md-4">
              <h3>Filter by</h3>
              <button className="btn btn-info" onClick={this.filterByDuration}>Duration</button>
              <button className="btn btn-info" onClick={this.filterByStartTime}>Start time</button>
              <button className="btn btn-info" onClick={this.filterByEndTime}>End time</button>
              <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={<a href="">...</a>}
                breakClassName={'break-me'}
                pageCount={this.state.pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
              />
            </div>
            <div className="col-md-3">
              <h3>Select time range</h3>
              <input className="form-control" type="datetime-local" id="start_date"
                     onChange={this.handleStartDateChange}/>
              <input className="form-control" type="datetime-local" id="end_date" onChange={this.handleEndDateChange}/>
              <button className="btn btn-info" id="date_discard" onClick={this.discardFilter}>X</button>
              {'  '}
              <button className="btn btn-info" id="date_submit" style={{visibility: 'hidden'}}
                      onClick={this.filterByTimeRange}>Submit
              </button>
              <br /><br />
            </div>
          </div>
          <h3>Timelogs</h3>
          <Timelogs
            key={this.state.timelogs.length.toString()}
            trelloCards={this.state.trelloCards}
            timelogs={this.state.timelogs}
            handleDelete={this.handleDelete}
            onUpdate={this.handleUpdate}
          />
          <NewTimelog
            key="new_timelog"
            trelloCards={this.state.trelloCards}
            handleSubmit={this.handleSubmit}
          />
          <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        </div>
      );
    }

    if (this.state.timelogs.length === 0) {
      return (
        <div className="well">
          <h3>There are no timelogs</h3>
          <NewTimelog
            key="new_timelog"
            trelloCards={this.state.trelloCards}
            handleSubmit={this.handleSubmit}
          />
        </div>
      );
    }

    if (this.state.trelloCards.length === 0) {
      return (
        <div>
          <h3>To create timelogs connect your <a href="/users/auth/trello">Trello</a> first
            and add cards to your boards</h3>
        </div>
      );
    }
  }
}

export default UserTimelogs;
