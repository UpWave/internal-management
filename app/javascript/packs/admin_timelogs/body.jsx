import React from 'react';
import ReactPaginate from 'react-paginate';
import AlertContainer from 'react-alert';
import Timelogs from './timelogs';
import Fetch from '../Fetch';
import { Link } from 'react-router-dom';


class AdminTimelogs extends React.Component {
  constructor(props, context) {
    super(props, context);
    // regex for parsing user_id from URL
    this.userIdPattern = /users\/\d+/g;
    // parsing user_id from current URL
    this.userId = window.location.href.match(this.userIdPattern)[0].replace('users/', '');
    this.state = {
      timelogs: [],
      loadingFinished: false,
      page: 0,
      pageCount: 1,
      perPage: 4,
      startTime: 0,
      endTime: 0,
      filter: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.removeTimelog = this.removeTimelog.bind(this);
    this.updateTimelogs = this.updateTimelogs.bind(this);
    this.loadTrello = this.loadTrello.bind(this);
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
    this.loadTimelogs = this.loadTimelogs.bind(this);
  }

  componentDidMount() {
    this.loadTrello();
    this.loadTimelogs();
  }

  loadTrello() {
    Fetch.json(`/api/v1/admin/user/users/${this.userId}/timelogs/trello_cards`)
      .then((data) => {
        this.setState({ trelloCards: data });
        this.setState({ loadingFinished: true });
      }).catch(() => {
        this.setState({ trelloCards: false });
        this.setState({ loadingFinished: true });
    });
  }

  loadTimelogs() {
    // Get number of timelogs for pageCount
    Fetch.json(`/api/v1/admin/user/users/${this.userId}/timelogs/count_timelogs`, {
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
    Fetch.json(`/api/v1/admin/user/users/${this.userId}/timelogs`, {
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
    Fetch.deleteJSON(`/api/v1/admin/user/users/${this.userId}/timelogs/${id}`)
      .then(() => {
        this.removeTimelog(id);
        this.msg.success('Timelog deleted');
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
    Fetch.putJSON(`/api/v1/admin/user/users/${this.userId}/timelogs/${timelog.id}`, {
      timelog: timelog,
    })
      .then(() => {
        this.msg.success('Timelog updated');
        this.updateTimelogs();
      }).catch((errorResponse) => {
        this.msg.error(errorResponse.errors);
    });
  }

  updateTimelogs() {
    this.loadTimelogs();
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
    const filterCols = this.state.timelogs.length > 0 ?
      (<div>
        <div className="col-md-4">
          <h3>Filter by</h3>
          <button
            className="btn btn-info"
            onClick={this.filterByDuration}
          >
            Duration
          </button>
          <button
            className="btn btn-info"
            onClick={this.filterByStartTime}
          >
            Start time
          </button>
          <button
            className="btn btn-info"
            onClick={this.filterByEndTime}
          >
            End time
          </button>
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
          <input
            className="form-control"
            type="datetime-local"
            id="start_date"
            onChange={this.handleStartDateChange}
          />
          <input
            className="form-control"
            type="datetime-local"
            id="end_date"
            onChange={this.handleEndDateChange}
          />
          <button
            className="btn btn-info"
            id="date_discard"
            onClick={this.discardFilter}
          >
            X
          </button>
          <span style={{ paddingLeft: '20px' }} />
          <button
            className="btn btn-info"
            id="date_submit"
            style={{ visibility: 'hidden' }}
            onClick={this.filterByTimeRange}
          >
            Submit
          </button>
        </div>
      </div>)
      :
      null;
    const timelogsTable = this.state.timelogs.length > 0 ?
      (<div className="w3l-table-info">
        <Timelogs
          key="timelogs"
          userId={this.userId}
          trelloCards={this.state.trelloCards || []}
          timelogs={this.state.timelogs || []}
          handleSubmit={this.handleSubmit}
          handleDelete={this.handleDelete}
          onUpdate={this.handleUpdate}
        />
      </div>)
      :
      null;
    const trelloCards = (this.state.trelloCards);
    const loadingFinished = (this.state.loadingFinished);
    const mainComponent = (loadingFinished) ?
      (<div className="agile-grids">
        <div className="agile-tables">
          {timelogsTable}
          <div className="row">
            {filterCols}
            <div className="col-md-3">
              <h3>Download</h3>
              <a
                href={`/api/v1/admin/user/users/${this.userId}/timelogs.pdf`
                  .concat('?filter=')
                  .concat(this.state.filter)
                  .concat('&start_time=')
                  .concat(this.state.startTime)
                  .concat('&end_time=')
                  .concat(this.state.endTime)}
              ><button className="btn btn-primary">Download PDF</button></a>
              <a
                href={`/api/v1/admin/user/users/${this.userId}/timelogs.csv`
                  .concat('?filter=')
                  .concat(this.state.filter)
                  .concat('&start_time=')
                  .concat(this.state.startTime)
                  .concat('&end_time=')
                  .concat(this.state.endTime)}
              ><button className="btn btn-primary">Download CSV</button></a>
            </div>
          </div>
          <div>
            <Link to={'/admin/'+ this.userId + '/new_timelog'} className="btn btn-success">Add New Timelog</Link>
          </div>
        </div>
      </div>)
      :
      null;
    function renderAll() {
      if (loadingFinished && (trelloCards === false)) {
        return (<div>
          <h1>Current user has not connected Trello account</h1>
          {mainComponent}
        </div>);
      }
      return mainComponent;
    }
    return (
      <div>
        {renderAll()}
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

export default AdminTimelogs;
