import React from 'react';
import Fetch from 'fetch-rails';
import AlertContainer from 'react-alert';
import Vacations from './vacations';

class AdminVacations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vacations: [],
      approved: '',
      rejected: '',
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.loadVacations = this.loadVacations.bind(this);
    this.loadStatuses = this.loadStatuses.bind(this);
  }

  componentDidMount() {
    this.loadVacations();
    this.loadStatuses();
  }

  loadVacations() {
    Fetch.json('/api/v1/admin/vacations')
      .then((data) => {
        this.setState({ vacations: data });
      });
  }
  loadStatuses() {
    Fetch.json('/api/v1/admin/vacations/statuses')
      .then((data) => {
        this.setState({
          approved: data.approved_status,
          rejected: data.rejected_status,
        });
      });
  }

  handleUpdate(id, status) {
    Fetch.putJSON(`/api/v1/admin/vacations/${id}`, {
      vacation: { status: status },
    })
      .then(() => {
        this.msg.success(`Vacation status setted to ${status}`);
        this.loadVacations();
      }).catch((errorResponse) => {
        this.msg.error(errorResponse.errors);
      });
  }


  render() {
    return (
      <div className="well">
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <Vacations
          key={this.state.vacations.length.toString()}
          vacations={this.state.vacations}
          approved={this.state.approved}
          rejected={this.state.rejected}
          onUpdate={this.handleUpdate}
        />
      </div>
    );
  }
}


export default AdminVacations;
